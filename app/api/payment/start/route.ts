import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, returnUrl } = body;

    // Controllo variabili d'ambiente
    if (!process.env.ALFA_USERNAME || !process.env.ALFA_PASSWORD || !process.env.ALFA_GATEWAY) {
      return NextResponse.json({ error: ".env variables does not exist or are incorrect" }, { status: 500 });
    }

    // Parametri richiesti da Alfa-Bank
    const params = new URLSearchParams({
      userName: process.env.ALFA_USERNAME,
      password: process.env.ALFA_PASSWORD,
      orderNumber: "ORDER-" + Date.now(),
      amount: String(amount), // in kopeck
      currency: "643",        // RUB
      returnUrl,
      failUrl: `${returnUrl}?status=fail`,
      language: "ru",
      description: "Payment for order",
      pageView: "MOBILE",
    });

    const res = await fetch(process.env.ALFA_GATEWAY + "register.do", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    });

    const text = await res.text();
    const responseParams = new URLSearchParams(text);

    const formUrl = responseParams.get("formUrl");
    const orderId = responseParams.get("orderId");
    const errorCode = responseParams.get("errorCode");
    const errorMessage = responseParams.get("errorMessage");

    if (!formUrl || !orderId) {
      console.error("Error Alfa-Bank:", { errorCode, errorMessage, resText: text });
      return NextResponse.json(
        { error: "Error gateway Alfa-Bank", details: errorMessage || text, errorCode },
        { status: 500 }
      );
    }

    return NextResponse.json({ formUrl, orderId });
  } catch (err) {
    console.error("Error /api/payment/start:", err);
    return NextResponse.json({ error: (err as Error).message, details: "Connection error" }, { status: 500 });
  }
}
