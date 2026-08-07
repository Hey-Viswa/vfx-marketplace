import prisma from '../config/db.js';
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
export const paymentController = async (req, res) => {
  try {
    const { assetId } = req.body;
    const { userId } = req.user;

    const asset = await prisma.asset.findUnique({
      where: {
        id: parseInt(assetId),
      },
    });
    if (!asset || asset.isActive === false) {
      return res.status(404).json({
        error: 'Asset not found or is no longer available for purchase',
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: asset.title },
            unit_amount: Math.round(asset.price * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'http://localhost:5173/success',
      cancel_url: 'http://localhost:5173/cancel',
    });
    const order = await prisma.order.create({
      data: {
        buyerId: userId,
        assetId: parseInt(assetId),
        amount: asset.price,
        stripeSessionId: session.id,
        status: 'PENDING',
      },
    });

    return res.status(200).json({ url: session.url });
  } catch (e) {
    return res.status(500).send({
      error: 'Something went wrong',
      message: `Payment Failed ${e}`,
    });
  }
};
