const router = require("express").Router();
const requireAuth = require("../middleware/auth.middleware");
const controller = require("../controllers/shop.controller");

router.use(requireAuth);
router.get("/cart", controller.getCart);
router.post("/cart/items", controller.addToCart);
router.patch("/cart/items/:itemId", controller.updateCartItem);
router.delete("/cart/items/:itemId", controller.removeCartItem);
router.get("/payment-profile", controller.getPaymentProfile);
router.put("/payment-profile", controller.savePaymentProfile);
router.post("/checkout", controller.checkout);

module.exports = router;