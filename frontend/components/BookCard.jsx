"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, Star, ArrowUpRight, ShoppingBag } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

function formatPrice(price) {
  if (price === null || price === undefined || Number.isNaN(Number(price))) return null;
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(Number(price));
}

export default function BookCard({ book, index = 0 }) {
  const genres = Array.isArray(book.genres) ? book.genres.slice(0, 2) : [];
  const { user } = useAuth(); const { addItem } = useCart(); const router = useRouter();
  const [message, setMessage] = useState(""); const [busy, setBusy] = useState(false);
  
  async function add() {
    if (!user) { router.push("/login?next=/cart"); return; }
    setBusy(true); setMessage("");
    try { await addItem(book.id); setMessage("Im Warenkorb"); }
    catch (error) { setMessage(error.response?.data?.message || "Nicht möglich"); }
    finally { setBusy(false); }
  }

  return (
    <article className="book-card" style={{ "--card-index": index }}>
      <Link href={`/books/${book.id}`} className="book-cover-link" aria-label={`${book.title} ansehen`}><div className="book-cover">
        {book.coverImg ? <img src={book.coverImg} alt={`Cover: ${book.title}`} loading="lazy" /> : <div className="cover-placeholder"><BookOpen size={38} /><span>BOOKI BOOKI</span></div>}
        <span className="cover-open"><ArrowUpRight size={17} /></span>
      </div></Link>
      <div className="book-card-body"><div className="book-tags">{genres.map(genre => <span key={genre}>{genre}</span>)}</div>
        <h3><Link href={`/books/${book.id}`}>{book.title}</Link></h3><p className="book-author">{book.author}</p>
        <div className="book-card-bottom"><span className="book-rating">{book.rating ? <><Star size={14} fill="currentColor" /> {Number(book.rating).toFixed(1)}</> : <span className="rating-muted">Noch unbewertet</span>}</span><strong>{formatPrice(book.price) || "Details ansehen"}</strong></div>
        <button className="book-add-button" onClick={add} disabled={busy || book.price == null}>{busy ? "Wird hinzugefügt ..." : <><ShoppingBag size={15}/> In den Warenkorb</>}</button>
        {message && <small className="book-add-message">{message}</small>}
      </div>
    </article>
  );
}