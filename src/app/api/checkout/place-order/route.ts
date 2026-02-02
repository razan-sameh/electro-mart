// File: /app/api/orders/place-order/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createServer } from "../../supabaseServer";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    const supabase = await createServer();

    // 1️⃣ Get the draft payment
    const { data: paymentData, error: paymentError } = await supabase
      .from("order_payments")
      .select("*")
      .eq("order_id", orderId)
      .eq("status", "requires_payment_method")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (paymentError || !paymentData) {
      return NextResponse.json(
        { error: "No draft payment found for this order" },
        { status: 404 }
      );
    }

    const paymentIntentId = paymentData.payment_intent_id;

    // 2️⃣ Confirm the Stripe payment
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      // Optionally confirm or attempt payment here
      await stripe.paymentIntents.confirm(paymentIntentId);
    }

    // 3️⃣ Call RPC to mark order placed and payment succeeded
    const { data: orderResult, error: rpcError } = await supabase.rpc(
      "place_order_and_pay",
      { p_order_id: orderId }
    );

    if (rpcError) {
      console.error("RPC ERROR:", rpcError);
      return NextResponse.json(
        { error: rpcError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, order: orderResult });
  } catch (err: any) {
    console.error("Place order error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to place order" },
      { status: 500 }
    );
  }
}
