# Go-To-Market Playbook

This playbook is for the first public push of Latchet.

The target is not broad awareness. The target is to get the first 20 to 50 real users who already work with coding agents and feel the pain of repeated failed attempts, broken handoffs, and missing task state.

## Positioning

Use this sentence everywhere until the market clearly pulls you somewhere else:

**Latchet is a task ledger for AI coding agents. It keeps decisions, failed attempts, env quirks, and the next action in one place.**

Avoid these labels in the first launch:

- AI memory
- second brain
- infinite context
- transcript manager

Those phrases are too broad and attract the wrong expectations.

## Who to target first

Only talk to people who already feel this pain:

- solo developers using Codex, Claude Code, Cursor, or Gemini CLI
- indie hackers shipping side projects with coding agents
- consultants juggling multiple repos, branches, and sessions

If someone is not already using coding agents heavily, they are not the launch audience.

## What you need before launch

Do not launch from a rough idea. Launch from a clear proof.

Prepare these assets first:

1. A clean GitHub README with install, quickstart, and one sharp use case.
2. One 30 to 60 second demo video or GIF.
3. One sample repo or fixture that people can inspect.
4. One simple landing page with the same positioning as the README.
5. One release tag with notes and copy-paste install steps.

Your demo should show this exact flow:

1. agent tries something
2. it fails
3. failure is logged in Latchet
4. session pauses
5. work resumes later
6. next agent sees the known failure and does not repeat it

That is the product story.

## Your first 30 days

### Week 1: tighten the product story

1. Rewrite the README headline and opening section around the one core promise.
2. Record the short demo.
3. Create one “before vs after” image:
   before = messy transcript or scattered notes
   after = clean task state with decisions, failures, quirks, next action
4. Tag the first public release on GitHub.

### Week 2: get private feedback before broadcasting

1. Make a list of 15 people who already use coding agents seriously.
2. Send each of them a short message with the demo and ask for a 15-minute call or async feedback.
3. Watch where they get confused:
   install
   task creation
   logging events
   deriving state
   switching agents
4. Fix those issues before broad launch.

Use this message:

```text
I’m building Latchet, a task ledger for AI coding agents.
It keeps decisions, failed attempts, env quirks, and the next action in one place so the next session does not repeat the same dead end.

This is the 45-second demo: <link>
If you use Codex / Claude Code / Cursor a lot, I’d like blunt feedback on whether this workflow is actually useful.
```

### Week 3: public launch wave 1

Launch in this order:

1. GitHub release
2. Show HN
3. Reddit posts tailored to the relevant communities
4. X thread
5. DEV article
6. Indie Hackers post

Why this order:

- GitHub is the home base.
- Show HN is the best single place for high-signal early technical feedback.
- Reddit gives niche communities.
- X helps discoverability and founder-to-founder sharing.
- DEV and Indie Hackers give longer-tail traffic.

## Channel-by-channel execution

### GitHub

Your repo is the conversion point. Make it easy to decide in under two minutes.

Before posting anywhere:

1. Put the problem in the first 3 lines of the README.
2. Show the CLI quickstart above the fold.
3. Add screenshots or a GIF.
4. Add a release with notes, demo link, and known limitations.
5. Add `CONTRIBUTING.md` only if outside contributors can actually help.

GitHub release checklist:

1. Create a version tag.
2. Title it with a short benefit, not only the version number.
3. Include:
   what Latchet solves
   what ships in this release
   how to install
   one example workflow
   known gaps

GitHub docs and release docs:

