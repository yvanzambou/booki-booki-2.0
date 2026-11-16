"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, BookOpen, Star, ShoppingBag } from "lucide-react";
import { fetchBook } from "../../../lib/api";
import { useAuth } from "../../../context/AuthContext";
import { useCart } from "../../../context/CartContext";

function formatPrice(price) {
  if (price === null || price === undefined || Number.isNaN(Number(price))) return "Preis nicht angegeben";
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(Number(price));
}

export default function BookDetailPage() {
  const params = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartMessage, setCartMessage] = useState("");
  const { user } = useAuth();
  const { addItem } = useCart();
  const router = useRouter();
  async function addToCart() {
    if (!user) { router.push("/login?next=/cart"); return; }
    try { await addItem(book.id); setCartMessage("Buch wurde zum Warenkorb hinzugefügt."); }
    catch (err) { setCartMessage(err.response?.data?.message || "Das Buch konnte nicht hinzugefügt werden."); }
  }

  useEffect(() => {
    if (!params.id) return;
    fetchBook(params.id)
      .then(setBook)
      .catch((err) => setError(err.response?.status === 404 ? "Dieses Buch wurde nicht gefunden." : "Das Buch konnte nicht geladen werden. Bitte versuche es erneut."))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) return <section className="detail-section"><div className="container detail-state">Buch wird geladen ...</div></section>;
  if (error || !book) return <section className="detail-section"><div className="container detail-state"><h2>{error || "Buch nicht gefunden"}</h2><Link href="/" className="button-primary"><ArrowLeft size={16} /> Zurück zum Katalog</Link></div></section>;

  return (
    <section className="detail-section">
      <div className="container">
        <Link href="/" className="back-link"><ArrowLeft size={16} /> Zurück zum Katalog</Link>
        <div className="detail-layout">
          <div className="detail-cover-wrap">
            {book.coverImg ? <img className="detail-cover" src={book.coverImg} alt={`Cover: ${book.title}`} /> : <div className="detail-cover cover-placeholder"><BookOpen size={54} /><span>BOOKI BOOKI</span></div>}
          </div>
          <div className="detail-copy">
            <div className="eyebrow eyebrow-dark">DIE GESCHICHTE WARTET</div>
            <h1>{book.title}</h1>
            <p className="detail-author">von <strong>{book.author}</strong></p>
            <div className="detail-meta">
              {book.rating && <span><Star size={16} fill="currentColor" /> {Number(book.rating).toFixed(1)}</span>}
              {book.pages && <span>{book.pages} Seiten</span>}
              {book.language && <span>{book.language}</span>}
            </div>
            <div className="detail-price">{formatPrice(book.price)}</div>
            <button className="button-primary detail-add-button" onClick={addToCart} disabled={book.price == null}><ShoppingBag size={17}/> In den Warenkorb</button>
            {cartMessage && <p className="book-add-message">{cartMessage}</p>}
            {Array.isArray(book.genres) && book.genres.length > 0 && <div className="detail-genres">{book.genres.map((genre) => <span key={genre}>{genre}</span>)}</div>}
            <div className="detail-description">
              <h2>Worum geht's?</h2>
              <p>{book.description || "Zu diesem Buch liegt derzeit keine Beschreibung vor. Manchmal ist das die schönste Einladung, selbst hineinzulesen."}</p>
            </div>
            <div className="detail-facts">
              {book.publisher && <div><span>VERLAG</span><strong>{book.publisher}</strong></div>}
              {book.publishDate && <div><span>ERSCHIENEN</span><strong>{book.publishDate}</strong></div>}
              {book.isbn && <div><span>ISBN</span><strong>{book.isbn}</strong></div>}
              {book.bookFormat && <div><span>FORMAT</span><strong>{book.bookFormat}</strong></div>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}