import { NextResponse } from "next/server";

import { DiffLine } from "@/lib/types";
import { deepCompare } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const { payload1, payload2 } = await req.json();

    if (!payload1 || !payload2) {
      return NextResponse.json(
        { error: "Both payloads are required" },
        { status: 400 }
      );
    }

    const diffs: DiffLine[] = deepCompare(payload1, payload2);

    return NextResponse.json({ diffs });
  } catch (err: any) {
    return NextResponse.json(
      { error: `Comparison failed: ${err.message}` },
      { status: 500 }
    );
  }
}
