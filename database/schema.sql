CREATE TABLE IF NOT EXISTS books (
    id SERIAL PRIMARY KEY,
    source_id TEXT UNIQUE,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    rating DOUBLE PRECISION,
    description TEXT,
    language TEXT,
    isbn TEXT,
    book_format TEXT,
    edition TEXT,
    pages INTEGER,
    publisher TEXT,
    publish_date TEXT,
    first_publish_date TEXT,
    num_ratings INTEGER,
    cover_img TEXT,
    price NUMERIC(10, 2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS genres (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS book_genres (
    book_id INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    genre_id INTEGER NOT NULL REFERENCES genres(id) ON DELETE CASCADE,
    PRIMARY KEY (book_id, genre_id)
);

CREATE INDEX IF NOT EXISTS idx_books_title ON books (LOWER(title));
CREATE INDEX IF NOT EXISTS idx_books_author ON books (LOWER(author));
CREATE INDEX IF NOT EXISTS idx_book_genres_genre_id ON book_genres (genre_id);

-- Customer accounts and persistent shopping carts
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS carts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cart_items (
    id SERIAL PRIMARY KEY,
    cart_id INTEGER NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    book_id INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity BETWEEN 1 AND 99),
    UNIQUE (cart_id, book_id)
);

CREATE TABLE IF NOT EXISTS payment_profiles (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    recipient VARCHAR(120),
    street VARCHAR(180),
    postal_code VARCHAR(20),
    city VARCHAR(120),
    country VARCHAR(100) DEFAULT 'Deutschland',
    payment_method VARCHAR(30) DEFAULT 'invoice',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
    id BIGSERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    status VARCHAR(30) NOT NULL DEFAULT 'placed',
    total NUMERIC(10,2) NOT NULL CHECK (total >= 0),
    recipient VARCHAR(120) NOT NULL,
    street VARCHAR(180) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    city VARCHAR(120) NOT NULL,
    country VARCHAR(100) NOT NULL,
    payment_method VARCHAR(30) NOT NULL,
    payment_status VARCHAR(30) NOT NULL DEFAULT 'demo_pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    book_id INTEGER REFERENCES books(id) ON DELETE SET NULL,
    title VARCHAR(500) NOT NULL,
    author VARCHAR(300) NOT NULL,
    unit_price NUMERIC(10,2) NOT NULL CHECK (unit_price >= 0),
    quantity INTEGER NOT NULL CHECK (quantity BETWEEN 1 AND 99)
);

CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id, created_at DESC);