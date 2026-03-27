# Public Bank Commercial Web Portal

Desktop-first banking portal built with Next.js and Tailwind CSS, based on the branding and card patterns from the existing `publicbank` mobile app.

## Features

- Public Bank branded commercial dashboard home page
- Card layout inspired by mobile app cards:
	- Cash Balance and Forecast
	- Accounts Receivables / Payables
- Payment page for commercial client invoice processing
- PDF invoice upload and analysis API
- Gemini integration to extract invoice fields from uploaded PDF text
- Payment option comparison:
	- Pay now
	- Pay in 30 days with 5% financing cost

## Tech Stack

- Next.js (App Router)
- Tailwind CSS v4
- React 19
- `pdf-parse` for PDF text extraction
- Gemini API (`gemini-2.5-flash`) for invoice understanding

## Setup

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables:

```bash
cp .env.example .env.local
```

3. Add your Gemini API key in `.env.local`:

```bash
GEMINI_API_KEY=your_real_api_key
```

4. Run the app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Validation

```bash
npm run lint
npm run build
```

Both commands currently pass.

## Notes

- If `GEMINI_API_KEY` is not set or Gemini fails, the API falls back to regex-based extraction so the UI flow still works.
- Main routes:
	- `/` dashboard
	- `/payments` invoice payment workflow
	- `/api/invoice/analyze` PDF analysis endpoint
