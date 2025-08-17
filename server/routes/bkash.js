const express = require('express');
const axios = require('axios');
const router = express.Router();

// bKash sandbox configuration
const BKASH_BASE_URL = 'https://tokenized.sandbox.bka.sh/v1.2.0-beta';
const BKASH_GRANT_TOKEN_URL = 'https://tokenized.sandbox.bka.sh/v1.2.0-beta/tokenized/checkout/token/grant';

// In-memory token storage (in production, use Redis or database)
let tokenStorage = {
  access_token: null,
  expires_at: null
};

// Helper function to check if token is valid
const isTokenValid = () => {
  return tokenStorage.access_token && 
         tokenStorage.expires_at && 
         new Date() < new Date(tokenStorage.expires_at);
};

// Get or refresh token
router.post('/token', async (req, res) => {
  try {
    // Check if we have a valid token
    if (isTokenValid()) {
      return res.json({ 
        ok: true, 
        message: 'Token already valid',
        expires_at: tokenStorage.expires_at 
      });
    }

    // Request new token
    const response = await axios.post(BKASH_GRANT_TOKEN_URL, {
      app_key: process.env.BKASH_APP_KEY,
      app_secret: process.env.BKASH_APP_SECRET
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'username': process.env.BKASH_USERNAME,
        'password': process.env.BKASH_PASSWORD
      }
    });

    if (response.data && response.data.id_token) {
      // Store token with 1 hour expiry
      tokenStorage = {
        access_token: response.data.id_token,
        expires_at: new Date(Date.now() + 3600000).toISOString() // 1 hour from now
      };

      res.json({ 
        ok: true, 
        message: 'Token obtained successfully',
        expires_at: tokenStorage.expires_at 
      });
    } else {
      throw new Error('Invalid token response from bKash');
    }
  } catch (error) {
    console.error('bKash token error:', error.response?.data || error.message);
    res.status(500).json({ 
      ok: false, 
      error: 'Failed to get bKash token',
      details: error.response?.data || error.message 
    });
  }
});

// Create payment
router.post('/create', async (req, res) => {
  try {
    const { amount, payerReference, merchantInvoiceNumber } = req.body;

    // Ensure we have a valid token
    if (!isTokenValid()) {
      return res.status(401).json({ 
        ok: false, 
        error: 'Invalid or expired token. Please get a new token first.' 
      });
    }

    const createPaymentData = {
      mode: '0011',
      payerReference: payerReference || 'test-payer',
      callbackURL: 'https://yoursite.com/callback',
      amount: amount.toString(),
      currency: 'BDT',
      intent: 'sale',
      merchantInvoiceNumber: merchantInvoiceNumber
    };

    const response = await axios.post(`${BKASH_BASE_URL}/tokenized/checkout/create`, createPaymentData, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'authorization': tokenStorage.access_token,
        'x-app-key': process.env.BKASH_APP_KEY
      }
    });

    if (response.data && response.data.paymentID) {
      res.json({
        ok: true,
        paymentID: response.data.paymentID,
        gatewayUrl: response.data.bkashURL,
        message: 'Payment created successfully'
      });
    } else {
      throw new Error('Invalid create response from bKash');
    }
  } catch (error) {
    console.error('bKash create error:', error.response?.data || error.message);
    res.status(500).json({ 
      ok: false, 
      error: 'Failed to create bKash payment',
      details: error.response?.data || error.message 
    });
  }
});

// Execute payment
router.post('/execute', async (req, res) => {
  try {
    const { paymentID } = req.body;

    if (!paymentID) {
      return res.status(400).json({ 
        ok: false, 
        error: 'Payment ID is required' 
      });
    }

    // Ensure we have a valid token
    if (!isTokenValid()) {
      return res.status(401).json({ 
        ok: false, 
        error: 'Invalid or expired token. Please get a new token first.' 
      });
    }

    const response = await axios.post(`${BKASH_BASE_URL}/tokenized/checkout/execute`, {
      paymentID: paymentID
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'authorization': tokenStorage.access_token,
        'x-app-key': process.env.BKASH_APP_KEY
      }
    });

    if (response.data && response.data.transactionStatus === 'Completed') {
      res.json({
        ok: true,
        status: 'completed',
        trxID: response.data.trxID,
        paymentID: response.data.paymentID,
        amount: response.data.amount,
        message: 'Payment executed successfully'
      });
    } else {
      res.json({
        ok: false,
        status: 'failed',
        error: 'Payment execution failed',
        details: response.data
      });
    }
  } catch (error) {
    console.error('bKash execute error:', error.response?.data || error.message);
    res.status(500).json({ 
      ok: false, 
      error: 'Failed to execute bKash payment',
      details: error.response?.data || error.message 
    });
  }
});

module.exports = router;