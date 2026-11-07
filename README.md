# I Choose Me 💖

A free, no-sign-up page for the girlies to visit whenever they feel like texting their ex.

- 5 questions, one at a time. The first and last ask "Are you getting back together with him?" and the **Yes** button won't let itself be clicked: it moves, vanishes, or locks. Catch it anyway and you get: *"You think you sneaky huh? You still ain't getting back together with him."*
- Answering **No** to a self-check question opens a **Lock In, Girliepop!** page for that focus (your promise, self-care, fuel your body), with a checklist.
- Making it through ends on **"You got this girlie! Say it out loud: I choose me!"**
- Built-in **Pomodoro timer** (25/5/15, custom minutes, chime, daily tally).
- **Printable lock-in sheet** (Print button, or Ctrl+P).

## Editing

Everything lives in three files: `index.html`, `style.css`, `app.js`.
Questions, lock-in tips and your channel link are at the top of `app.js` (`CONFIG` and `QUESTIONS`).

## Run locally

```bash
python -m http.server 8123
```

Then open http://localhost:8123.

## Visitor counts (free)

1. Sign up at https://www.goatcounter.com (free for non-commercial sites, no cookie banner needed).
2. In `index.html`, uncomment the GoatCounter script at the bottom and replace `YOURCODE`.

Besides page views, the site already reports these events: `quiz-start`, `quiz-complete`, `sneaky-yes`, `lockin-2/3/4`, `pomodoro-start`, `pomodoro-complete`, `print`, `said-i-choose-me`.

## Hosting

GitHub Pages: Settings → Pages → Deploy from branch → `main` / root.
