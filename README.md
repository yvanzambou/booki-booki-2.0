 <p align="center">
  <img src="https://img.shields.io/badge/Node.js-22-339933?logo=nodedotjs" />
  <img src="https://img.shields.io/badge/Next.js-15-000000?logo=nextdotjs" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" />
  <img src="https://img.shields.io/badge/Express-5-000000?logo=express" />
  <img src="https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?logo=javascript" />
  <img src="https://img.shields.io/badge/PostgreSQL-17-4169E1?logo=postgresql" />
  <img src="https://img.shields.io/badge/Bootstrap-5.3-7952B3?logo=bootstrap" />
  <img src="https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker" />
  <img src="https://img.shields.io/badge/Database_Access-pg-336791?logo=postgresql" />
</p>

# 📚 Booki-Booki 2.0 – Online Bookshop

**Booki-Booki 2.0** ist eine Full-Stack-Webanwendung für einen Online-Buchhandel. Nutzer können einen umfangreichen Buchkatalog durchsuchen, Bücher nach Genres filtern, Details zu einzelnen Büchern anzeigen und diese in einen persönlichen Warenkorb legen.

Die Anwendung bietet außerdem eine Benutzerregistrierung mit Anmeldung, einen persistenten Warenkorb sowie einen Checkout-Prozess mit gespeicherter Lieferadresse und ausgewählter Zahlungsmethode.

Das Frontend basiert auf Next.js und React. Die Kommunikation mit dem Backend erfolgt über eine REST-API auf Basis von Node.js und Express. PostgreSQL übernimmt die dauerhafte Speicherung der Buch-, Benutzer- und Bestelldaten. Der Datenbankzugriff erfolgt direkt über `pg` und parametrisierte SQL-Abfragen – ohne ORM oder Prisma.

Die gesamte Anwendung kann mit Docker Compose gestartet werden.

---

## 🚀 Funktionen

### 📖 Buchkatalog

- **Buchübersicht:** Anzeige der verfügbaren Bücher mit Cover, Titel, Autor und Preis
- **Buchdetails:** Detaillierte Informationen zu einzelnen Büchern
- **Suche:** Suche nach Buchtiteln und Autoren
- **Genre-Filter:** Filterung des Buchkatalogs nach Genres
- **Pagination:** Seitenweise Darstellung der Bücher zur besseren Übersicht
- **Buchinformationen:** Anzeige von Beschreibung, Sprache, ISBN, Verlag, Erscheinungsdatum, Seitenzahl und Bewertung

### 👤 Benutzerkonto und Authentifizierung

- **Registrierung:** Erstellung eines Benutzerkontos mit Name, E-Mail-Adresse und Passwort
- **Anmeldung:** Login mit E-Mail-Adresse und Passwort
- **Passwortsicherheit:** Speicherung der Passwörter als Hash mit bcryptjs
- **JWT-Authentifizierung:** Absicherung geschützter REST-API-Endpunkte
- **Benutzersitzung:** Verwaltung des Authentifizierungstokens im Browser
- **Benutzerprofil:** Abruf der Informationen des aktuell angemeldeten Benutzers

### 🛒 Warenkorb und Bestellungen

- **Warenkorb:** Bücher zum persönlichen Warenkorb hinzufügen
- **Mengenverwaltung:** Anzahl der Exemplare erhöhen oder reduzieren
- **Artikel entfernen:** Einzelne Bücher aus dem Warenkorb löschen
- **Persistenter Warenkorb:** Speicherung des Warenkorbs in PostgreSQL
- **Lieferadresse:** Speicherung und Wiederverwendung der persönlichen Lieferadresse
- **Zahlungsmethode:** Auswahl zwischen Rechnung, PayPal und Kreditkarte
- **Checkout:** Erstellung einer Bestellung aus dem aktuellen Warenkorb
- **Bestellspeicherung:** Speicherung der Bestellung einschließlich Buchinformationen, Mengen und Gesamtbetrag

### 🗄️ Datenbank und Infrastruktur

