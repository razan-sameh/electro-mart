import Stripe from "stripe";
const strip_sk = process.env.STRIPE_SECRET_KEY;
const stripe = new Stripe(strip_sk!);

export async function POST(req: Request) {
  const { orderId, amount } = await req.json();

  const total = Number(amount);
  if (isNaN(total) || total <= 0) {
    return new Response(
      JSON.stringify({ error: "Invalid amount" }),
      { status: 400 }
    );
  }

  const setupIntent = await stripe.setupIntents.create({
    payment_method_types: ["card"],
    metadata: { orderId },
  });

  return new Response(
    JSON.stringify({ clientSecret: setupIntent.client_secret }),
    { status: 200 }
  );
}
