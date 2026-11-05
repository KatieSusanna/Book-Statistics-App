"use client";

import { FormEvent, useMemo, useState } from "react";
import { BookOpen, Plus, Shuffle, Trash2 } from "lucide-react";

type Book = { id: string; title: string };
const initialBooks: Book[] = [
  { id: "fourth-wing", title: "Fourth Wing" },
  { id: "acotar", title: "A Court of Thorns and Roses" },
];
const noteColours = ["#f3d7a4", "#d7e5d3", "#efd5d5", "#d9e5ee", "#e5d9ed", "#e7e2ca"];

export default function ReadingBoard() {
  const [books, setBooks] = useState(initialBooks);
  const [title, setTitle] = useState("");
  const [shuffle, setShuffle] = useState(0);
  const [message, setMessage] = useState("");
  const positions = useMemo(() => {
    const slots = Array.from({ length: 16 }, (_, i) => i);
    let seed = shuffle + 17;
    for (let i = slots.length - 1; i > 0; i--) {
      seed = (seed * 9301 + 49297) % 233280;
      const j = Math.floor((seed / 233280) * (i + 1));
      [slots[i], slots[j]] = [slots[j], slots[i]];
    }
    return slots;
  }, [shuffle]);

  function addBook(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) return;
    if (books.length >= 16) {
      setMessage("Your board is full. Remove a title to make room.");
      return;
    }
    setBooks((current) => [...current, { id: crypto.randomUUID(), title: cleanTitle }]);
    setTitle("");
    setMessage("");
  }

  function removeBook(id: string) {
    setBooks((current) => current.filter((book) => book.id !== id));
  }

  return (
    <main className="workspace">
      <section className="welcome-row">
        <div>
          <p className="eyebrow">YOUR PERSONAL READING SPACE</p>
          <h1>Make room for a good story.</h1>
          <p className="welcome-copy">Keep the books on your mind close at hand.</p>
        </div>
        <div className="reading-count"><BookOpen size={19} /><span><strong>{books.length}</strong> {books.length === 1 ? "book" : "books"} on your board</span></div>
      </section>

      <section className="board-panel" aria-label="Reading board">
        <div className="board-toolbar">
          <div><h2>Your reading board</h2><p>Add a title, then arrange your list your way.</p></div>
          <div className="toolbar-actions">
            <button className="button button-secondary" onClick={() => setShuffle((n) => n + 1)} type="button"><Shuffle size={16} /> Shuffle</button>
            <button className="button button-quiet" onClick={() => { setBooks([]); setMessage(""); }} type="button" disabled={!books.length}><Trash2 size={16} /> Clear board</button>
          </div>
        </div>

        <form className="add-book-form" onSubmit={addBook}>
          <label className="sr-only" htmlFor="book-title">Book title</label>
          <input id="book-title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Add a book to your board…" maxLength={100} />
          <button className="button button-primary" type="submit"><Plus size={17} /> Add book</button>
        </form>
        {message && <p className="form-message" role="status">{message}</p>}

        {books.length ? <div className="book-board">
          {books.map((book, index) => {
            const slot = positions[index];
            return <article className="board-book" key={book.id} style={{ order: slot, backgroundColor: noteColours[index % noteColours.length], transform: `rotate(${(index % 3 - 1) * 1.3}deg)` }}>
              <span className="book-index">{String(index + 1).padStart(2, "0")}</span>
              <h3>{book.title}</h3>
              <button className="remove-book" aria-label={`Remove ${book.title}`} title="Remove book" onClick={() => removeBook(book.id)} type="button"><Trash2 size={15} /></button>
            </article>;
          })}
        </div> : <div className="empty-board"><span className="empty-icon"><BookOpen size={23} /></span><h3>Your next read starts here</h3><p>Add a book title and it will appear on your board.</p></div>}
        <p className="board-hint">Select the bin on a book card to remove it from your board.</p>
      </section>
    </main>
  );
}
