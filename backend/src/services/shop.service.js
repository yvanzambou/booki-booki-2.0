const pool = require("../config/db");

async function getCart(userId, client = pool) {
  const result = await client.query(`
    SELECT ci.id, ci.book_id AS "bookId", ci.quantity,
           b.title, b.author, b.cover_img AS "coverImg", b.price
    FROM carts c
    JOIN cart_items ci ON ci.cart_id = c.id
    JOIN books b ON b.id = ci.book_id
    WHERE c.user_id = $1
    ORDER BY ci.id
  `, [userId]);
  const items = result.rows.map((item) => ({ ...item, price: item.price === null ? null : Number(item.price) }));
  const total = items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
  return { items, itemCount: items.reduce((sum, item) => sum + item.quantity, 0), total: Number(total.toFixed(2)) };
}

async function addToCart(userId, bookId, quantity = 1) {
  if (!Number.isInteger(Number(bookId)) || Number(bookId) < 1) throw Object.assign(new Error("Ungültige Buch-ID."), { status: 400 });
  const amount = Number(quantity);
  if (!Number.isInteger(amount) || amount < 1 || amount > 99) throw Object.assign(new Error("Die Menge muss zwischen 1 und 99 liegen."), { status: 400 });
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const book = await client.query("SELECT id FROM books WHERE id = $1", [bookId]);
    if (!book.rowCount) throw Object.assign(new Error("Dieses Buch wurde nicht gefunden."), { status: 404 });
    const cart = await client.query("INSERT INTO carts (user_id) VALUES ($1) ON CONFLICT (user_id) DO UPDATE SET updated_at = NOW() RETURNING id", [userId]);
    await client.query(`
      INSERT INTO cart_items (cart_id, book_id, quantity) VALUES ($1, $2, $3)
      ON CONFLICT (cart_id, book_id) DO UPDATE SET quantity = LEAST(cart_items.quantity + EXCLUDED.quantity, 99)
    `, [cart.rows[0].id, bookId, amount]);
    await client.query("COMMIT");
  } catch (error) { await client.query("ROLLBACK"); throw error; }
  finally { client.release(); }
  return getCart(userId);
}

async function updateCartItem(userId, itemId, quantity) {
  if (!Number.isInteger(Number(itemId)) || Number(itemId) < 1) throw Object.assign(new Error("Ungültige Warenkorb-ID."), { status: 400 });
  const amount = Number(quantity);
  if (!Number.isInteger(amount) || amount < 1 || amount > 99) throw Object.assign(new Error("Die Menge muss zwischen 1 und 99 liegen."), { status: 400 });
  const result = await pool.query(`
    UPDATE cart_items ci SET quantity = $1
    FROM carts c WHERE ci.cart_id = c.id AND c.user_id = $2 AND ci.id = $3
    RETURNING ci.id
  `, [amount, userId, itemId]);
  if (!result.rowCount) throw Object.assign(new Error("Warenkorbposition nicht gefunden."), { status: 404 });
  return getCart(userId);
}

async function removeCartItem(userId, itemId) {
  if (!Number.isInteger(Number(itemId)) || Number(itemId) < 1) throw Object.assign(new Error("Ungültige Warenkorb-ID."), { status: 400 });
  const result = await pool.query(`
    DELETE FROM cart_items ci USING carts c
    WHERE ci.cart_id = c.id AND c.user_id = $1 AND ci.id = $2
  `, [userId, itemId]);
  if (!result.rowCount) throw Object.assign(new Error("Warenkorbposition nicht gefunden."), { status: 404 });
  return getCart(userId);
}

async function getPaymentProfile(userId) {
  const result = await pool.query(`SELECT recipient, street, postal_code AS "postalCode", city, country, payment_method AS "paymentMethod" FROM payment_profiles WHERE user_id = $1`, [userId]);
  return result.rows[0] || {};
}

async function savePaymentProfile(userId, input) {
  const data = {
    recipient: String(input.recipient || "").trim(), street: String(input.street || "").trim(),
    postalCode: String(input.postalCode || "").trim(), city: String(input.city || "").trim(),
    country: String(input.country || "Deutschland").trim(), paymentMethod: String(input.paymentMethod || "invoice").trim(),
  };
  if (!data.recipient || !data.street || !data.postalCode || !data.city || !data.country) throw Object.assign(new Error("Bitte fülle alle Lieferadressfelder aus."), { status: 400 });
  if (!["invoice", "paypal", "card"].includes(data.paymentMethod)) throw Object.assign(new Error("Ungültige Zahlungsart."), { status: 400 });
  const result = await pool.query(`
    INSERT INTO payment_profiles (user_id, recipient, street, postal_code, city, country, payment_method)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    ON CONFLICT (user_id) DO UPDATE SET recipient = EXCLUDED.recipient, street = EXCLUDED.street,
      postal_code = EXCLUDED.postal_code, city = EXCLUDED.city, country = EXCLUDED.country,
      payment_method = EXCLUDED.payment_method, updated_at = NOW()
    RETURNING recipient, street, postal_code AS "postalCode", city, country, payment_method AS "paymentMethod"
  `, [userId, data.recipient, data.street, data.postalCode, data.city, data.country, data.paymentMethod]);
  return result.rows[0];
}

async function checkout(userId, input) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const profileResult = await client.query(`SELECT recipient, street, postal_code, city, country, payment_method FROM payment_profiles WHERE user_id = $1 FOR UPDATE`, [userId]);
    const profile = profileResult.rows[0];
    if (!profile || !profile.recipient || !profile.street || !profile.postal_code || !profile.city || !profile.country) {
      throw Object.assign(new Error("Bitte vervollständige zuerst deine Lieferadresse."), { status: 400 });
    }
    const cart = await client.query(`
      SELECT ci.book_id, ci.quantity, b.title, b.author, b.price
      FROM carts c JOIN cart_items ci ON ci.cart_id = c.id JOIN books b ON b.id = ci.book_id
      WHERE c.user_id = $1 FOR UPDATE OF ci
    `, [userId]);
    if (!cart.rowCount) throw Object.assign(new Error("Dein Warenkorb ist leer."), { status: 400 });
    if (cart.rows.some((item) => item.price === null || Number(item.price) < 0)) throw Object.assign(new Error("Für mindestens ein Buch ist kein gültiger Preis hinterlegt."), { status: 400 });
    const total = cart.rows.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
    const orderResult = await client.query(`
      INSERT INTO orders (user_id, total, recipient, street, postal_code, city, country, payment_method, payment_status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'demo_pending') RETURNING id, total, status, payment_status AS "paymentStatus", created_at AS "createdAt"
    `, [userId, total.toFixed(2), profile.recipient, profile.street, profile.postal_code, profile.city, profile.country, profile.payment_method]);
    const order = orderResult.rows[0];
    for (const item of cart.rows) {
      await client.query(`INSERT INTO order_items (order_id, book_id, title, author, unit_price, quantity) VALUES ($1, $2, $3, $4, $5, $6)`, [order.id, item.book_id, item.title, item.author, item.price, item.quantity]);
    }
    await client.query("DELETE FROM cart_items WHERE cart_id = (SELECT id FROM carts WHERE user_id = $1)", [userId]);
    await client.query("COMMIT");
    return { ...order, total: Number(order.total), itemCount: cart.rows.reduce((sum, item) => sum + item.quantity, 0), message: "Bestellung wurde als Demo gespeichert. Es wurde keine Zahlung ausgelöst." };
  } catch (error) { await client.query("ROLLBACK"); throw error; }
  finally { client.release(); }
}

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  getPaymentProfile,
  savePaymentProfile,
  checkout
};