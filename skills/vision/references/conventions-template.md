# Conventions (read this instead of the whole repo)

Stack: <language, framework, package manager, versions>
Commands: install `<cmd>` · dev `<cmd>` · test `<cmd>` · typecheck `<cmd>` · lint `<cmd>` · build `<cmd>`
Style: <named visual style from ui-style-picker, one line> · code style: <formatter/linter>
Do: small surgical changes; a success check per task; tests for what you touched before each commit.
Don't: refactor outside your plan; `git add -A`; push; publish; deploy; add dependencies without noting them in your summary.
Token economy: read only your plan, this file and the 1-2 summaries you depend on; report changed / unverified / owner decisions, nothing else.
Commits: neutral messages; stage listed files only; use the lock recipe below when other executors run in parallel.

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
