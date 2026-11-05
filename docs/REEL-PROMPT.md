# Reel prompt: Ship at Midnight kit

Paste everything below the line into Claude to get a script for a 30-45 second vertical reel. Record the terminal captures yourself first (instructions in the shot list); the script is built around real footage, not mock-ups.

---

Write a script for a 30-45 second vertical (9:16) reel about the Ship at Midnight kit, a free MIT-licensed Claude Code plugin. Its one job: you type `/vision` plus one paragraph about a product, and the kit runs the studio flow (name check, plan, build with a few lean agents, security and legal passes, logo and README, product page draft) and then stops at a ship gate that lists what was verified, what was not, and the decisions only the owner can make. It never publishes, deploys or pushes to a public remote on its own.

Rules for the script:
- No invented numbers, no "10x", no "saves N hours", no percentages. The only claims allowed are things the footage shows.
- No absolute words: not "secure", "compliant", "guaranteed", "bulletproof". Say "a security pass and a legal pass ran", "scanned", "listed".
- No third-party logos or brand marks on screen. Mention Claude Code in words only ("works in Claude Code"), with a one-line trademark note in the caption, not in the video. Do not show other tools' names or icons.
- Honest tone, plain words, no hype voice. It is a workflow, not magic, and the reel can say so.
- The product is the hero: the terminal is on screen for most of the reel. No stock footage, no music-video cuts, no person talking to camera unless it is the maker for one line.

Deliver, in this order:

1. **Hook (0-3 s).** One line of spoken or on-screen text that states the whole idea: one paragraph in, a release gate out. Give two alternatives.

2. **Three beats (about 10 s each).**
   - Beat 1: the paragraph. Typing `/vision "..."` and the preflight output (git check, GSD check, path choice line "Path: GSD (ground-up) because ...").
   - Beat 2: the run. A time-lapse of the real terminal: phases planning and executing, two or three agents in parallel, commits landing, then the security and legal passes and the logo and README being written.
   - Beat 3: the gate. The printed ship gate scrolled slowly: Verified, Unverified, Owner decisions, Next taps. Then the cursor waiting. Nothing gets pushed.
   For each beat give: spoken line (max 12 words), on-screen text (max 6 words), and what the viewer sees.

3. **Call to action (last 4 s).** Spoken line plus on-screen text: install it with two commands, then `/vision`. Give the exact commands as on-screen text: `/plugin marketplace add shreyassaw5394/shipatmidnight-kit`, `/plugin install shipatmidnight-kit@shipatmidnight-kit`.

4. **Shot list**, as a table: shot number, duration, source capture, crop or zoom, on-screen text, transition. Every shot is a real terminal recording of `/vision` running in Claude Code, captured with a screen recorder at 1080x1920 or cropped from a wider capture; name which part of the real session each shot comes from. If a step takes long in real time, say "time-lapse of the real run" and give the speed. Mark which shots need the maker to prepare a fresh, small demo project so nothing private appears on screen (no real keys, paths with a username, or client names).

5. **Caption** for the post (under 300 characters) with the trademark line: "Not affiliated with Anthropic. Claude and Claude Code are trademarks of Anthropic, PBC." and the repo link github.com/shreyassaw5394/shipatmidnight-kit.

6. **What to check before posting**: a five-item list the maker ticks off (no secrets on screen, no third-party marks, no numbers without a source, the commands shown match the README, the gate shown is from the real run).

Keep the full script under 350 words excluding the tables.
