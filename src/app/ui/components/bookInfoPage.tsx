"use client";

import { Check, Plus, X } from "lucide-react";
import type { bookAttributes } from "./bookcards";

type BookDialogProps = { isOpen: boolean; book: bookAttributes; isSaved: boolean; onAdd: () => void; onClose: () => void };

export default function BookDialog({ isOpen, book, isSaved, onAdd, onClose }: BookDialogProps) {
  if (!isOpen) return null;
  return <div className="dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="book-dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
      <button className="dialog-close" type="button" onClick={onClose} aria-label="Close book details"><X size={19} /></button>
      <img src={book.coverUrl} alt={`Cover of ${book.title}`} />
      <div><p className="eyebrow">BOOK DETAILS</p><h2 id="dialog-title">{book.title}</h2><p className="dialog-author">{book.author}</p><p className="dialog-pages">{book.pages} pages</p><button type="button" className={isSaved ? "button button-secondary dialog-add" : "button button-primary dialog-add"} onClick={onAdd} disabled={isSaved}>{isSaved ? <Check size={16} /> : <Plus size={16} />}{isSaved ? "In your library" : "Add to my library"}</button></div>
    </section>
  </div>;
}
