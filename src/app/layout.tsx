import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, LibraryBig } from "lucide-react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Page & Chapter — Your reading space",
  description: "A considered space to track books and discover your next read.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>
    <div className="app-shell">
      <header className="site-header">
        <Link href="/" className="brand" aria-label="Page and Chapter home"><span className="brand-mark"><LibraryBig size={22} strokeWidth={1.8} /></span><span>page<span className="brand-amp">&</span>chapter</span></Link>
        <nav className="site-nav" aria-label="Main navigation"><Link href="/" className="nav-link"><BookOpen size={16} /> My board</Link><Link href="/booklog" className="nav-link">Discover books</Link></nav>
      </header>
      {children}
      <footer className="site-footer"><span>Made for the love of a good book.</span><span>PAGE & CHAPTER</span></footer>
    </div>
  </body></html>;
}
