"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useRouter } from "next/navigation";

const money = value => new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(Number(value || 0));

export default function CartPage() {
  const { user, loading: authLoading } = useAuth(); const { cart, loading, updateItem, removeItem } = useCart(); const router = useRouter();
  const [error, setError] = useState(""); const [busyId, setBusyId] = useState(null);
  useEffect(() => { if (!authLoading && !user) router.replace("/login?next=/cart"); }, [authLoading, user, router]);

  async function update(item, quantity) {
    setError(""); setBusyId(item.id);
    try { if (quantity < 1) await removeItem(item.id); else await updateItem(item.id, quantity); }
    catch (err) { setError(err.response?.data?.message || "Warenkorb konnte nicht aktualisiert werden."); }
    finally { setBusyId(null); }
  }

  if (authLoading || !user) return <section className="shop-section"><div className="container">Warenkorb wird geladen ...</div></section>;
  
  return <section className="shop-section"><div className="container"><div className="shop-page-heading"><span className="eyebrow eyebrow-dark">DEINE AUSWAHL</span><h1>Dein <em>Warenkorb.</em></h1><p>Hier findest du deine ausgewählten Bücher.</p></div>
    {error && <div className="form-error">{error}</div>}
    {loading ? <p>Warenkorb wird geladen ...</p> : !cart.items.length ? <div className="empty-cart"><ShoppingBag size={38}/><h2>Dein Warenkorb ist noch leer.</h2><p>Entdecke Bücher, die dich inspirieren.</p><Link className="button-primary" href="/#catalog">Bücher entdecken</Link></div> :
      <div className="cart-layout"><div className="cart-items">{cart.items.map(item => <article className="cart-item" key={item.id}>
        <div className="cart-cover">{item.coverImg ? <img src={item.coverImg} alt={`Cover ${item.title}`}/> : <span>BOOKI<br/>BOOKI</span>}</div>
        <div className="cart-item-info"><Link href={`/books/${item.bookId}`}><h3>{item.title}</h3></Link><p>{item.author}</p><strong>{money(item.price)}</strong></div>
        <div className="cart-item-controls"><div className="quantity-control"><button aria-label="Menge verringern" disabled={busyId === item.id} onClick={() => update(item, item.quantity - 1)}><Minus size={15}/></button><span>{item.quantity}</span><button aria-label="Menge erhöhen" disabled={busyId === item.id || item.quantity >= 99} onClick={() => update(item, item.quantity + 1)}><Plus size={15}/></button></div><button className="remove-item" disabled={busyId === item.id} onClick={() => update(item, 0)}><Trash2 size={15}/> Entfernen</button></div>
        <strong className="cart-line-total">{money(Number(item.price || 0) * item.quantity)}</strong>
      </article>)}</div>
      <aside className="cart-summary"><h2>Zusammenfassung</h2><div><span>Artikel ({cart.itemCount})</span><strong>{money(cart.total)}</strong></div><div><span>Versand</span><strong>Kostenlos</strong></div><div className="summary-total"><span>Gesamt</span><strong>{money(cart.total)}</strong></div><Link className="button-primary form-submit" href="/checkout">Weiter zur Kasse</Link><p>Die Zahlung wird im Demo-Checkout nicht tatsächlich ausgeführt.</p></aside></div>}
  </div></section>;
}