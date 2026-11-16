const shop = require("../services/shop.service");

const handle = (fn) => async (req, res, next) => {
  try { const data = await fn(req); res.json({ success: true, data }); }
  catch (error) { if (error.status) return res.status(error.status).json({ success: false, message: error.message }); next(error); }
};

module.exports = {
  getCart: handle((req) => shop.getCart(req.user.id)),
  addToCart: handle((req) => shop.addToCart(req.user.id, Number(req.body.bookId), req.body.quantity ?? 1)),
  updateCartItem: handle((req) => shop.updateCartItem(req.user.id, Number(req.params.itemId), req.body.quantity)),
  removeCartItem: handle((req) => shop.removeCartItem(req.user.id, Number(req.params.itemId))),
  getPaymentProfile: handle((req) => shop.getPaymentProfile(req.user.id)),
  savePaymentProfile: handle((req) => shop.savePaymentProfile(req.user.id, req.body)),
  checkout: handle((req) => shop.checkout(req.user.id)),
};