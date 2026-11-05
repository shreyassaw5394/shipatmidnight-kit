---
name: token-economy
description: Use when work is split across several agents, executors or GSD waves, before spawning agents or choosing models, or after a usage limit stops agents. Keeps runs lean and resumable. Not for single-agent tasks.
version: 1.0.0
license: MIT
metadata:
  author: Ship at Midnight Authors <65935477+shreyassaw5394@users.noreply.github.com>
  tags: [agents, cost, parallelism, git]
---

# Token economy

## Purpose

A usage limit can stop every running agent at once, and parallel agents that each re-read the whole project use the window fastest. This skill keeps multi-agent runs lean: few agents, the right model per task, short prompts, scoped tests, short reports, safe parallel commits, and resume instead of restart.

## Prerequisites

- Claude Code with the ability to spawn agents (the Agent tool) and message them (`SendMessage`).
- A git repository. The commit recipe in section 6 needs `git` and a POSIX-style shell (bash or zsh).
- For GSD runs: GSD installed, and a conventions file for the project (see the `vision` skill's template).

## Instructions

### 0. Ceremony only for ground-up work

GSD (planner, plan-check, executors, verifier) is for a new project or a big new phase: several files, more than one session, a plan worth checking. A small local task (a fix, a doc edit, a config change, a single-file feature) is done directly, or with one small agent on the mid model, then the project's own checks and one commit. No planner, no plan-check, no executor wave. Say which path you are taking and why before you start.

### 1. Parallelism: 2-3 agents at a time

- Prefer 2-3 agents at a time. Each executor carries its own context, so more of them cost more, and a limit hit stops all of them.
- Batch small plans (one file, one config, one doc) into a single executor instead of one agent each.
- Run dependent work in sequence. Only independent plans go in the same wave.

### 2. Model per task

| Work | Model |
|---|---|
| Executors on a well-specified plan, reviewers, checks | mid (`sonnet`-class) |
| Mechanical fixes: build errors, renames, lint, formatting | small (`haiku`-class) |
| Planning, architecture, design judgement, anything the owner will judge by taste | frontier |

Spend the frontier model where a wrong call is expensive to undo. A good plan lets a cheaper model execute it. If a cheap model fails twice on the same task, move it up one tier instead of retrying.

### 3. Short executor prompts

An executor prompt is a pointer, not a briefing:

- The plan file path.
- The conventions file path (one file per phase or project: stack, style, commands, do/don't).
- Only the earlier summaries (one or two) that this plan directly depends on.
- The success check to run.

Leave the plan text out of the prompt, and leave out instructions to read every earlier summary or to re-explain finished work.

### 4. Tests: scoped per commit, full at wave ends

- Before each commit, the executor runs only the tests, typecheck and lint for what it touched.
- The orchestrator runs the full suite and build once, at the end of each wave.
- Compare failures with the main branch and report pre-existing ones separately.

### 5. Short reports

Every agent report, and every status line to the owner, has three parts:

1. **Changed**: files and behaviour, a line each.
2. **Unverified**: what was not run or could not be checked.
3. **Owner decisions**: questions only the owner can answer. Collect them into one list at the end.

Skip narrative, restating the plan and repeating earlier results.

### 6. Parallel commits: lock plus private index

Parallel executors share one working tree and one git index. Two agents running `git add` and `git commit` at once can stage each other's files or fail on the index lock. Give each commit a lock and its own index. The cleanup step is named `commit_cleanup`: it removes only the lock directory and the private index file that the same call created, and nothing else.

```bash
# Parallel-safe commit helper: one committer at a time, staged through a private index file.
commit_cleanup() {  # removes only this call's own lock directory and private index file
  unset GIT_INDEX_FILE
  if [ -n "${commit_idx:-}" ] && [ -f "$commit_idx" ]; then unlink "$commit_idx"; fi
  if [ -n "${commit_lock:-}" ] && [ -d "$commit_lock" ]; then rmdir "$commit_lock"; fi
}
commit_files() {  # usage: commit_files "message" file1 file2 ...
  local msg="$1" rc=0
  shift
  commit_lock="$(git rev-parse --git-dir)/commit.lock"
  commit_idx="$(git rev-parse --git-dir)/commit-index.$$"   # private index path for this call only
  until mkdir "$commit_lock" 2>/dev/null; do sleep 1; done  # one committer at a time
  export GIT_INDEX_FILE="$commit_idx"
  git read-tree HEAD && git add -- "$@" && git commit -q -m "$msg" || rc=$?
  commit_cleanup                                            # always runs, success or failure
  if [ "$rc" -eq 0 ]; then git restore --staged -- "$@"; fi  # sync the shared index to the new HEAD
  return "$rc"
}
```

Rules: each agent lists its files explicitly (stage named paths, not the whole tree), takes the lock only around the commit, and keeps the lock window short. If a stale lock directory remains after a crash and no agent is committing, remove that one lock directory by hand.

### 7. When a usage limit stops agents

- Resume the stopped work rather than restarting it. Fresh agents re-read everything and redo finished steps.
- Wait for the reset, then resume each stopped agent by message (`SendMessage` to its id): "continue from where you stopped".
- First check the tree: `git status` and `git log` show what landed. Tell the agent only what is already committed.
- If an agent cannot be resumed, start one replacement with the plan path, the conventions file, and the list of already-committed work.
- After a limit hit, drop to 1-2 agents for the rest of the window.

### 8. Quick check before spawning

- [ ] Three agents or fewer?
- [ ] Cheapest model that can do each task?
- [ ] Prompt is paths only, plus the one or two relevant summaries?
- [ ] Conventions file exists and has a token-economy line?
- [ ] Commit recipe from section 6 included for parallel agents?
- [ ] Report format (changed / unverified / owner decisions) stated?

See "Saving tokens with GSD" in `${CLAUDE_PLUGIN_ROOT}/PLAYBOOK.md` for the GSD settings that go with this.

## Examples

```text
Task: add input validation to three independent endpoints.
Path: direct, one mid-model agent (small, local, no plan needed).
Prompt: "Plan: .planning/phases/02/PLAN.md. Conventions: .planning/CONVENTIONS.md. Run the endpoint tests, then commit_files."
Report: Changed (3 files) / Unverified (full suite not run) / Owner decisions (none).
```

## Limitations

- The guidance is advisory: nothing here enforces agent counts or model choice. The pins in the kit's agents set models for those agents only.
- Model tiers are named by class (`sonnet`-class and so on) because model names change; map them to what your account offers.
- The commit recipe is for one machine and one working tree. It is not a lock across clones or CI runners.

## Troubleshooting

- Problem: a commit fails with an index lock error. Fix: another git process holds the shared index; the recipe uses a private index, so check that the call went through `commit_files`.
- Problem: `commit_files` waits forever. Fix: a stale lock directory is left over from a crash. Confirm no agent is committing, then remove the commit lock directory inside the git directory.
- Problem: a commit leaves files staged in the shared index. Fix: the last step (`git restore --staged`) did not run because the commit failed; read the error, fix it, and re-run the call.
- Problem: a resumed agent repeats finished work. Fix: tell it exactly which commits landed (from `git log`) and the next step.