- **PostgreSQL:** Dauerhafte Speicherung aller relevanten Anwendungsdaten
- **Direkter SQL-Zugriff:** Datenbankoperationen mit `pg` und parametrisierten SQL-Abfragen
- **Datenimport:** Import des Buchkatalogs aus einer JSON-Datei
- **Automatische Datenbankinitialisierung:** Erstellung der benötigten Tabellen beim Start des Backends
- **Docker Compose:** Gemeinsamer Betrieb von Frontend, Backend und Datenbank
- **Health Check:** Überprüfung der Datenbankverbindung über einen API-Endpunkt

---

## 🧰 Verwendete Technologien

| Bereich | Technologie |
|---|---|
| Runtime | Node.js 22 |
| Frontend-Framework | Next.js 15.5 |
| UI-Bibliothek | React 19 |
| Programmiersprache | JavaScript (ES6+) |
| Styling | Bootstrap 5.3, Custom CSS |
| Icons | Lucide React |
| HTTP-Kommunikation | Axios |
| Backend-Framework | Express 5 |
| REST-Schnittstelle | Express REST API |
| Authentifizierung | JSON Web Token (JWT) |
| Passwort-Hashing | bcryptjs |
| Datenbank | PostgreSQL 17 |
| Datenbankzugriff | node-postgres (`pg`) |
| Konfiguration | dotenv |
| Containerisierung | Docker |
| Container-Orchestrierung | Docker Compose |

---

## 🏗️ Projektarchitektur

Die Anwendung ist in drei Hauptkomponenten unterteilt:

```text
                 Benutzer
                    |
                    v
        +------------------------+
        |     Next.js Frontend   |
        |        React 19        |
        |                        |
        |  - Buchkatalog         |
        |  - Buchdetails         |
        |  - Registrierung       |
        |  - Anmeldung           |
        |  - Warenkorb           |
        |  - Checkout            |
        +------------------------+
                    |
                    | HTTP / REST
                    | Axios + JWT
                    v
        +------------------------+
        |    Node.js Backend     |
        |       Express 5        |
        |                        |
        |  - REST API            |
        |  - Controller          |
        |  - Services            |
        |  - Authentifizierung   |
        |  - SQL-Abfragen        |
        +------------------------+
                    |
                    | node-postgres
                    | Parametrisierte SQL-Abfragen
                    v
        +------------------------+
        |      PostgreSQL 17     |
        |                        |
        |  - Bücher              |
        |  - Genres              |
        |  - Benutzer            |
        |  - Warenkörbe          |
        |  - Bestellungen        |
        +------------------------+
```

### Aufgaben der einzelnen Komponenten

- **Next.js / React:** Darstellung der Benutzeroberfläche, Navigation und Verwaltung des Frontend-Zustands.
- **Axios:** Kommunikation mit der REST-API und automatische Übermittlung des JWT bei authentifizierten Anfragen.
- **Express:** Bereitstellung der API-Endpunkte und Verarbeitung eingehender HTTP-Anfragen.
- **Controller:** Entgegennahme und Validierung der Anfragen sowie Rückgabe der HTTP-Antworten.
- **Services:** Umsetzung der Anwendungslogik und Ausführung der Datenbankoperationen.
- **PostgreSQL:** Dauerhafte Speicherung der Bücher, Genres, Benutzerkonten, Warenkörbe und Bestellungen.
- **Docker Compose:** Start und Verwaltung der drei Anwendungsdienste.

---

### Backend-Struktur

Das Backend verwendet eine Trennung zwischen Routes, Controllern und Services:

- **Routes:** Definieren die API-Endpunkte und ordnen sie den jeweiligen Controllern zu.
- **Controllers:** Verarbeiten HTTP-Anfragen, prüfen Parameter und erzeugen passende Antworten.
- **Services:** Enthalten die Geschäftslogik und führen SQL-Abfragen über `pg` aus.
- **Middleware:** Überprüft die JWT-Authentifizierung geschützter Endpunkte.
- **Config:** Stellt die PostgreSQL-Verbindung bereit.
- **Scripts:** Enthalten den Importprozess für den Buchkatalog.

