import Stripe from 'stripe';
import prisma from '../config/db.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.error(`Webhook signature verification failed:
  ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    await prisma.order.update({
      where: {
        stripeSessionId: session.id,
      },
      data: {
        status: 'COMPLETED',
      },
    });
    console.log(`Payment completed: ${session.id}`);
  }
  res.json({ received: true });
};
