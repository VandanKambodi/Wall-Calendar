# Wall Calendar

A modern Next.js calendar app with an interactive wall calendar layout, monthly navigation, date range selection, and notes support.

## Features

- Interactive calendar view with monthly navigation
- Click to select a start and end date range
- Hover preview when selecting date ranges
- Notes panel for month-specific details
- Responsive framing and polished UI using Tailwind CSS

## Project Structure

- `src/app/page.tsx` — main page entrypoint
- `src/components/WallCalendar/WallCalendar.tsx` — main calendar container
- `src/components/WallCalendar/CalendarGrid.tsx` — calendar grid and date selection
- `src/components/WallCalendar/HeroSection.tsx` — header with month controls
- `src/components/WallCalendar/NotesSection.tsx` — notes sidebar
- `src/components/WallCalendar/HangingFrame.tsx` — visual frame decoration

## Getting Started

Install dependencies and start the local development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build and Lint

Build the production app:

```bash
npm run build
```

Run ESLint:

```bash
npm run lint
```

## Technologies

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- `date-fns` for date handling
- `lucide-react` for icons

## Deployment
