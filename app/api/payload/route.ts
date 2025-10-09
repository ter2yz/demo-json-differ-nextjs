import { NextResponse } from "next/server";

import payload1 from "@/fixtures/payload1";
import payload2 from "@/fixtures/payload2";
import { setPayload } from "@/lib/store";
import { getBackendUrl, isBackendEnabled } from "../config";

export async function POST(req: Request) {
  try {
    const { type } = await req.json();

    // If using backend, fetch from Laravel
    if (isBackendEnabled()) {
      try {
        const backendUrl = getBackendUrl();
        const response = await fetch(`${backendUrl}/api/payload`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ type }),
        });

        // Pass through the response with its original status code
        // This includes both success and error responses from Laravel
        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
      } catch (fetchErr: any) {
        // Only network errors reach here (connection refused, DNS failure, etc.)
        // TypeError is thrown when fetch fails to connect
        return NextResponse.json(
          { error: "Network error. Please check your connection." },
          { status: 503 }
        );
      }
    }

    // Otherwise, use local fixtures
    if (type === "payload1") setPayload("payload1", payload1);
    if (type === "payload2") setPayload("payload2", payload2);

    return NextResponse.json({ ok: true, received: type });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
