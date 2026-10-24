---
name: portfolio-preflight
description: Run required lint and build checks before committing or pushing changes in the bt-portfolio repository. Use when the user asks to commit, push, or deploy that portfolio.
---

# Portfolio preflight

Use this skill only in the `bt-portfolio` repository.

Before any user-requested commit or push:

1. Inspect `git status` and the diff; preserve unrelated or pre-existing changes.
2. Run `npm run lint` and `npm run build` before staging files.
3. If either command fails, fix only task-relevant failures when the user’s request authorizes the fix, then rerun both commands. Do not commit or push until both pass.
4. Run `git diff --check`, stage only the files in scope, and use a normal commit without `--no-verify`.
5. Report the checks that passed and any files deliberately excluded from the commit.

This skill is a preflight guard, not a replacement for CI. Do not change repository files, create commits, or push merely because this skill was invoked; those actions still require the user’s request.
