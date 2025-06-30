function requireCliente(req, res, next) {
  if (!req.session.cliente) return res.redirect('/loginClient');
  next();
}

function requireAdmin(req, res, next) {
  if (!req.session.admin) return res.redirect('/loginAdmin');
  next();
}

module.exports = { requireCliente, requireAdmin };
