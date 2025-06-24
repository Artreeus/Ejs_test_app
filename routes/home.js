const router = require("express").Router();

// Home route - redirect to test dashboard
router.get("/", (req, res) => {
  res.redirect('/test');
});

module.exports = router;