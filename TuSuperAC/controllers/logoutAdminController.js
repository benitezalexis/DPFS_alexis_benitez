let logoutController = {
  index: function (req, res) {
    req.session.destroy(() => {
      res.redirect('/loginAdmin');
    });
  }
};

module.exports = logoutController;
