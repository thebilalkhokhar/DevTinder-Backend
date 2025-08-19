const express = require("express");
const { userAuthMiddleware } = require("../middlewares/auth");
const paymentRouter = express.Router();
const instance = require("../utils/razorpay");
const Payment = require("../models/Payment");
const payment = require("../utils/constants");
const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");
const User = require("../models/User");
const { ca } = require("date-fns/locale");

paymentRouter.post("/payment/create", userAuthMiddleware, async (req, res) => {
  try {
    const { membershipType } = req.body;
    const { firstName, lastName, email } = req.user;

    const order = await instance.orders.create({
      amount: payment[membershipType],
      currency: "INR",
      receipt: "receipt#1",
      notes: {
        firstName,
        lastName,
        email,
        membershipType: membershipType,
      },
    });

    // Save it in my DB
    const newPayment = new Payment({
      userId: req.user._id,
      orderId: order.id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      notes: order.notes,
    });

    const savedPayment = await newPayment.save();

    // Return back order details to frontend
    return res.json({
      ...savedPayment.toJSON(),
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

paymentRouter.post("/payment/webhook", async (req, res) => {
  try {
    const webhookSignature = req.get("X-Razorpay-Signature");
    const isWebhookValid = validateWebhookSignature(
      req.body,
      webhookSignature,
      process.env.RAZORPAY_WEBHOOK_SECRET
    );
    if (!isWebhookValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid webhook signature",
      });
    }
    // Update payment in DB
    const paymentDetails = req.body.payload.payment.entity;
    const payment = await Payment.findOne({ orderId: paymentDetails.order_id });
    if (payment) {
      payment.status = paymentDetails.status;
      await payment.save();
    }
    // Update user in DB
    const user = await User.findById(payment.userId);
    if (user) {
      user.isPremium = true;
      user.membershipType = payment.notes.membershipType;
      await user.save();
    }
    return res.status(200).json({ msg: "Webhook received successfully" });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

paymentRouter.get("/premium/verify", userAuthMiddleware, async (req, res) => {
  const user = req.user.toJSON();

  if (user.isPremium) {
    return res.json({
      ...user,
    });
  }
  return res.json({
    ...user,
    isPremium: false,
  });
});

module.exports = paymentRouter;
