"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { placeOrder, savePaymentProfile, fetchPaymentProfile } from "../../lib/api";

const money = value => new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(Number(value || 0));
const initial = { recipient: "", street: "", postalCode: "", city: "", country: "Deutschland", paymentMethod: "invoice" };

export default function CheckoutPage() {
  const { user, loading: authLoading } = useAuth(); const { cart, refreshCart } = useCart(); const router = useRouter();
  const [form, setForm] = useState(initial); const [loading, setLoading] = useState(true); const [busy, setBusy] = useState(false); const [error, setError] = useState(""); const [order, setOrder] = useState(null);
  useEffect(() => { if (!authLoading && !user) router.replace("/login?next=/checkout"); }, [authLoading, user, router]);
  useEffect(() => { if (user) fetchPaymentProfile().then(data => setForm(current => ({ ...current, ...data }))).catch(() => {}).finally(() => setLoading(false)); }, [user]);
  
  function change(event) { setForm(current => ({ ...current, [event.target.name]: event.target.value })); }
  
  async function submit(event) {
    event.preventDefault(); setBusy(true); setError("");
    try {
      await savePaymentProfile(form);
      const result = await placeOrder(); setOrder(result); await refreshCart();
    } catch (err) { setError(err.response?.data?.message || "Die Bestellung konnte nicht abgeschlossen werden."); }
    finally { setBusy(false); }
  }

  if (authLoading || !user || loading) return <section className="shop-section"><div className="container">Checkout wird geladen ...</div></section>;
  if (order) return <section className="shop-section"><div className="container"><div className="order-success"><span className="success-mark">✓</span><span className="eyebrow eyebrow-dark">VIELEN DANK</span><h1>Deine Bestellung ist <em>eingegangen.</em></h1><p>Bestellnummer: <strong>#{order.id}</strong></p><p>Gesamtbetrag: <strong>{money(order.total)}</strong></p><p className="demo-note">{order.message}</p><Link className="button-primary" href="/">Weiter einkaufen</Link></div></div></section>;
  if (!cart.items.length) return <section className="shop-section"><div className="container"><h1>Dein Warenkorb ist leer.</h1><Link href="/#catalog">Bücher entdecken</Link></div></section>;
  
  return <section className="shop-section"><div className="container"><div className="shop-page-heading"><span className="eyebrow eyebrow-dark">FAST GESCHAFFT</span><h1>Zur <em>Kasse.</em></h1><p>Prüfe deine Lieferadresse und wähle eine Demo-Zahlungsart.</p></div>
    <div className="checkout-layout"><form className="checkout-form shop-form" onSubmit={submit}><h2>Lieferadresse</h2>
      <label>Empfänger<input name="recipient" required value={form.recipient || ""} onChange={change}/></label><label>Straße und Hausnummer<input name="street" required value={form.street || ""} onChange={change}/></label>
      <div className="form-two-columns"><label>Postleitzahl<input name="postalCode" required value={form.postalCode || ""} onChange={change}/></label><label>Stadt<input name="city" required value={form.city || ""} onChange={change}/></label></div><label>Land<input name="country" required value={form.country || ""} onChange={change}/></label>
      <h2>Zahlungsart</h2><label className="payment-option"><input type="radio" name="paymentMethod" value="invoice" checked={form.paymentMethod === "invoice"} onChange={change}/> Rechnung</label><label className="payment-option"><input type="radio" name="paymentMethod" value="paypal" checked={form.paymentMethod === "paypal"} onChange={change}/> PayPal (Demo)</label><label className="payment-option"><input type="radio" name="paymentMethod" value="card" checked={form.paymentMethod === "card"} onChange={change}/> Kreditkarte (Demo)</label>
      {error && <div className="form-error">{error}</div>}<button className="button-primary form-submit" disabled={busy}>{busy ? "Bestellung wird verarbeitet ..." : `Kostenpflichtig bestellen · ${money(cart.total)}`}</button><p className="demo-note">Demo-Projekt: Es wird keine echte Zahlung ausgelöst.</p>
    </form><aside className="cart-summary checkout-summary"><h2>Deine Bestellung</h2>{cart.items.map(item => <div key={item.id}><span>{item.quantity} × {item.title}</span><strong>{money(Number(item.price || 0) * item.quantity)}</strong></div>)}<div className="summary-total"><span>Gesamt</span><strong>{money(cart.total)}</strong></div><Link href="/cart" className="back-link">Warenkorb bearbeiten</Link></aside></div>
  </div></section>;
}