### Frontend-Struktur

Das Frontend verwendet den Next.js App Router:

- **app:** Enthält die Seiten und Routen der Anwendung.
- **components:** Enthält wiederverwendbare React-Komponenten.
- **context:** Verwaltet den globalen Authentifizierungs- und Warenkorbzustand.
- **lib/api.js:** Zentralisiert die Kommunikation mit dem Backend über Axios.

---

## ⚙️ Installation & Setup (Docker)

### Voraussetzungen

- Docker Desktop inklusive Docker Compose
- Git (optional zum Klonen des Repositorys)
- Ein lokales Terminal, beispielsweise PowerShell

### 1. Repository klonen

```bash
git clone https://github.com/yvanzambou/DEIN-REPOSITORY.git
cd booki-booki_2.0
```

Ersetze `DEIN-REPOSITORY` durch den tatsächlichen Namen deines GitHub-Repositories.

### 2. Umgebungsvariablen konfigurieren

Erstelle im Projekt-Hauptverzeichnis eine `.env`-Datei anhand der bereitgestellten Beispieldatei.

Unter Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Unter Linux oder macOS:

```bash
cp .env.example .env
```

Passe anschließend die Werte in der `.env`-Datei an:

```env
# PostgreSQL
POSTGRES_DB=booki_booki
POSTGRES_USER=booki_user
POSTGRES_PASSWORD=DEIN_SICHERES_DATENBANKPASSWORT

# JWT
JWT_SECRET=DEIN_LANGER_ZUFAELLIGER_GEHEIMSCHLUESSEL
JWT_EXPIRES_IN=1h

# Frontend API URL
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

**Wichtige Hinweise:**

- `POSTGRES_PASSWORD` muss durch ein eigenes Passwort ersetzt werden.
- `JWT_SECRET` muss mindestens 32 Zeichen lang sein und sollte zufällig generiert werden.
- Die Zugangsdaten in der `.env` müssen mit der Docker-Konfiguration übereinstimmen.
- Die `.env`-Datei darf nicht in GitHub veröffentlicht werden.

Einen zufälligen JWT-Schlüssel kannst du beispielsweise mit Node.js generieren:

```powershell
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

### 3. Docker-Container starten

Führe im Projekt-Hauptverzeichnis folgenden Befehl aus:

```bash
docker compose up --build -d
```

Docker Compose startet drei Services:

| Service | Beschreibung | Port |
|---|---|---|
| `frontend` | Next.js-Anwendung | 3000 |
| `backend` | Express REST API | 5000 |
| `db` | PostgreSQL-Datenbank | 5432 |

Die Datenbank wird vor dem Backend gestartet. Der Health Check stellt sicher, dass PostgreSQL bereit ist, bevor das Backend seine Initialisierung durchführt.

Beim Start des Backends werden die benötigten Tabellen initialisiert und anschließend die Bücher aus `books.json` importiert.

### 4. Anwendung öffnen

Nach erfolgreichem Start sind die folgenden Adressen verfügbar:

| Dienst | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5000 |
| API Health Check | http://localhost:5000/health |
| PostgreSQL | `localhost:5432` |

### 5. Container und Logs überprüfen

Status der Container anzeigen:

```bash
docker compose ps
```

Logs aller Services anzeigen:

```bash
docker compose logs -f
```

Nur die Backend-Logs anzeigen:

```bash
docker compose logs -f backend
```

Nur die Frontend-Logs anzeigen:

```bash
docker compose logs -f frontend
```

Nur die Datenbank-Logs anzeigen:

```bash
docker compose logs -f db
```

---

## 🔌 REST-API

Die REST-API wird vom Express-Backend bereitgestellt.

**Basis-URL:**

```text
http://localhost:5000
```

### 📚 Bücher

| Methode | Endpunkt | Beschreibung |
|---|---|---|
| `GET` | `/api/books` | Alle Bücher mit Pagination abrufen |
| `GET` | `/api/books/:id` | Details eines Buches abrufen |
| `GET` | `/api/books/search` | Bücher nach Titel oder Autor suchen |
| `GET` | `/api/books/genre/:genreId` | Bücher eines bestimmten Genres abrufen |

