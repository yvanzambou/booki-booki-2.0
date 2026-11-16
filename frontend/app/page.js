"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowDown, ChevronLeft, ChevronRight, Search, Sparkles, X, Library, Truck, Tags } from "lucide-react";
import BookCard from "../components/BookCard";
import { fetchBooks, fetchGenres } from "../lib/api";

const PAGE_SIZE = 12;

export default function HomePage() {
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [activeGenre, setActiveGenre] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalItems: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchGenres().then(setGenres).catch(() => setGenres([]));
  }, []);

  const loadBooks = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await fetchBooks({ page, limit: PAGE_SIZE, search, genreId: activeGenre });
      setBooks(result.data || []);
      setPagination(result.pagination || { totalItems: 0, totalPages: 0 });
    } catch (err) {
      setBooks([]);
      setPagination({ totalItems: 0, totalPages: 0 });
      setError(err.response?.data?.message || "Der Katalog konnte nicht geladen werden. Bitte prüfe, ob das Backend läuft.");
    } finally {
      setLoading(false);
    }
  }, [page, search, activeGenre]);

  useEffect(() => { loadBooks(); }, [loadBooks]);

  function submitSearch(event) {
    event.preventDefault();
    setActiveGenre(null);
    setPage(1);
    setSearch(searchInput.trim());
  }

  function chooseGenre(id) {
    setSearch("");
    setSearchInput("");
    setActiveGenre(id);
    setPage(1);
  }

  function clearFilters() {
    setSearch("");
    setSearchInput("");
    setActiveGenre(null);
    setPage(1);
  }

  const activeGenreName = genres.find((genre) => genre.id === activeGenre)?.name;

  return (
    <div className="home-page">
      <section className="welcome-section">
        <div className="container welcome-content">
          <div className="welcome-copy">
            <p className="welcome-label">Willkommen bei Booki-Booki</p>
            <h1>Finde dein nächstes <span>Lieblingsbuch.</span></h1>
            <p className="welcome-description">
              Entdecke neue Geschichten, stöbere durch Genres und finde Bücher, die zu dir passen.
            </p>
            <div className="welcome-actions">
              <a className="button-primary" href="#catalog">Bücher entdecken <ArrowDown size={16} aria-hidden="true" /></a>
              <a className="welcome-link" href="#genres">Nach Genre stöbern</a>
            </div>
            <div className="welcome-points">
              <span><Library size={17} aria-hidden="true" /> Große Auswahl</span>
              <span><Tags size={17} aria-hidden="true" /> Genres &amp; Suche</span>
              <span><Truck size={17} aria-hidden="true" /> Versandkostenfrei</span>
            </div>
          </div>
          <div className="welcome-art" aria-hidden="true">
            <div className="art-book art-book-1"><span>Neue<br />Welten</span><i>ROMAN</i></div>
            <div className="art-book art-book-2"><span>Nachts<br />lesen</span><i>KRIMI</i></div>
            <div className="art-book art-book-3"><span>booki<br />booki</span><i>DEIN NÄCHSTES BUCH</i></div>
            <Sparkles className="art-spark art-spark-1" size={30} />
            <Sparkles className="art-spark art-spark-2" size={18} />
          </div>
        </div>
      </section>

      <section className="catalog-section" id="catalog">
        <div className="container catalog-container">
          <div className="catalog-heading">
            <div>
              <p className="section-kicker">ENTDECKEN</p>
              <h2>Unser Bücherkatalog</h2>
              <p className="catalog-subtitle">Suche nach einem Buch oder wähle ein Genre.</p>
            </div>
            <p className="catalog-total">{pagination.totalItems} {pagination.totalItems === 1 ? "Buch" : "Bücher"}</p>
          </div>

          <form className="catalog-search" onSubmit={submitSearch}>
            <Search size={21} aria-hidden="true" />
            <input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Titel oder Autor suchen ..."
              aria-label="Bücher suchen"
            />
            {searchInput && (
              <button type="button" className="clear-search" onClick={() => { setSearchInput(""); setSearch(""); setPage(1); }} aria-label="Suche leeren">
                <X size={19} />
              </button>
            )}
            <button type="submit" className="search-submit">Suchen</button>
          </form>

          {genres.length > 0 && (
            <div className="genre-filter" id="genres">
              <span className="filter-label">GENRE</span>
              <div className="genre-list">
                <button type="button" className={`genre-chip ${activeGenre === null ? "active" : ""}`} onClick={() => chooseGenre(null)}>Alle Bücher</button>
                {genres.map((genre) => (
                  <button
                    key={genre.id}
                    type="button"
                    className={`genre-chip ${activeGenre === genre.id ? "active" : ""}`}
                    onClick={() => chooseGenre(genre.id)}
                  >
                    {genre.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="results-heading">
            <div>
              <h3>{search ? `Suchergebnisse für „${search}“` : activeGenreName || "Alle Bücher"}</h3>
              {!loading && <p>{pagination.totalItems} {pagination.totalItems === 1 ? "Treffer" : "Treffer"}</p>}
            </div>
            {(search || activeGenre !== null) && (
              <button type="button" className="reset-filters" onClick={clearFilters}>Filter zurücksetzen</button>
            )}
          </div>

          {error ? (
            <div className="state-panel error-panel">
              <h3>Bücher konnten nicht geladen werden</h3>
              <p>{error}</p>
              <button type="button" className="primary-button" onClick={loadBooks}>Erneut versuchen</button>
            </div>
          ) : loading ? (
            <div className="book-grid">
              {Array.from({ length: 8 }).map((_, index) => <div className="book-skeleton" key={index}><div /><span /><i /></div>)}
            </div>
          ) : books.length > 0 ? (
            <div className="book-grid">
              {books.map((book, index) => <BookCard book={book} index={index} key={book.id} />)}
            </div>
          ) : (
            <div className="state-panel">
              <h3>Keine Bücher gefunden</h3>
              <p>Ändere deine Suche oder wähle ein anderes Genre.</p>
              <button type="button" className="primary-button" onClick={clearFilters}>Alle Bücher anzeigen</button>
            </div>
          )}

          {!loading && !error && pagination.totalPages > 1 && (
            <div className="pagination-row">
              <span>Seite {page} von {pagination.totalPages}</span>
              <div className="pagination-actions">
                <button aria-label="Vorherige Seite" disabled={page <= 1} onClick={() => setPage((current) => current - 1)}>
                  <ChevronLeft size={21} />
                </button>
                <button aria-label="Nächste Seite" disabled={page >= pagination.totalPages} onClick={() => setPage((current) => current + 1)}>
                  <ChevronRight size={21} />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}