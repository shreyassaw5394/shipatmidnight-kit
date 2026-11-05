---
name: token-economy
description: Use whenever work is split across several agents, background executors or GSD phases/waves, before spawning agents, writing executor prompts, choosing models, or when a usage limit has stopped agents. Keeps runs lean - few parallel agents, the right model per task, short prompts, scoped tests, short reports, safe parallel commits, and resume-instead-of-restart.
---

# Token economy

Usage limits stop every running agent at once. Parallel agents that each re-read the whole project burn the window fastest. Run lean by default.

## 1. Parallelism: 2-3 agents, not 6

- Never more than 2-3 agents at a time. Six executors cost about six times the context, and a limit hit loses all of them.
- Batch small plans (one file, one config, one doc) into a single executor instead of one agent each.
- Run dependent work in sequence. Only truly independent plans go in the same wave.

## 2. Model per task

| Work | Model |
|---|---|
| Executors on a well-specified plan, reviewers, checks | mid (`sonnet`-class) |
| Mechanical fixes: build errors, renames, lint, formatting | small (`haiku`-class) |
| Planning, architecture, design judgement, anything the owner will judge by taste | frontier |

Spend the frontier model where a wrong call is expensive to undo. A good plan lets a cheaper model execute it. If a cheap model fails twice on the same task, move it up one tier instead of retrying.

## 3. Short executor prompts

An executor prompt is a pointer, not a briefing:

- The plan file path.
- The conventions file path (one file per phase or project: stack, style, commands, do/don't).
- Only the 1-2 summaries from earlier work that this plan directly depends on.
- The success check to run.

Do not paste plans into the prompt. Do not tell the agent to read every earlier summary. Do not re-explain finished work.

## 4. Tests: scoped per commit, full at wave ends

- Before each commit, the executor runs only the tests, typecheck and lint for what it touched.
- The orchestrator runs the full suite and build once, at the end of each wave.
- Compare failures with the main branch and report pre-existing ones separately.

## 5. Short reports

Every agent report, and every status line to the owner, has three parts:

1. **Changed**: files and behaviour, a line each.
2. **Unverified**: what was not run or could not be checked.
3. **Owner decisions**: questions only the owner can answer. Collect them into one list at the end.

No narrative, no restating the plan, no repeating earlier results.

## 6. Parallel commits: lock plus private index

Parallel executors share one working tree and one `.git/index`. Two agents running `git add` and `git commit` at once can stage each other's files or fail on `index.lock`. Give each commit a lock and its own index:

```bash
commit_files() {  # usage: commit_files "message" file1 file2 ...
  msg="$1"; shift
  lock="$(git rev-parse --git-dir)/commit.lock"
  until mkdir "$lock" 2>/dev/null; do sleep 1; done      # one committer at a time
  trap 'rmdir "$lock"' RETURN
  idx="$(mktemp)"; rm -f "$idx"                           # private index file
  export GIT_INDEX_FILE="$idx"
  git read-tree HEAD                                      # start from the current commit
  git add -- "$@"                                         # stage only this agent's files
  git commit -q -m "$msg"                                 # commit from the private index
  unset GIT_INDEX_FILE; rm -f "$idx"
  git reset -q -- "$@"                                    # sync the shared index to the new HEAD
}
```

Rules: each agent lists its files explicitly (never `git add -A` or `.`), takes the lock only around the commit, and keeps the lock window short. If a stale lock directory remains after a crash and no agent is committing, remove it.

## 7. When a usage limit stops agents

- Do not restart the work or spawn fresh agents. Fresh agents re-read everything and redo finished steps.
- Wait for the reset, then resume each stopped agent by message (`SendMessage` to its id): "continue from where you stopped".
- First check the tree: `git status` and `git log` show what landed. Tell the agent only what is already committed.
- If an agent cannot be resumed, start one replacement with the plan path, the conventions file, and the list of already-committed work.
- After a limit hit, drop to 1-2 agents for the rest of the window.

## 8. Quick check before spawning

- [ ] 3 agents or fewer?
- [ ] Cheapest model that can do each task?
- [ ] Prompt is paths only, plus one or two relevant summaries?
- [ ] Conventions file exists and has a token-economy line?
- [ ] Commit recipe from section 6 included for parallel agents?
- [ ] Report format (changed / unverified / owner decisions) stated?

See "Saving tokens with GSD" in `${CLAUDE_PLUGIN_ROOT}/PLAYBOOK.md` for the GSD settings that go with this.
