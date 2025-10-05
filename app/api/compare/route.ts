import { NextResponse } from "next/server";

import { getPayloads } from "@/lib/store";
import { DiffLine } from "@/lib/types";
import { deepCompare } from "@/lib/utils";

export async function GET() {
  const { payload1, payload2 } = getPayloads();
  if (!payload1 || !payload2) {
    return NextResponse.json({ error: "Missing payloads" }, { status: 400 });
  }

  const diffs: DiffLine[] = deepCompare(payload1, payload2);

  return NextResponse.json({ diffs });
}
