# Debug memory leak in worker

Goal: Find and fix OOM error in image processor
Status: in_progress
Task ID: debug-memleak
Generated: 2026-06-23T06:29:37.648Z

## Active Constraints
- None

## Active Decisions
- Switched to worker_threads instead of clustering
- Use heapdump for analysis — Standard tools failing

## Recent Failures
- [open] Heapdump failed in production — OOM happens before snapshot completes

## Environment Quirks
- Must use NODE_OPTIONS=--max-old-space-size=4096 locally

## Open Questions
- None

## Next Action
- Reproduce with smaller payloads locally [high]

## Artifact References
- None

## Blockers
- Heapdump failed in production

## Freshness
- OK: Expected branch main, current branch is main.
- OK: Expected commit 166fe9a1d62940f5fd446a13eb567721059ec510, current commit is 166fe9a1d62940f5fd446a13eb567721059ec510.
- OK: Workspace root /Users/aviralgarg/Everything/Context Manager/output/test-repo is available.

## Notes
- None
