"use client";

import { X } from "lucide-react";
import { bookAttributes } from "./bookcards";

type BookDialogProps = { isOpen: boolean; book: bookAttributes; onClose: () => void };

export default function BookDialog({ isOpen, book, onClose }: BookDialogProps) {
  if (!isOpen) return null;
  return <div className="dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="book-dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
      <button className="dialog-close" type="button" onClick={onClose} aria-label="Close book details"><X size={19} /></button>
      <img src={book.coverUrl} alt={`Cover of ${book.title}`} />
      <div><p className="eyebrow">BOOK DETAILS</p><h2 id="dialog-title">{book.title}</h2><p className="dialog-author">{book.author}</p><p className="dialog-pages">{book.pages} pages</p></div>
    </section>
  </div>;
}
