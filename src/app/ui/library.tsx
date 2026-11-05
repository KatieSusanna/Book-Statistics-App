"use client";

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";

export type ReadingStatus = "want-to-read" | "reading" | "finished";
export type LibraryBook = {
  id: string;
  title: string;
  author: string;
  pages: number | null;
  coverUrl: string;
  status: ReadingStatus;
  pagesRead: number;
  rating: number;
  addedAt: string;
  finishedAt: string | null;
};
export type NewLibraryBook = Pick<LibraryBook, "id" | "title" | "author" | "pages" | "coverUrl">;

type LibraryContextValue = {
  books: LibraryBook[];
  loaded: boolean;
  addBook: (book: NewLibraryBook) => boolean;
  updateBook: (id: string, updates: Partial<Pick<LibraryBook, "status" | "pagesRead" | "rating">>) => void;
  removeBook: (id: string) => void;
};

const STORAGE_KEY = "page-and-chapter-library-v1";
const LibraryContext = createContext<LibraryContextValue | null>(null);

export function LibraryProvider({ children }: { children: ReactNode }) {
  const [books, setBooks] = useState<LibraryBook[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: unknown = JSON.parse(stored);
        if (Array.isArray(parsed)) setBooks(parsed as LibraryBook[]);
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (loaded) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  }, [books, loaded]);

  const value = useMemo<LibraryContextValue>(() => ({
    books,
    loaded,
    addBook: (book) => {
      if (books.some((saved) => saved.id === book.id)) return false;
      setBooks((current) => [...current, { ...book, status: "want-to-read", pagesRead: 0, rating: 0, addedAt: new Date().toISOString(), finishedAt: null }]);
      return true;
    },
    updateBook: (id, updates) => setBooks((current) => current.map((book) => {
      if (book.id !== id) return book;
      const status = updates.status ?? book.status;
      const pagesRead = status === "finished" ? (book.pages ?? book.pagesRead) : Math.min(updates.pagesRead ?? book.pagesRead, book.pages ?? Number.MAX_SAFE_INTEGER);
      return { ...book, ...updates, pagesRead, finishedAt: status === "finished" ? (book.finishedAt ?? new Date().toISOString()) : null };
    })),
    removeBook: (id) => setBooks((current) => current.filter((book) => book.id !== id)),
  }), [books, loaded]);

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}

export function useLibrary() {
  const context = useContext(LibraryContext);
  if (!context) throw new Error("useLibrary must be used inside LibraryProvider");
  return context;
}
