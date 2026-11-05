import { NextRequest, NextResponse } from "next/server";

type GoogleBook = {
  id?: string;
  volumeInfo?: { title?: string; authors?: string[]; pageCount?: number; imageLinks?: { thumbnail?: string; smallThumbnail?: string }; categories?: string[] };
};

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim();
  if (!query) return NextResponse.json({ books: [] });
  if (query.length > 160) return NextResponse.json({ error: "Search query is too long." }, { status: 400 });

  const byIndex = query.toLocaleLowerCase().lastIndexOf(" by ");
  const title = byIndex >= 0 ? query.slice(0, byIndex).trim() : query;
  const author = byIndex >= 0 ? query.slice(byIndex + 4).trim() : "";
  const searches = [
    `https://www.googleapis.com/books/v1/volumes?q=${author ? `intitle:${encodeURIComponent(title)}` : encodeURIComponent(title)}&maxResults=40`,
    ...(author ? [`https://www.googleapis.com/books/v1/volumes?q=inauthor:${encodeURIComponent(author)}&maxResults=40`] : []),
  ];

  try {
    const responses = await Promise.all(searches.map((url) => fetch(url, { next: { revalidate: 300 } })));
    if (responses.some((response) => !response.ok)) throw new Error("Book catalogue request failed");
    const payloads = await Promise.all(responses.map((response) => response.json()));
    const unique = new Map<string, GoogleBook>();
    for (const item of payloads.flatMap((payload) => payload.items ?? []) as GoogleBook[]) {
      if (item.id) unique.set(item.id, item);
    }

    const normalizedTitle = title.toLocaleLowerCase();
    const normalizedAuthor = author.toLocaleLowerCase();
    const books = [...unique.entries()].map(([id, book]) => {
      const info = book.volumeInfo ?? {};
      const bookTitle = info.title ?? "Untitled";
      const authors = info.authors ?? [];
      const score = (bookTitle.toLocaleLowerCase() === normalizedTitle ? 3 : bookTitle.toLocaleLowerCase().startsWith(normalizedTitle) ? 2 : bookTitle.toLocaleLowerCase().includes(normalizedTitle) ? 1 : 0)
        + (normalizedAuthor && authors.join(", ").toLocaleLowerCase().includes(normalizedAuthor) ? 3 : 0);
      return { id, title: bookTitle, author: authors.join(", ") || "Unknown author", pages: info.pageCount?.toString() || "Unknown", coverUrl: (info.imageLinks?.thumbnail ?? info.imageLinks?.smallThumbnail ?? "").replace("http://", "https://"), score };
    }).filter((book) => book.coverUrl && !/(set|bundle|summary)/i.test(book.title))
      .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
      .slice(0, 24)
      .map(({ score: _score, ...book }) => book);

    return NextResponse.json({ books });
  } catch {
    return NextResponse.json({ error: "Book search could not reach the catalogue. Please try again." }, { status: 502 });
  }
}