**Beispiele:**

Alle Bücher abrufen:

```http
GET /api/books?page=1&limit=20
```

Bücher suchen:

```http
GET /api/books/search?q=Harry&page=1&limit=10
```

Bücher eines Genres abrufen:

```http
GET /api/books/genre/2?page=1&limit=10
```

Einzelnes Buch abrufen:

```http
GET /api/books/1
```

**Pagination:**

- Standardwert für `page`: `1`
- Standardwert für `limit`: `20` bei der Buchübersicht
- Standardwert für `limit`: `10` bei der Suche und Genre-Filterung
- Maximal zulässiger `limit`-Wert: `100`

Ungültige Pagination-Parameter werden mit HTTP-Status `400` beantwortet.

### 🏷️ Genres

| Methode | Endpunkt | Beschreibung |
|---|---|---|
| `GET` | `/api/genres` | Alle verfügbaren Genres abrufen |

### 👤 Authentifizierung

| Methode | Endpunkt | Beschreibung |
|---|---|---|
| `POST` | `/api/auth/register` | Benutzerkonto erstellen |
| `POST` | `/api/auth/login` | Benutzer anmelden |
| `GET` | `/api/auth/me` | Informationen des angemeldeten Benutzers abrufen |

Die Registrierung erwartet folgende Daten:

```json
{
  "name": "Max Mustermann",
  "email": "max@example.com",
  "password": "SicheresPasswort123"
}
```

Die Anmeldung erwartet:

```json
{
  "email": "max@example.com",
  "password": "SicheresPasswort123"
}
```

Nach erfolgreicher Registrierung oder Anmeldung liefert die API ein JWT und die öffentlichen Benutzerinformationen zurück.

### 🛒 Warenkorb

Alle Warenkorb-Endpunkte erfordern eine gültige Authentifizierung.

| Methode | Endpunkt | Beschreibung |
|---|---|---|
| `GET` | `/api/cart` | Eigenen Warenkorb abrufen |
| `POST` | `/api/cart/items` | Buch zum Warenkorb hinzufügen |
| `PATCH` | `/api/cart/items/:itemId` | Menge eines Artikels ändern |
| `DELETE` | `/api/cart/items/:itemId` | Artikel aus dem Warenkorb entfernen |

Ein Buch hinzufügen:

```http
POST /api/cart/items
```

Request-Body:

```json
{
  "bookId": 1,
  "quantity": 1
}
```

Menge ändern:

```http
PATCH /api/cart/items/1
```

Request-Body:

```json
{
  "quantity": 2
}
```

Die Menge eines Artikels muss zwischen 1 und 99 liegen.

### 🏠 Lieferadresse und Zahlungsprofil

| Methode | Endpunkt | Beschreibung |
|---|---|---|
| `GET` | `/api/payment-profile` | Gespeichertes Liefer- und Zahlungsprofil abrufen |
| `PUT` | `/api/payment-profile` | Lieferadresse und Zahlungsmethode speichern |

Beispiel:

```json
{
  "recipient": "Max Mustermann",
  "street": "Musterstraße 10",
  "postalCode": "12345",
  "city": "Musterstadt",
  "country": "Deutschland",
  "paymentMethod": "invoice"
}
```

Unterstützte Werte für `paymentMethod`:

- `invoice`
- `paypal`
- `card`

### 📦 Checkout

| Methode | Endpunkt | Beschreibung |
|---|---|---|
| `POST` | `/api/checkout` | Bestellung aus dem Warenkorb erstellen |

Der Checkout-Prozess:

1. Überprüft das gespeicherte Lieferprofil.
2. Prüft, ob der Warenkorb Artikel enthält.
3. Überprüft die hinterlegten Buchpreise.
4. Berechnet den Gesamtbetrag.
5. Erstellt eine Bestellung in der Datenbank.
6. Speichert die einzelnen Bestellpositionen.
7. Leert den Warenkorb.
8. Speichert die Bestellung innerhalb einer Datenbanktransaktion.