- [GitHub repository best practices](https://docs.github.com/en/repositories/creating-and-managing-repositories/best-practices-for-repositories)
- [GitHub releases overview](https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases)
- [Managing releases in a repository](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository)

### Hacker News

Post when the product is real, not when it is still mostly a concept. Show HN is best for substantial launches or meaningful overhauls.

Execution:

1. Post `Show HN: Latchet – task ledger for AI coding agents`.
2. In the first comment, explain the pain in plain language.
3. Include the repeat-failure example.
4. Stay online for 4 to 6 hours to answer questions.
5. Do not ask friends to upvote or comment.

Good HN post structure:

- what problem exists
- why existing “memory” approaches miss it
- what Latchet stores instead
- what is open source today
- what you still have not solved

HN references:

- [Show HN guidelines](https://news.ycombinator.com/showhn.html)

### Reddit

Do not blast the same post everywhere. Each subreddit needs a native angle.

Suggested communities:

- [r/ChatGPTCoding](https://www.reddit.com/r/ChatGPTCoding/)
- [r/ClaudeAI](https://www.reddit.com/r/ClaudeAI/)
- [r/cursor](https://www.reddit.com/r/cursor/)
- [r/GeminiCLI](https://www.reddit.com/r/GeminiCLI/)
- [r/opensource](https://www.reddit.com/r/opensource/)

Execution:

1. Read the rules before posting.
2. Comment normally in the community for a few days if you are new there.
3. Post one real workflow story, not “please check out my tool”.
4. Include one screenshot and one concrete example of a failure that was avoided.
5. Ask one useful question at the end so people respond with workflow details.

Examples of angles:

- `r/ChatGPTCoding`: “I got tired of coding agents retrying the same dead end, so I built a task ledger instead of another summary tool.”
- `r/ClaudeAI`: “Trying to preserve durable work state across Claude Code sessions without dragging the whole transcript around.”
- `r/cursor`: “Testing a file-first task ledger for Cursor/Codex/Claude workflows. Curious whether people log failures or only prompts.”
- `r/opensource`: “Open-source local-first task ledger for AI coding agents. Looking for feedback on the event model and CLI UX.”

### X

Use X for repeated short-form proof, not one giant launch thread and silence after.

Post sequence:

1. Launch post with the demo.
2. Follow-up post with one concrete “known failure avoided” example.
3. Follow-up post with a screenshot of `state.md`.
4. Short build-in-public posts as you add integrations or tests.

Post ideas:

- “The handoff matters less than the audit trail.”
- “What failed should survive the session.”
- “Most AI coding ‘memory’ is trying to remember too much. I only want decisions, failed attempts, env quirks, and next action.”

### DEV Community

Use DEV for an explanatory post that teaches something, not just a launch ad.

Recommended title:

`Why coding-agent handoffs fail, and why I built a task ledger instead of another summary tool`

Recommended structure:

1. show the pain
2. show the wrong mental model
3. explain the ledger model
4. show the CLI flow
5. show the open-source repo

Reference:

- [DEV Community](https://dev.to/about)

### Indie Hackers

Use Indie Hackers to document the build story and what you are learning about the audience.

Post types:

1. product launch post
2. weekly progress update
3. “what users said” post after interviews

Reference:

- [Indie Hackers](https://www.indiehackers.com/)

### Product Hunt

Do not make Product Hunt the first launch. Use it after the onboarding, demo, and messaging are sharper.

Execution:

1. Prepare maker profile, logo, gallery, tagline, and first comment.
2. Schedule the launch once your screenshots and copy are clean.
3. Use your email list, existing users, and social followers to tell people you launched.
4. Reply quickly throughout launch day.

The official guidance says launches are often scheduled at `12:01am PST`. For some products, syncing with a press or news cycle later in the morning can also make sense.

Reference:

- [Product Hunt launch prep](https://www.producthunt.com/launch/preparing-for-launch)

## What to say in the first launch posts

Use concrete language. Do not say:

- smarter memory
- AI context platform
- all your agent context in one place

Say this instead:

- task ledger for AI coding agents
- avoids repeated failed attempts
- preserves decisions, env quirks, and next action across sessions
- local-first and inspectable

## User research loop

You need user conversations, not only launch impressions.

For the first 10 calls or async chats, ask:

1. What coding agent do you use most?
2. What gets lost between sessions today?
3. What failures get repeated?
4. Where do you currently store durable task state?
5. Would you log a few structured facts if it saved time tomorrow?
6. Which part of this workflow feels annoying or fake?

Write answers into one sheet with these columns:

- person
- primary tool
- pain severity
- current workaround
- interest level
- blockers to trying Latchet
- quotes

## Metrics to track weekly

Track only the signals that matter at this stage:

1. README visitors to install attempts
2. installs
3. repos with an initialized ledger
4. tasks created
5. exports generated
6. users who come back after 7 days
7. number of user interviews completed
8. number of users who said Latchet prevented a repeated failure

## What success looks like

Your first launch is successful if:

1. 10 to 20 people install it
2. 5 people actually try it in a real repo
3. 3 people say it saved them from re-explaining or retrying something
4. you learn the clearest wording people naturally repeat back to you

That is enough to shape the next release.
