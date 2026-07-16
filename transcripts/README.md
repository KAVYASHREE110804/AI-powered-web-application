# Coding Agent Transcripts

Complete transcripts of every Claude Code session used to build DemoLens —
including the failed and abandoned attempts, as requested in the brief.

Each session exists in two forms:

- `*.md` — condensed human-readable view (user + assistant messages, one-line
  tool-call summaries)
- `raw/*.jsonl` — the complete, unedited Claude Code session log
  (every tool call, tool output, and system event)

## Sessions in chronological order

| # | Date | Session | What happened |
|---|------|---------|---------------|
| 1 | 2026-07-15 | [first-scaffold-attempt](session-1_2026-07-15_first-scaffold-attempt-interrupted.md) | ❌ First scaffold attempt — interrupted before any code was written |
| 2 | 2026-07-15 | [early-git-setup](session-2_2026-07-15_early-git-setup-interrupted.md) | ❌ Tried to commit an empty project — interrupted |
| 3 | 2026-07-16 | [git-workflow-setup](session-3_2026-07-16_git-workflow-setup.md) | Set up the commit-per-module git workflow and GitHub remote |
| 4 | 2026-07-16 | [nextjs-attempt-pivot-modules-1-3](session-4_2026-07-16_nextjs-attempt-pivot-modules-1-3.md) | ❌➡️✅ Built a Next.js 14 UI shell, **abandoned it entirely**, restarted as a Python pipeline; Modules 1–3 (scaffold, validation + transcription, scene detection). Includes discovering that the transcription API spec we had was wrong and reverse-engineering the real one |
| 5 | 2026-07-16 | [modules-4-5-hardening-submission](session-5_2026-07-16_modules-4-5-hardening-submission.md) | Modules 4–5 (PRD + mockups, master pipeline), debugging two invalid OpenAI keys (env-var shadowing bug), switching to GitHub Models free tier, edge-case hardening, submission prep |

## Notable failures (the honest list)

- **Session 1 & 2**: false starts before the project had direction.
- **Session 4**: an entire Next.js 14 frontend was built and then deleted when
  the project pivoted to a pure Python pipeline. The same session discovered
  the usetranscribe.io submit/poll API spec we were given didn't exist — the
  real API (cache check + SSE streaming) had to be reverse-engineered from
  the service's live documentation.
- **Session 5**: PRD generation failed twice before working — first with a
  revoked OpenAI key, then with a valid key on a $0-quota account. Debugging
  revealed a stale `OPENAI_API_KEY` in the Windows user environment silently
  shadowing `.env` (fixed with `load_dotenv(override=True)`). Generation was
  moved to GitHub Models' free GPT-4o tier.

Session 5's log was exported shortly before the final commits, so its raw
file ends mid-session.