**Wichtig:** Die Zahlungsmethoden dienen aktuell nur zur Demonstration. Es ist kein echter Zahlungsdienstleister integriert. Es werden keine tatsächlichen Zahlungen ausgelöst oder Geldbeträge eingezogen.

### 🔐 Authentifizierung geschützter Endpunkte

Geschützte Endpunkte erwarten das JWT im HTTP-Header:

```http
Authorization: Bearer <token>
```

Das Frontend übernimmt die Übermittlung des Tokens automatisch über einen Axios-Request-Interceptor.

---

## 🗄️ Datenbank

Booki-Booki 2.0 verwendet PostgreSQL 17 als relationale Datenbank.

Der Datenbankzugriff erfolgt direkt über das Node.js-Paket `pg` (node-postgres). Es wird kein ORM und insbesondere kein Prisma verwendet.

Das SQL-Schema befindet sich in:

```text
database/schema.sql
```

Die zusätzlichen Tabellen für Benutzerkonten, Warenkörbe und Bestellungen werden außerdem beim Start des Backends über `backend/src/db/init.js` abgesichert initialisiert.

### Datenbanktabellen

| Tabelle | Beschreibung |
|---|---|
| `books` | Buchinformationen |
| `genres` | Verfügbare Genres |
| `book_genres` | Verknüpfung zwischen Büchern und Genres |
| `users` | Benutzerkonten |
| `carts` | Persönliche Warenkörbe |
| `cart_items` | Artikel und Mengen im Warenkorb |
| `payment_profiles` | Lieferadressen und Zahlungsmethoden |
| `orders` | Bestellungen und Bestellinformationen |
| `order_items` | Einzelne Positionen einer Bestellung |

### Wichtige Datenbankbeziehungen

- Ein Buch kann mehreren Genres zugeordnet sein.
- Ein Genre kann mehreren Büchern zugeordnet sein.
- Die Beziehung zwischen Büchern und Genres wird über `book_genres` realisiert.
- Jeder Benutzer besitzt einen eigenen Warenkorb.
- Ein Warenkorb kann mehrere Artikel enthalten.
- Jeder Benutzer besitzt ein gespeichertes Zahlungs- und Lieferprofil.
- Ein Benutzer kann mehrere Bestellungen aufgeben.
- Jede Bestellung kann mehrere Bestellpositionen enthalten.

### Datenbankzugriff über das Terminal

Um eine PostgreSQL-Shell im laufenden Docker-Container zu öffnen:

```bash
docker compose exec db psql -U booki_user -d booki_booki
```

Nützliche PostgreSQL-Befehle:

```sql
-- Alle Tabellen anzeigen
\dt

-- Tabellenstruktur anzeigen
\d books

-- Alle Bücher anzeigen
SELECT id, source_id, title, author, price
FROM books;

-- Bücher zählen
SELECT COUNT(*) FROM books;

-- Alle Genres anzeigen
SELECT * FROM genres;

-- Benutzer anzeigen
SELECT id, name, email
FROM users;

-- Warenkorbartikel anzeigen
SELECT * FROM cart_items;

-- Bestellungen anzeigen
SELECT * FROM orders;

-- Datenbank verlassen
\q
```

### Persistente Datenspeicherung

Docker Compose verwendet das Volume:

```text
postgres_sql_data
```

Dadurch bleiben die Daten auch nach dem Stoppen der Container erhalten.

Das Löschen oder Neuerstellen der Container löscht nicht automatisch die Datenbankinhalte.

---

## 📥 Datenimport

Der Buchkatalog wird aus der JSON-Datei `books.json` importiert.

Die Importlogik befindet sich in:

```text
backend/src/scripts/import-books.js
```

Das Skript übernimmt folgende Aufgaben:

1. Einlesen der `books.json`.
2. Überprüfung des JSON-Formats.
3. Verarbeitung der Buchinformationen.
4. Übernahme der ursprünglichen Buch-ID als `source_id`.
5. Speicherung der Buchdaten in PostgreSQL.
6. Erstellung fehlender Genre-Einträge.
7. Verknüpfung der Bücher mit ihren Genres.
8. Vermeidung doppelter Einträge bei wiederholtem Import.

