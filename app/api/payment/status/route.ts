import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();

    if (!process.env.ALFA_USERNAME || !process.env.ALFA_PASSWORD || !process.env.ALFA_GATEWAY) {
      return NextResponse.json({ error: ".ENV variables does not exist or are incorrect" }, { status: 500 });
    }

    const params = new URLSearchParams({
      userName: process.env.ALFA_USERNAME,
      password: process.env.ALFA_PASSWORD,
      orderId,
    });

    const res = await fetch(process.env.ALFA_GATEWAY + "getOrderStatus.do", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    });

    const text = await res.text();
    const responseParams = new URLSearchParams(text);

    const orderStatus = responseParams.get("orderStatus");
    const errorCode = responseParams.get("errorCode");
    const errorMessage = responseParams.get("errorMessage");

    if (!orderStatus) {
      return NextResponse.json(
        { error: "Errore Alfa-Bank", details: errorMessage || text, errorCode },
        { status: 500 }
      );
    }

    return NextResponse.json({ orderStatus, errorCode, errorMessage });
  } catch (err) {
    console.error("Errore /api/payment/status:", err);
    return NextResponse.json(
      { error: (err as Error).message, details: "Errore di connessione" },
      { status: 500 }
    );
  }
}
