import Link from "next/link";
import { BookOpen, Instagram, Mail } from "lucide-react";

export default function SiteFooter() {
  return (
    <footer className="site-footer" id="about">
      <div className="container footer-inner">
        <div>
          <Link href="/" className="brand-mark footer-brand">
            <span className="brand-icon"><BookOpen size={19} /></span>
            <span>booki<span className="brand-dot">.</span>booki</span>
          </Link>
          <p className="footer-copy">Gute Geschichten. Neue Perspektiven.<br />Dein nächstes Lieblingsbuch wartet schon.</p>
        </div>
        <div className="footer-note">
          <span>MIT LIEBE ZUM LESEN GEMACHT</span>
          <div className="footer-socials"><span><Mail size={17} /></span><span><Instagram size={17} /></span></div>
          <small>© {new Date().getFullYear()} Booki-Booki</small>
        </div>
      </div>
    </footer>
  );
}