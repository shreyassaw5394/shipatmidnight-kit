# Conventions (read this instead of the whole repo)

Stack: <language, framework, package manager, versions>
Commands: install `<cmd>` · dev `<cmd>` · test `<cmd>` · typecheck `<cmd>` · lint `<cmd>` · build `<cmd>`
Style: <named visual style from ui-style-picker, one line> · code style: <formatter/linter>
Do: small surgical changes; a success check per task; tests for what you touched before each commit.
Don't: refactor outside your plan; `git add -A`; push; publish; deploy; add dependencies without noting them in your summary.
Token economy: read only your plan, this file and the 1-2 summaries you depend on; report changed / unverified / owner decisions, nothing else.
Commits: neutral messages; stage listed files only; use the lock recipe below when other executors run in parallel.

```bash
commit_files() {  # usage: commit_files "message" file1 file2 ...
  msg="$1"; shift
  lock="$(git rev-parse --git-dir)/commit.lock"
  until mkdir "$lock" 2>/dev/null; do sleep 1; done
  trap 'rmdir "$lock"' RETURN
  idx="$(mktemp)"; rm -f "$idx"
  export GIT_INDEX_FILE="$idx"
  git read-tree HEAD
  git add -- "$@"
  git commit -q -m "$msg"
  unset GIT_INDEX_FILE; rm -f "$idx"
  git reset -q -- "$@"
}
```
