# Latchet v0.1 Launch Checklist

**Use this checklist to verify readiness before public launch.**

---

## Phase 1: Product Readiness (Before Week 2 Private Feedback)

### README
- [ ] Headline is: "Latchet keeps decisions, failed attempts, env quirks, and the next action in one place for AI coding agents."
- [ ] Opening paragraph (first 3 lines) uses one-line positioning, not generic language
- [ ] "What's Included" and "What's NOT (Yet)" sections are clear and accurate
- [ ] [RELEASE_SCOPE.md](RELEASE_SCOPE.md) is linked and current
- [ ] Install section includes `npm install && npm run build`
- [ ] Quickstart shows `init`, `task create`, `log failure`, `log next_action`, `show`
- [ ] At least one concrete example (RBAC migration, auth debugging, or similar)
- [ ] All 14+ commands in [Phase 2 execution](docs/phase-2-execution.md) are documented
- [ ] MCP tools are listed
- [ ] Adapter layer (Codex, Claude Code) is mentioned
- [ ] No "coming soon" features are promised in the README itself

### Tests
- [ ] `npm test` runs without errors
- [ ] 14+ tests pass
- [ ] Core tests cover: projection, supersession, freshness, handoff, redaction
- [ ] Adapter tests cover: Codex/Claude Code import, prompt export, fixture stability
- [ ] CLI smoke tests cover: init, task create, log, import-session, show, verify, export
- [ ] MCP smoke tests cover: at least 3 tools (get_task_state, append_event, get_next_action)
- [ ] One test explicitly verifies "same failure not repeated" across session resume

### Landing Site (latchet.vercel.app)
- [ ] Site builds without errors: `npm run build:site`
- [ ] Site previews without errors: `npm run preview:site`
- [ ] Black-only aesthetic (no colorful gradients or "AI-generated" feel)
- [ ] Founder name visible in header, hero, and/or footer
- [ ] GitHub link is prominent (header or footer)
- [ ] Hero clearly shows what Latchet does (not abstract)
- [ ] Features section matches the product scope
- [ ] CLI section shows real commands
- [ ] CTA is clear: "Try on GitHub" or "Get Started"
- [ ] Mobile responsive: tested at 390x844 and default desktop
- [ ] No console errors in browser
- [ ] No network errors (no failed API calls)
- [ ] Load time is reasonable (< 3s on 4G)

### Demo Video/GIF
- [ ] 30-60 seconds long
- [ ] Shows: log failure → pause → resume → verify failure still there
- [ ] Audio optional but if present, clear and professional
- [ ] Hosted somewhere accessible (YouTube, GitHub releases, or latchet.vercel.app/demo)
- [ ] Compressed for web (< 20MB if file, or linked video service)

---

## Phase 2: Private Feedback (Week 2)

### User List
- [ ] 5-10 people identified who actively use Codex, Claude Code, or Cursor
- [ ] Contact list includes name, email, and how you know them
- [ ] Diversity of experience: mix of solo devs and small teams if possible

### Feedback Template
- [ ] Prepared a short message with:
  - One-line positioning
  - Link to demo
  - Link to GitHub
  - Request for 15-min call or async feedback
- [ ] Message is casual, not salesy
- [ ] Example structure from [go-to-market-playbook.md](docs/go-to-market-playbook.md) is followed

### Feedback Incorporation
- [ ] Feedback collected from at least 3 users before proceeding
- [ ] Key friction points identified: install, task creation, logging events, derive, export, import
- [ ] Issues fixed in README and/or code based on feedback
- [ ] No major blockers remain

---

## Phase 3: Public Launch (Week 3)

### GitHub Release
- [ ] Tag created (e.g., `v0.1.0`)
- [ ] Release title includes benefit, not only version (e.g., "v0.1.0: Task ledger for AI coding agents")
- [ ] Release notes include:
  - What Latchet solves (one paragraph)
  - What ships in this release (bulleted)
  - How to install
  - One example workflow
  - Known limitations
  - Link to GitHub Issues for feedback
- [ ] Demo link is in release notes
- [ ] [RELEASE_SCOPE.md](RELEASE_SCOPE.md) is linked
- [ ] Installation instructions are copy-paste ready

### Show HN Preparation
- [ ] Title: "Show HN: Latchet – Task Ledger for AI Coding Agents"
- [ ] First comment (yours) explains:
  - The problem (repeated mistakes across sessions/tools)
  - Why existing "memory" tools miss it
  - What Latchet stores instead
  - One real example
  - Call to action
