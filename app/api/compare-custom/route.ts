import { NextResponse } from "next/server";

import { DiffLine } from "@/lib/types";
import { deepCompare } from "@/lib/utils";
import { isBackendEnabled, getBackendUrl } from "../config";

export async function POST(req: Request) {
  try {
    const { payload1, payload2 } = await req.json();

    if (!payload1 || !payload2) {
      return NextResponse.json(
        { error: "Both payloads are required" },
        { status: 400 }
      );
    }

    // If using backend, fetch from Laravel
    if (isBackendEnabled()) {
      try {
        const backendUrl = getBackendUrl();
        const response = await fetch(`${backendUrl}/api/compare-custom`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ payload1, payload2 }),
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

    // Otherwise, use local comparison
    const diffs: DiffLine[] = deepCompare(payload1, payload2);

    return NextResponse.json({ diffs });
  } catch (err: any) {
    return NextResponse.json(
      { error: `Comparison failed: ${err.message}` },
      { status: 500 }
    );
  }
}
