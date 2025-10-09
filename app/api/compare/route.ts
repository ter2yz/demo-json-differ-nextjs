import { NextResponse } from "next/server";

import { getPayloads } from "@/lib/store";
import { DiffLine } from "@/lib/types";
import { deepCompare } from "@/lib/utils";
import { isBackendEnabled, getBackendUrl } from "../config";

export async function GET() {
  // If using backend, fetch from Laravel
  if (isBackendEnabled()) {
    try {
      const backendUrl = getBackendUrl();
      const response = await fetch(`${backendUrl}/api/compare`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      // Pass through the response with its original status code
      // This includes both success and error responses from Laravel
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    } catch (err: any) {
      // Only network errors reach here (connection refused, DNS failure, etc.)
      // TypeError is thrown when fetch fails to connect
      return NextResponse.json(
        { error: "Network error. Please check your connection." },
        { status: 503 }
      );
    }
  }

  // Otherwise, use local store and comparison
  const { payload1, payload2 } = getPayloads();
  if (!payload1 || !payload2) {
    return NextResponse.json({ error: "Missing payloads" }, { status: 400 });
  }

  const diffs: DiffLine[] = deepCompare(payload1, payload2);

  return NextResponse.json({ diffs });
}
