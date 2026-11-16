import "./globals.css";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import Providers from "../components/Providers";

export const metadata = {
  title: "Booki-Booki – Finde dein nächstes Lieblingsbuch",
  description: "Entdecke Bücher, stöbere durch Genres und finde deine nächste Lieblingsgeschichte.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body>
        <Providers>
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}