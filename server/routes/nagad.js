const express = require('express');
const router = express.Router();

// Nagad API placeholder routes
// These will be implemented when Nagad API becomes available

router.post('/token', (req, res) => {
  res.json({
    ok: false,
    error: 'Nagad API integration coming soon!',
    message: 'This endpoint is reserved for future Nagad API implementation'
  });
});

router.post('/create', (req, res) => {
  res.json({
    ok: false,
    error: 'Nagad API integration coming soon!',
    message: 'This endpoint is reserved for future Nagad API implementation'
  });
});

router.post('/execute', (req, res) => {
  res.json({
    ok: false,
    error: 'Nagad API integration coming soon!',
    message: 'This endpoint is reserved for future Nagad API implementation'
  });
});

module.exports = router;