import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { amount, receipt } = await req.json();

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    console.log("Key ID:", keyId);
    console.log("Key Secret:", keySecret ? "exists" : "MISSING");

    const credentials = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${credentials}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amount * 100,
        currency: "INR",
        receipt: receipt.substring(0, 40),
      }),
    });

    const order = await response.json();
    console.log("Razorpay response:", JSON.stringify(order));

    if (!response.ok) {
      return NextResponse.json({ error: order.error?.description || "Failed" }, { status: 500 });
    }

    return NextResponse.json({ orderId: order.id });
  } catch (error) {
    console.error("Order error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}