---

## 🔐 Sicherheit

Bei der Entwicklung wurden verschiedene grundlegende Sicherheitsmaßnahmen berücksichtigt:

- **Passwort-Hashing:** Passwörter werden mit bcryptjs und einem Salt-Faktor von 12 gehasht.
- **JWT:** Authentifizierung über signierte JSON Web Tokens.
- **Geschützte Endpunkte:** Warenkorb, Zahlungsprofil und Checkout sind nur für authentifizierte Benutzer erreichbar.
- **SQL-Injection-Schutz:** Parametrisierte SQL-Abfragen über `pg`.
- **Eingabevalidierung:** Überprüfung wichtiger Eingaben wie E-Mail-Adresse, Passwort, Buch-ID und Artikelmenge.
- **Eindeutige E-Mail-Adressen:** Die Datenbank verhindert doppelte Benutzerkonten mit derselben E-Mail-Adresse.
- **Umgebungsvariablen:** Datenbankzugangsdaten und JWT-Schlüssel werden außerhalb des Quellcodes konfiguriert.

Das Authentifizierungstoken wird aktuell im Browser-Local-Storage gespeichert und bei API-Anfragen als Bearer-Token übertragen. Für einen produktiven Einsatz sollte eine weitergehende Absicherung, beispielsweise mit HttpOnly-Cookies und zusätzlichen Schutzmaßnahmen, geprüft werden.

---

## 🛑 Anwendung stoppen

Um alle Container zu stoppen:

```bash
docker compose down
```

Das persistente Datenbank-Volume bleibt dabei erhalten.

Um die Anwendung erneut zu starten:

```bash
docker compose up -d
```

Um die Images neu zu bauen und die Anwendung zu starten:

```bash
docker compose up -d --build
```

<mark>⚠️ Achtung:</mark> Der folgende Befehl entfernt zusätzlich das Datenbank-Volume und damit alle darin gespeicherten Daten:

```bash
docker compose down -v
```

Verwende ihn nur, wenn du die Datenbank bewusst zurücksetzen möchtest.

---

## 💡 Mögliche Erweiterungen

- 📦 Anzeige der Bestellhistorie und einzelner Bestelldetails
- 🔎 Erweiterte Such- und Filtermöglichkeiten
- ↕️ Sortierung nach Preis, Titel und Bewertung
- ⭐ Merkliste für Lieblingsbücher
- 🧪 Automatisierte Unit- und Integrationstests
- 💳 Integration eines echten Zahlungsdienstleisters
- 📧 E-Mail-Bestätigung nach einer Bestellung
- 📊 Administrationsbereich zur Verwaltung von Büchern und Bestellungen
- 📤 Import und Export des Buchkatalogs
- ☁️ Deployment der Anwendung auf einem Cloud-Server

---

## 📄 Hinweis

**Booki-Booki 2.0** ist ein Portfolio-Projekt zur praktischen Anwendung von Konzepten der modernen Full-Stack-Webentwicklung.

Das Projekt verbindet ein Next.js-Frontend mit einem Node.js-/Express-Backend und einer PostgreSQL-Datenbank. Es demonstriert unter anderem die Entwicklung einer REST-API, relationale Datenbankmodellierung, parametrisierte SQL-Abfragen, JWT-basierte Authentifizierung, CRUD-Operationen, Datenimport, Warenkorbverwaltung und einen Checkout-Prozess.

Die Anwendung wurde außerdem mit Docker und Docker Compose containerisiert, um die Entwicklungsumgebung und den Start der einzelnen Dienste zu vereinfachen.

---

## 👤 Autor

**Yvan Zambou**

[![GitHub](https://img.shields.io/badge/GitHub-Projekte-black?logo=github)](https://github.com/yvanzambou)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Profil-blue?logo=linkedin)](https://linkedin.com/in/yvan-zambou-29aba9261)