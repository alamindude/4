const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const bkashRoutes = require('./routes/bkash');
const nagadRoutes = require('./routes/nagad');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Ensure payments.json exists
const paymentsFile = path.join(dataDir, 'payments.json');
if (!fs.existsSync(paymentsFile)) {
  fs.writeFileSync(paymentsFile, JSON.stringify([], null, 2));
}

// Routes
app.use('/api/bkash', bkashRoutes);
app.use('/api/nagad', nagadRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Payment record endpoint
app.post('/api/payment/record', (req, res) => {
  try {
    const { name, amount, invoice, provider, status } = req.body;
    
    const paymentRecord = {
      name,
      amount,
      invoice,
      provider,
      status,
      timeISO: new Date().toISOString()
    };

    // Read existing payments
    const payments = JSON.parse(fs.readFileSync(paymentsFile, 'utf8'));
    payments.push(paymentRecord);
    
    // Write back to file
    fs.writeFileSync(paymentsFile, JSON.stringify(payments, null, 2));
    
    res.json({ ok: true, message: 'Payment recorded successfully' });
  } catch (error) {
    console.error('Error recording payment:', error);
    res.status(500).json({ ok: false, error: 'Failed to record payment' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Neon Pay server running on port ${PORT}`);
  console.log(`💳 bKash API: ${process.env.BKASH_USERNAME ? 'Configured' : 'Not configured'}`);
});