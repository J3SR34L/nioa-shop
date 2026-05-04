const router = require('express').Router();
const Order = require('../models/Order');
const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Unauthorized' });
  try {
    req.user = jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

router.post('/', authMiddleware, async (req, res) => {
  const order = await Order.create({ ...req.body, user: req.user.id });
  res.status(201).json(order);
});

router.get('/:id', authMiddleware, async (req, res) => {
  const order = await Order.findById(req.params.id);
  res.json(order);
});

module.exports = router;