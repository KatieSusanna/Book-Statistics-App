"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, BookOpen, Check, Clock3, Plus, Sparkles, Trash2 } from "lucide-react";
import { ReadingStatus, useLibrary } from "@/app/ui/library";

const statusLabels: Record<ReadingStatus, string> = { "want-to-read": "Want to read", reading: "Reading", finished: "Finished" };
type Filter = "all" | ReadingStatus;

export default function ReadingDashboard() {
  const { books, loaded, updateBook, removeBook } = useLibrary();
  const [filter, setFilter] = useState<Filter>("all");
  const currentYear = new Date().getFullYear();
  const finishedThisYear = books.filter((book) => book.status === "finished" && book.finishedAt && new Date(book.finishedAt).getFullYear() === currentYear);
  const pagesRead = books.reduce((total, book) => total + book.pagesRead, 0);
  const filteredBooks = useMemo(() => filter === "all" ? books : books.filter((book) => book.status === filter), [books, filter]);
  const tabs: { id: Filter; label: string; count: number }[] = [
    { id: "all", label: "All books", count: books.length },
    { id: "reading", label: "Reading", count: books.filter((book) => book.status === "reading").length },
    { id: "want-to-read", label: "Want to read", count: books.filter((book) => book.status === "want-to-read").length },
    { id: "finished", label: "Finished", count: books.filter((book) => book.status === "finished").length },
  ];

  return <main className="workspace dashboard-page">
    <section className="dashboard-welcome">
      <div><p className="eyebrow">YOUR READING LIFE</p><h1>A little progress, one page at a time.</h1><p className="welcome-copy">Your personal library, all in one place.</p></div>
      <Link className="button button-primary discover-cta" href="/booklog"><Plus size={17} /> Find a book</Link>
    </section>

    <section className="stats-grid" aria-label="Reading statistics">
      <StatCard icon={<Check size={18} />} label={`Finished in ${currentYear}`} value={loaded ? finishedThisYear.length.toString() : "—"} caption="books completed" />
      <StatCard icon={<BookOpen size={18} />} label="Currently reading" value={loaded ? books.filter((book) => book.status === "reading").length.toString() : "—"} caption="books in progress" />
      <StatCard icon={<Sparkles size={18} />} label="Pages read" value={loaded ? pagesRead.toLocaleString() : "—"} caption="across your library" />
      <StatCard icon={<Clock3 size={18} />} label="On your list" value={loaded ? books.filter((book) => book.status === "want-to-read").length.toString() : "—"} caption="waiting for you" />
    </section>

    <section className="library-panel">
      <div className="library-heading"><div><p className="eyebrow">YOUR COLLECTION</p><h2>My library</h2></div><span className="library-total">{books.length} {books.length === 1 ? "book" : "books"}</span></div>
      <div className="library-tabs" role="tablist" aria-label="Filter library">
        {tabs.map((tab) => <button type="button" role="tab" aria-selected={filter === tab.id} className={`library-tab ${filter === tab.id ? "active" : ""}`} key={tab.id} onClick={() => setFilter(tab.id)}>{tab.label}<span>{tab.count}</span></button>)}
      </div>
      {!loaded ? <div className="library-empty">Loading your library…</div> : filteredBooks.length ? <div className="library-list">
        {filteredBooks.map((book) => {
          const progress = book.pages ? Math.min(100, Math.round((book.pagesRead / book.pages) * 100)) : null;
          return <article className="library-book" key={book.id}>
            {book.coverUrl ? <img className="library-cover" src={book.coverUrl} alt={`Cover of ${book.title}`} loading="lazy" /> : <div className="library-cover cover-placeholder"><BookOpen size={22} /></div>}
            <div className="library-book-info"><h3>{book.title}</h3><p>{book.author}</p>
              {book.status === "reading" && <div className="progress-area"><div className="progress-copy"><span>{book.pagesRead.toLocaleString()} {book.pages ? `of ${book.pages.toLocaleString()} pages` : "pages read"}</span>{progress !== null && <span>{progress}%</span>}</div>{progress !== null && <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>}<label className="sr-only" htmlFor={`progress-${book.id}`}>Pages read for {book.title}</label><div className="progress-input-row"><input id={`progress-${book.id}`} type="number" min="0" max={book.pages ?? undefined} value={book.pagesRead} onChange={(event) => updateBook(book.id, { pagesRead: Math.max(0, Number(event.target.value) || 0) })} /><span>pages read</span></div></div>}
              {book.status === "finished" && <div className="rating-row" aria-label={`Rate ${book.title}`}><span>Your rating</span>{[1, 2, 3, 4, 5].map((star) => <button key={star} type="button" aria-label={`${star} stars`} className={star <= book.rating ? "star selected" : "star"} onClick={() => updateBook(book.id, { rating: book.rating === star ? 0 : star })}>★</button>)}</div>}
            </div>
            <div className="book-row-actions"><label className="sr-only" htmlFor={`status-${book.id}`}>Reading status for {book.title}</label><select id={`status-${book.id}`} value={book.status} onChange={(event) => updateBook(book.id, { status: event.target.value as ReadingStatus })}>{Object.entries(statusLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select><button className="remove-library-book" type="button" title={`Remove ${book.title}`} aria-label={`Remove ${book.title} from your library`} onClick={() => removeBook(book.id)}><Trash2 size={16} /></button></div>
          </article>;
        })}
      </div> : books.length ? <div className="library-empty"><span>No books in this shelf yet.</span><button type="button" className="text-action" onClick={() => setFilter("all")}>See all books <ArrowRight size={14} /></button></div> : <div className="library-empty"><span className="empty-icon"><BookOpen size={22} /></span><h3>Your library starts with a good find.</h3><p>Search the catalogue, then add books you want to read or are already reading.</p><Link href="/booklog" className="button button-primary"><Plus size={16} /> Discover books</Link></div>}
    </section>
  </main>;
}

function StatCard({ icon, label, value, caption }: { icon: React.ReactNode; label: string; value: string; caption: string }) {
  return <article className="stat-card"><span className="stat-icon">{icon}</span><p>{label}</p><strong>{value}</strong><small>{caption}</small></article>;
}
