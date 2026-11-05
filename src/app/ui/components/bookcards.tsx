"use client";

export type bookAttributes = {
  id?: string;
  title: string;
  author: string;
  pages: string;
  coverUrl: string;
  onClick?: () => void;
};

export default function BookCards({ title, author, pages, coverUrl, onClick }: bookAttributes) {
  return <button type="button" onClick={onClick} className="result-card">
    <img src={coverUrl} alt={`Cover of ${title}`} loading="lazy" />
    <span className="result-card-copy"><strong>{title}</strong><span>{author}</span><small>{pages} pages</small></span>
  </button>;
}
