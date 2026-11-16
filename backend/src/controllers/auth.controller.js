const authService = require("../services/auth.service");

async function register(req, res, next) {
  try { res.status(201).json({ success: true, data: await authService.register(req.body) }); }
  catch (error) { if (error.status) return res.status(error.status).json({ success: false, message: error.message }); next(error); }
}

async function login(req, res, next) {
  try { res.json({ success: true, data: await authService.login(req.body) }); }
  catch (error) { if (error.status) return res.status(error.status).json({ success: false, message: error.message }); next(error); }
}

async function me(req, res, next) {
  try {
    const user = await authService.getUserById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "Benutzer nicht gefunden." });
    res.json({ success: true, data: user });
  } catch (error) { next(error); }
}

module.exports = { register, login, me };