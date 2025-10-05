import { NextResponse } from "next/server";

import payload1 from "@/fixtures/payload1";
import payload2 from "@/fixtures/payload2";
import { setPayload, store } from "@/lib/store";

export async function POST(req: Request) {
  try {
    const { type } = await req.json();

    if (type === "payload1") setPayload("payload1", payload1);
    if (type === "payload2") setPayload("payload2", payload2);

    return NextResponse.json({ ok: true, received: type });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
