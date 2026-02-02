import { NextRequest, NextResponse } from "next/server";
import { createServer } from "../../supabaseServer";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const { orderId, paymentMethodId, amount } = await req.json();

  if (!orderId || !paymentMethodId || !amount) {
    return NextResponse.json(
      { error: "Missing orderId, paymentMethodId or amount" },
      { status: 400 }
    );
  }

  const pm = await stripe.paymentMethods.retrieve(paymentMethodId);
  if (pm.type !== "card" || !pm.card) {
    return NextResponse.json({ error: "Invalid payment method" }, { status: 400 });
  }

  const { brand, last4, exp_month, exp_year } = pm.card;

  // 1️⃣ Create a customer if you don't have one
  const customer = await stripe.customers.create({
    metadata: { orderId },
  });

  // 2️⃣ Attach payment method to customer
  await stripe.paymentMethods.attach(paymentMethodId, { customer: customer.id });

  // 3️⃣ Create PaymentIntent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency: "egp",
    customer: customer.id,
    payment_method: paymentMethodId,
    off_session: true,
    confirm: true,
  });

  // 4️⃣ Save draft in Supabase
  const supabase = await createServer();
  const { data, error } = await supabase.rpc("create_order_payment_draft", {
    p_order_id: orderId,
    p_payment_method: "stripe",
    p_payment_intent_id: paymentIntent.id,
    p_amount: amount,
    p_currency: "egp",
    p_card_brand: brand,
    p_card_last4: last4,
    p_card_exp_month: exp_month,
    p_card_exp_year: exp_year,
  });

  if (error) throw error;
  return NextResponse.json({ data });
}
