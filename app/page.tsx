"use client";

import { useState } from "react";

import DiffViewer from "@/components/DiffViewer/DiffViewer";
import { LoadingIcon } from "@/components/Icons";
import { DiffLine } from "@/lib/types";

export default function Home() {
  const [mode, setMode] = useState<"example" | "custom">("example");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [diffs, setDiffs] = useState<DiffLine[]>([]);
  const [progress, setProgress] = useState(0);
  const [showResult, setShowResult] = useState(false);

  // Custom mode states
  const [payload1Input, setPayload1Input] = useState("");
  const [payload2Input, setPayload2Input] = useState("");
  const [errors, setErrors] = useState({ payload1: "", payload2: "" });

  // simple JSON validation
  const validateJSON = (
    input: string
  ): { valid: boolean; error?: string; data?: any } => {
    if (!input.trim()) {
      return { valid: false, error: "JSON cannot be empty" };
    }

    try {
      const parsed = JSON.parse(input);
      return { valid: true, data: parsed };
    } catch (err: any) {
      return { valid: false, error: `Invalid JSON: ${err.message}` };
    }
  };

  const sendExamplePayloads = async () => {
    reset();
    setLoading(true);
    setMessage("🚀 Sending payload 1...");
    try {
      // send payload 1
      const res1 = await fetch("/api/payload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "payload1" }),
      });
      if (!res1.ok) {
        const error = await res1.json();
        throw new Error(error.error || "Failed sending payload 1");
      }
      setMessage("✅ Payload 1 sent. Waiting 30s for payload 2...");
      setProgress(33);

      // wait 30s
      await new Promise((resolve) => setTimeout(resolve, 10000));
      setMessage("🚀 Sending payload 2...");
      const res2 = await fetch("/api/payload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "payload2" }),
      });
      if (!res2.ok) {
        const error = await res2.json();
        throw new Error(error.error || "Failed sending payload 2");
      }
      setMessage("✅ Payload 2 sent. Be patient for comparing...");
      setProgress(66);

      // request comparison
      const compareRes = await fetch("/api/compare");
      if (!compareRes.ok) {
        const error = await compareRes.json();
        throw new Error(error.error || "Comparison failed");
      }

      const data = await compareRes.json();
      setMessage("✅ Comparison complete.");
      setProgress(100);

      setDiffs(data.diffs || []);

      await new Promise((resolve) => setTimeout(resolve, 1000));
      setShowResult(true);
    } catch (err: any) {
      setMessage("❌ Error: " + err.message);
      setDiffs([]);
    } finally {
      setMessage("");
      setLoading(false);
    }
  };

  const compareCustomPayloads = async () => {
    // Validate both inputs
    const validation1 = validateJSON(payload1Input);
    const validation2 = validateJSON(payload2Input);

    setErrors({
      payload1: validation1.valid ? "" : validation1.error || "",
      payload2: validation2.valid ? "" : validation2.error || "",
    });

    if (!validation1.valid || !validation2.valid) {
      return;
    }

    reset();
    setLoading(true);
    setMessage("Comparing payloads...");
    setProgress(50);

    try {
      const res = await fetch("/api/compare-custom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payload1: validation1.data,
          payload2: validation2.data,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Comparison failed");
      }

      const data = await res.json();
      setMessage("✅ Comparison complete.");
      setProgress(100);

      await new Promise((resolve) => setTimeout(resolve, 1000));
      setDiffs(data.diffs || []);
      setShowResult(true);
    } catch (err: any) {
      setMessage("❌ Error: " + err.message);
      setDiffs([]);
    } finally {
      setMessage("");
      setLoading(false);
    }
  };

  const reset = () => {
    setDiffs([]);
    setMessage("");
    setLoading(false);
    setProgress(0);
    setErrors({ payload1: "", payload2: "" });
  };

  const handleModeChange = (newMode: "example" | "custom") => {
    reset();
    setMode(newMode);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">JSON Payload Differ</h1>

      {/* Mode Selection */}
      <div className="mb-6 flex gap-4">
        <button
          onClick={() => handleModeChange("example")}
          className={`rounded-lg px-6 py-3 font-medium transition-colors ${
            mode === "example"
              ? "bg-indigo-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Use Example Payloads
        </button>
        <button
          onClick={() => handleModeChange("custom")}
          className={`rounded-lg px-6 py-3 font-medium transition-colors ${
            mode === "custom"
              ? "bg-indigo-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Paste Custom JSON
        </button>
      </div>

      {/* Example Mode */}
      {mode === "example" && (
        <div className="mb-6">
          <p className="mb-4 text-white">
            This simulates receiving two webhook payloads with a 30-second
            delay.
          </p>
          <button
            onClick={sendExamplePayloads}
            disabled={loading}
            className="cursor-pointer rounded bg-indigo-600 px-4 py-2 text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <LoadingIcon className="size-5 text-white" />
                <span>Processing...</span>
              </div>
            ) : (
              "Send Payloads & Compare"
            )}
          </button>

          {message && <p className="mt-3">{message}</p>}
          {loading && (
            <div className="mt-3 h-2 w-full rounded-full bg-gray-200">
              <div
                className="h-2 rounded-full bg-blue-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      )}

      {/* Custom Mode */}
      {mode === "custom" && (
        <div className="mb-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Payload 1 (Original JSON)
            </label>
            <textarea
              value={payload1Input}
              onChange={(e) => {
                setPayload1Input(e.target.value);
                setErrors((prev) => ({ ...prev, payload1: "" }));
              }}
              placeholder='{"id": 1, "name": "Product A", ...}'
              className={`h-40 w-full rounded-lg border p-3 font-mono text-sm ${
                errors.payload1 ? "border-red-500" : "border-gray-300"
              }`}
              disabled={loading}
            />
            {errors.payload1 && (
              <p className="mt-1 text-sm text-red-500">{errors.payload1}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Payload 2 (Modified JSON)
            </label>
            <textarea
              value={payload2Input}
              onChange={(e) => {
                setPayload2Input(e.target.value);
                setErrors((prev) => ({ ...prev, payload2: "" }));
              }}
              placeholder='{"id": 1, "name": "Product B", ...}'
              className={`h-40 w-full rounded-lg border p-3 font-mono text-sm ${
                errors.payload2 ? "border-red-500" : "border-gray-300"
              }`}
              disabled={loading}
            />
            {errors.payload2 && (
              <p className="mt-1 text-sm text-red-500">{errors.payload2}</p>
            )}
          </div>

          <button
            onClick={compareCustomPayloads}
            disabled={loading}
            className="cursor-pointer rounded bg-indigo-600 px-4 py-2 text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <LoadingIcon className="size-5 text-white" />
                <span>Comparing...</span>
              </div>
            ) : (
              "Compare Payloads"
            )}
          </button>

          {message && <p className="mt-3">{message}</p>}
          {loading && (
            <div className="mt-3 h-2 w-full rounded-full bg-gray-200">
              <div
                className="h-2 rounded-full bg-blue-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      )}

      {showResult && diffs && diffs.length > 0 && (
        <div className="mt-8">
          <h2 className="animate-fade-in mb-4 text-xl font-bold">
            Comparison Results
          </h2>
          <div
            className="animate-fade-in"
            style={{ animationDelay: "0.5s", animationFillMode: "both" }}
          >
            <DiffViewer diffs={diffs} />
          </div>
        </div>
      )}
    </div>
  );
}
