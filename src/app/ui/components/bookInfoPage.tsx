import { bookAttributes } from "./bookcards";

type BookDialogProps = {
  isOpen: boolean;
  book: bookAttributes;
  onClose: () => void;
};

export default function BookDialog({ isOpen, book, onClose }: BookDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-[400px] relative">
        <button className="absolute top-2 right-2 text-red-500" onClick={onClose}>
          ✕
        </button>
        <img className="object-cover mb-4" alt="book cover" src={book.coverUrl} />
        <h1 className="text-xl font-bold">{book.title}</h1>
        <h2 className="text-lg">{book.author}</h2>
        <p>Pages: {book.pages}</p>
      </div>
    </div>
  );
}
