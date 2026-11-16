"use client";

import Link from "next/link";
import { BookOpen, ShoppingBag, UserRound, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function SiteHeader() {
  const { user, loading, logout } = useAuth();
  const { cart } = useCart();
  return (
    <header className="site-header">
      <nav className="container nav-shell" aria-label="Hauptnavigation">
        <Link href="/" className="brand-mark" aria-label="Booki-Booki Startseite">
          <span className="brand-icon"><BookOpen size={21} strokeWidth={2.2} /></span>
          <span>booki<span className="brand-dot">.</span>booki</span>
        </Link>
        <div className="nav-links">
          <Link href="/#catalog">Bücher entdecken</Link>
          <Link href="/#genres">Genres</Link>
        </div>
        <div className="nav-actions">
          {user ? <>
            <span className="nav-user">Hallo, {user.name.split(" ")[0]}</span>
            <Link className="nav-action" href="/cart"><ShoppingBag size={18} /> Warenkorb <span className="cart-count">{cart.itemCount}</span></Link>
            <button className="nav-action nav-logout" onClick={logout} title="Abmelden"><LogOut size={17} /><span>Abmelden</span></button>
          </> : !loading && <>
            <Link className="nav-action" href="/login"><UserRound size={17} /> Anmelden</Link>
            <Link className="nav-register" href="/register">Konto erstellen</Link>
            <Link className="nav-action" href="/login?next=/cart"><ShoppingBag size={18} /> Warenkorb</Link>
          </>}
        </div>
      </nav>
    </header>
  );
}