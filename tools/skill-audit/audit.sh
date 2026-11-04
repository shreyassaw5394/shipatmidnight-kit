#!/usr/bin/env bash
# Scan skills (folders with SKILL.md) and agents/commands (single .md files) with two static scanners:
#   NVIDIA SkillSpector  v2.13.3  (security)            https://github.com/NVIDIA/SkillSpector     Apache-2.0
#   NVIDIA SkillEvaluator v0.7.1  Tier 1 (security+quality) https://github.com/NVIDIA/SkillEvaluator Apache-2.0
# Neither scanner is bundled with this kit. They are fetched at the pinned tags on first run.
# Static only: no LLM key needed, nothing is sent anywhere except the git/uv downloads.
#
# Usage: audit.sh <skill-dir | agent.md> [more ...]
# Env:   SKILL_AUDIT_REPORTS  where reports go       (default: ./skill-audit-reports)
#        SKILL_AUDIT_CACHE    where SkillEvaluator is cloned (default: ~/.cache/skill-audit)
# Needs: git, uv, python3.
set -u
SPECTOR_TAG="v2.13.3"
EVAL_TAG="v0.7.1"; EVAL_SHA="3da8c573ff1aaf7e9d560f4ad58a019700fa014d"
REPORTS="${SKILL_AUDIT_REPORTS:-$PWD/skill-audit-reports}"
CACHE="${SKILL_AUDIT_CACHE:-$HOME/.cache/skill-audit}"
SE="$CACHE/SkillEvaluator"

for c in git uv python3; do command -v "$c" >/dev/null || { echo "missing: $c" >&2; exit 2; }; done
if [ ! -d "$SE" ]; then
  mkdir -p "$CACHE"
  git clone -q --depth 1 --branch "$EVAL_TAG" https://github.com/NVIDIA/SkillEvaluator.git "$SE" || exit 2
fi
got="$(git -C "$SE" rev-parse HEAD)"
[ "$got" = "$EVAL_SHA" ] || { echo "SkillEvaluator at $got, expected $EVAL_SHA ($EVAL_TAG). Remove $SE and re-run." >&2; exit 2; }
command -v skillspector >/dev/null || uv tool install -q "git+https://github.com/NVIDIA/SkillSpector.git@$SPECTOR_TAG" || exit 2

TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
for arg in "$@"; do
  if [ -d "$arg" ] && [ -f "$arg/SKILL.md" ]; then
    dir="$(cd "$arg" && pwd)"; name="$(basename "$dir")"
  elif [ -f "$arg" ] && [ "${arg##*.}" = "md" ]; then
    # Agents and commands are single files: scan each as a one-file skill.
    name="$(basename "$arg" .md)"; dir="$TMP/$name"; mkdir -p "$dir"; cp "$arg" "$dir/SKILL.md"
  else
    echo "skip (not a skill folder or .md file): $arg"; continue
  fi
  out="$REPORTS/$name"; mkdir -p "$out"
  skillspector scan "$dir" --no-llm --format json --output "$out/skillspector.json" >"$out/skillspector.log" 2>&1
  (cd "$SE" && uv run -q --python 3.13 --extra security skillevaluator tier1 "$dir" --no-llm -r json -o "$out") >"$out/skillevaluator.log" 2>&1
  python3 - "$out" "$name" <<'PY'
import json, sys
out, name = sys.argv[1], sys.argv[2]
try:
    s = json.load(open(f"{out}/skillspector.json")); r = s["risk_assessment"]; sc = {}
    for f in s.get("issues", []):
        k = str(f.get("severity", "?")).lower(); sc[k] = sc.get(k, 0) + 1
    spec = f"{r['recommendation']:8} risk {r['score']:>3} ({s['analysis_completeness']['status']}) issues={sc or 0}"
except Exception as e:
    spec = f"error {str(e)[:40]}"
try:
    e = json.load(open(f"{out}/skillevaluator-tier1.json")); q = e["quality_summary"][0]
    ev = f"quality {q['overall_score']:.0f} {q['grade']}  severities={e['severity_counts']}"
except Exception as ex:
    ev = f"error {str(ex)[:40]}"
print(f"{name:34} SPECTOR {spec} | EVALUATOR {ev}")
PY
done
