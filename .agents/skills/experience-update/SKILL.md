---
name: experience-update
description: Update work-experience content or its rendering in the bt-portfolio repository, including the timeline and Winamp playlist. Use for experience entries, schema changes, or experience-page behavior.
---

# Experience update

Use this skill only in the `bt-portfolio` repository.

`data/experiences.json` is the canonical source for work-experience content. `render-experiences.js` validates each entry and renders both the standard timeline and the Winamp playlist into the shared `views/partials/experiences.html` template. GitHub Pages uses `build.js`; `server.js` is a separate Express rendering path.

- Edit entries in `data/experiences.json`, not generated cards, playlist rows, or `dist/`. Keep the JSON valid and satisfy the current schema in `render-experiences.js`, including non-empty `highlights` and `technologies` arrays.
- Treat the data as public portfolio content. Exclude secrets, private contact details, credentials, and client-confidential information.
- If the schema changes, update the data, validation, both renderer outputs, relevant tests or fixtures, and the update instructions in `README.md` together.
- Escape every externally managed value before inserting it into HTML. Keep `build.js` and `server.js` aligned when rendering behavior changes.
- For changes to experience markup, styles, layout, themes, or interactions, apply the repo-local `frontend-design` skill. Use the existing CSS variables and theme selectors.

Verify the result with `npm test`. Confirm `dist/experiences.html` contains every entry in both `.timeline-item` and `.track-row` form. Serve `dist/` and inspect `/experiences.html` in dark, light, and Winamp themes, including mobile behavior. Review `git diff` for generated or unrelated files.

If the user specifically wants a content-only update through GitHub's file editor, edit only `data/experiences.json` there and validate its structure before committing to `main`. A commit, push, or deployment still requires the user's authorization and the repository's commit and push gate.
