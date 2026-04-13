This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Questoria: diagnosis flow notes

### Storage keys (browser)

- **`questoria_result`**: latest completed diagnosis result. Saved to both `sessionStorage` and `localStorage` (used by `/result` and the Top “前回の結果を見る” CTA).
- **`questoria_answers`**: in-progress answers (session).
- **`questoria_question_order`**: randomized question order (`questionId[]`, session).
- **`questoria_choice_order`**: randomized choice order (`{ [questionId]: ["A"|"B"|"C"|"D"] }`, session).

### Top CTA behavior (new start vs resume)

- **Top “クエストを始める”** links to **`/play?fresh=1`** and must always start a **fresh** diagnosis:
  - Clears **in-progress** data only: `questoria_answers`, `questoria_question_order`, `questoria_choice_order`
  - Does **not** clear `questoria_result` (so “前回の結果を見る” remains available)
- **Resume** is supported when navigating to `/play` without `fresh=1`:
  - If `questoria_answers` exists, `/play` restores progress and continues with the stored order(s)

### Previous result CTA (Top)

- “前回の結果を見る” is shown **only when** a valid `questoria_result` exists (in `sessionStorage` or `localStorage`).
- Completing a new diagnosis overwrites `questoria_result` with the latest result.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
