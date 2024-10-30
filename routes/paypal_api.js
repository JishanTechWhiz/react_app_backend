// paypal-payment.js

const express = require('express');
const paypal = require('@paypal/checkout-server-sdk');
const router = express.Router();

// PayPal client configuration
function paypalClient() {

  const clientId = "Ab38jh-XrackK_T_QL5yJ0eLcoRNqR8FPwfVmy8EMvvLCI13ayC0La-8VD0XbBLtYjS-FBi4Mx6_4Dse"; // Replace with your sandbox client ID
  const clientSecret = "EC7xC2FgDr79ZaN9PSp5B0BSQkoNPWXD601sc1FYgtPLXBB6y0PSlGoPypjJmBxw74vsFZ6_ACa_zplP"; // Replace with your sandbox secret

  const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
  return new paypal.core.PayPalHttpClient(environment);
}

// Endpoint to create an order
router.post('/create-order', async (req, res) => {
  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer("return=representation");
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [{ amount: { currency_code: "USD", value: "10.00" } }]
  });

  try {
    const order = await paypalClient().execute(request);
    res.json({ id: order.result.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint to capture an order
router.post('/capture-order', async (req, res) => {
  const { orderID } = req.body;
  const request = new paypal.orders.OrdersCaptureRequest(orderID);

  try {
    const capture = await paypalClient().execute(request);
    res.json({ status: 'COMPLETED', details: capture.result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;


