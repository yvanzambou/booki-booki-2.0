"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault(); setError(""); setBusy(true);
    try { await login({ email, password }); const next = new URLSearchParams(window.location.search).get("next") || "/";
      router.push(next.startsWith("/") ? next : "/"); }
    catch (err) { setError(err.response?.data?.message || "Anmeldung fehlgeschlagen."); }
    finally { setBusy(false); }
  }
  
  return <section className="auth-section"><div className="auth-card"><span className="eyebrow eyebrow-dark">SCHÖN, DASS DU DA BIST</span><h1>Willkommen <em>zurück.</em></h1><p>Melde dich an und entdecke deine persönliche Bücherwelt.</p>
    <form onSubmit={submit} className="shop-form"><label>E-Mail-Adresse<input type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} /></label><label>Passwort<input type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} /></label>
      {error && <div className="form-error">{error}</div>}<button className="button-primary form-submit" disabled={busy}>{busy ? "Anmeldung läuft ..." : "Anmelden"}</button></form>
    <div className="auth-switch">Noch kein Konto? <Link href="/register">Jetzt registrieren</Link></div><Link className="back-link" href="/">← Zurück zum Buchladen</Link>
  </div></section>;
}