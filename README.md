# Page & Chapter

A personal reading tracker built with the Next.js App Router. Search for books, save them to your library, track reading progress, and rate finished books. The library is stored in browser local storage, so no account or database setup is required.

## Project structure

```text
src/app/
  api/books/route.ts       Server-side Google Books search and result shaping
  booklog/page.tsx         Book discovery and add-to-library flow
  ui/library.tsx           Shared library state and local storage persistence
  ui/components/           Dashboard, search cards, and book details
  page.tsx                 Reading dashboard
  layout.tsx               Shared navigation, metadata, and provider
  globals.css              Shared responsive design system
```

The browser requests `/api/books?q=...`; catalogue requests and result shaping live in the API route. The library data stays on the device in local storage.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
