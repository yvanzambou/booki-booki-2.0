"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth(); const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  function change(event) { setForm(current => ({ ...current, [event.target.name]: event.target.value })); }
  
  async function submit(event) {
    event.preventDefault(); setError("");
    if (form.password !== form.confirmPassword) { setError("Die Passwörter stimmen nicht überein."); return; }
    setBusy(true);
    try { await register({ name: form.name, email: form.email, password: form.password }); router.push("/"); }
    catch (err) { setError(err.response?.data?.message || "Registrierung fehlgeschlagen."); }
    finally { setBusy(false); }
  }
  
  return <section className="auth-section"><div className="auth-card"><span className="eyebrow eyebrow-dark">DEIN LESEABENTEUER BEGINNT HIER</span><h1>Ein Konto. <em>Viele Geschichten.</em></h1><p>Erstelle dein Konto und behalte deinen Warenkorb dauerhaft im Blick.</p>
    <form onSubmit={submit} className="shop-form"><label>Name<input name="name" autoComplete="name" required minLength={2} maxLength={120} value={form.name} onChange={change} /></label><label>E-Mail-Adresse<input name="email" type="email" autoComplete="email" required value={form.email} onChange={change} /></label><label>Passwort<input name="password" type="password" autoComplete="new-password" required minLength={8} value={form.password} onChange={change} /><small>Mindestens 8 Zeichen.</small></label><label>Passwort wiederholen<input name="confirmPassword" type="password" autoComplete="new-password" required value={form.confirmPassword} onChange={change} /></label>
      {error && <div className="form-error">{error}</div>}<button className="button-primary form-submit" disabled={busy}>{busy ? "Konto wird erstellt ..." : "Konto erstellen"}</button></form>
    <div className="auth-switch">Du hast bereits ein Konto? <Link href="/login">Jetzt anmelden</Link></div><Link className="back-link" href="/">← Zurück zum Buchladen</Link>
  </div></section>;
}