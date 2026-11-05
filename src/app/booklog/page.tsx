"use client";

import { FormEvent, useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import BookCards, { bookAttributes } from "@/app/ui/components/bookcards";
import BookDialog from "@/app/ui/components/bookInfoPage";

export default function BookTracker() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<bookAttributes[]>([]);
  const [selected, setSelected] = useState<bookAttributes | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const cleanQuery = query.trim();
    if (!cleanQuery) { setResults([]); setError(""); setLoading(false); return; }
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`/api/books?q=${encodeURIComponent(cleanQuery)}`, { signal: controller.signal });
        if (!response.ok) throw new Error("Search is temporarily unavailable. Please try again.");
        const data = await response.json();
        setResults(data.books ?? []);
      } catch (cause) {
        if (cause instanceof Error && cause.name !== "AbortError") { setError(cause.message); setResults([]); }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 350);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [query]);

  function submitSearch(event: FormEvent<HTMLFormElement>) { event.preventDefault(); }

  return <main className="workspace search-page">
    <section className="welcome-row">
      <div><p className="eyebrow">DISCOVER YOUR NEXT READ</p><h1>Find a book worth getting lost in.</h1><p className="welcome-copy">Search the catalogue by title, author, or both.</p></div>
    </section>
    <section className="board-panel search-panel">
      <form className="search-form" onSubmit={submitSearch}>
        <Search size={19} aria-hidden="true" />
        <label className="sr-only" htmlFor="book-search">Search books</label>
        <input id="book-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try “The Night Circus” or “Dune by Frank Herbert”" />
        {query && <button className="clear-search" type="button" aria-label="Clear search" onClick={() => setQuery("")}><X size={17} /></button>}
      </form>
      <div className="results-heading"><h2>{query ? "Search results" : "A little inspiration"}</h2>{loading && <span className="loading-label">Searching…</span>}</div>
      {error ? <p className="search-state" role="alert">{error}</p> : results.length ? <div className="results-grid">{results.map((book) => <BookCards key={book.id} {...book} onClick={() => setSelected(book)} />)}</div> : <div className="search-state">{loading ? "Finding books for you…" : query ? "No matching books yet. Try a different title or author." : "Search for a title or author to get started."}</div>}
    </section>
    {selected && <BookDialog isOpen book={selected} onClose={() => setSelected(null)} />}
  </main>;
}
