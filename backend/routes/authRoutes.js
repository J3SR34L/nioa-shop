const router = require('express').Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  const origin = req.headers.origin || 'https://nioa-shop.vercel.app';
res.redirect(`https://nioa-shop.vercel.app/index.html?token=${token}`);
  }
);

router.get('/me', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET);
    res.json({ userId: decoded.id });
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;