- [ ] You've identified what time to post (typically 10am–12pm PST on Tuesday–Thursday)
- [ ] You'll stay online for 4–6 hours to answer questions

### Reddit Posts
- [ ] Read community rules before posting (auto-mod, self-promotion rules, etc.)
- [ ] Prepared 5 posts, one per community:
  - r/ChatGPTCoding: angle = prevent repeated dead ends
  - r/ClaudeAI: angle = session continuity
  - r/cursor: angle = cross-tool state
  - r/opensource: angle = open-source, file-first
  - r/GeminiCLI (optional): angle = portable handoff
- [ ] Each post includes: one screenshot, one concrete example, one question
- [ ] Posts are native to community, not copy-pasted

### X / Twitter
- [ ] Launch tweet prepared: includes demo link or screenshot, casual tone, no hashtags spam
- [ ] Follow-up tweets ready: failure example, state.md screenshot, build-in-public progress
- [ ] You have followers or a small community ready (optional but helpful)
- [ ] Plan to tweet 2-3x in first week

### DEV Community
- [ ] Title: "Why coding-agent handoffs fail, and why I built a task ledger instead of another summary tool"
- [ ] Article structure:
  1. Problem (repeated dead ends, broken handoffs)
  2. Wrong mental model (transcript-first)
  3. Right model (event ledger)
  4. CLI walkthrough
  5. Open-source link
- [ ] ~800–1200 words, clear and conversational
- [ ] Scheduled to post after Show HN (gives it time to gain traction)

### Indie Hackers
- [ ] Product launch post ready (similar to DEV but shorter)
- [ ] Maker profile complete: photo, bio, links
- [ ] Plan to post weekly progress updates for 4 weeks

---

## Phase 4: Launch Week (Execution)

### Pre-Launch (Day 1–2)
- [ ] All code is committed and pushed to `main`
- [ ] Site is deployed to latchet.vercel.app
- [ ] Release notes are finalized
- [ ] All social copy is reviewed (no typos, tone is consistent)

### Launch Wave (Day 3–7)
- [ ] Day 1: GitHub release goes live
- [ ] Day 2: Show HN post goes live (morning PST, stay online 6 hours)
- [ ] Day 3: Reddit posts go live (stagger across communities, don't post all at once)
- [ ] Day 4–5: X thread starts (launch tweet + follow-ups)
- [ ] Day 5–6: DEV post goes live
- [ ] Day 6–7: Indie Hackers post goes live

### Monitoring (Week 3)
- [ ] Watch GitHub Issues for questions and bug reports
- [ ] Respond to HN comments within 2 hours (first 4 hours, then catch up later)
- [ ] Respond to Reddit comments authentically (not spam, real engagement)
- [ ] Retweet or reply to X mentions
- [ ] Track metrics:
  - GitHub stars
  - Show HN upvotes and comments
  - Reddit upvotes per community
  - X impressions/engagement
  - Emails or DMs from interested users

---

## Success Criteria (After Week 1 of Public Launch)

- [ ] > 50 GitHub stars
- [ ] > 50 upvotes on Show HN
- [ ] At least 5 real users have tried it (evidenced by issues, stars, or feedback)
- [ ] No major bugs reported (minor bugs are OK)
- [ ] Messaging is clear and resonant (people "get it" without confusion)
- [ ] At least 1 person publicly reports a benefit ("this helped me avoid X")

---

## If Something Goes Wrong

- [ ] Major bug found post-launch → hotfix, tag v0.1.1, update README
- [ ] Messaging is confusing → pin a clarification in GitHub issue
- [ ] Low traction → review [RELEASE_SCOPE.md](RELEASE_SCOPE.md), check if positioning was wrong or timing was off
- [ ] Someone reports a feature request → add to GitHub Discussions or Issues, don't promise it's coming
- [ ] Negative feedback on a core assumption → escalate, consider if the product strategy needs to change

---

## Next Steps After Successful Launch

1. Gather all user feedback and prioritize Phase 2 work (live imports, MCP integrations, etc.)
2. Track metrics for 30 days
3. Plan Phase 2 based on user demand and product learnings
4. Consider Product Hunt launch if momentum is strong (typically 2–4 weeks after public launch)
5. Document learnings in a public "post-launch report"
