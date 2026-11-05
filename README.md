# Page & Chapter

A small reading tracker built with Next.js App Router. The home page is a personal reading board, and **Discover books** searches the Google Books catalogue.

## Project structure

```text
src/app/
  api/books/route.ts       Server-side Google Books search and result shaping
  booklog/page.tsx         Book discovery page (client interactions)
  ui/components/           Reusable presentation components
  page.tsx                 Home route
  layout.tsx               Shared navigation, metadata, and page shell
  globals.css              Shared design system and responsive styles
```

The browser calls `/api/books?q=...`; external catalogue requests and filtering live in the API route. This keeps API concerns out of the UI and provides one place to change the catalogue integration.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
