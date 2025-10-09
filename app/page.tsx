"use client";

import { useRef, useState } from "react";

import DiffViewer from "@/components/DiffViewer/DiffViewer";
import DiffViewerSkeleton from "@/components/DiffViewerSkeleton";
import { LoadingIcon } from "@/components/Icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiClient, getErrorMessage } from "@/lib/api";
import { DiffLine } from "@/lib/types";
import { validateJSON } from "@/lib/utils";

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

  // Request cancellation
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendExamplePayloads = async () => {
    reset();
    setLoading(true);
    setMessage("🚀 Sending payload 1...");

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();

    try {
      // send payload 1
      await apiClient("/api/payload", {
        method: "POST",
        body: { type: "payload1" },
        timeout: 35000, // 35 seconds for example mode
        signal: abortControllerRef.current.signal,
      });

      setMessage("✅ Payload 1 sent. Waiting 30s for payload 2...");
      setProgress(33);

      // wait 30s (allow cancellation during wait)
      await new Promise<void>((resolve, reject) => {
        const timeoutId = setTimeout(resolve, 1000);
        abortControllerRef.current?.signal.addEventListener("abort", () => {
          clearTimeout(timeoutId);
          reject(new Error("Request was cancelled"));
        });
      });

      setMessage("🚀 Sending payload 2...");
      await apiClient("/api/payload", {
        method: "POST",
        body: { type: "payload2" },
        timeout: 35000,
        signal: abortControllerRef.current.signal,
      });

      setMessage("✅ Payload 2 sent. Be patient for comparing...");
      setProgress(66);

      // request comparison
      const data = await apiClient<{ diffs: DiffLine[] }>("/api/compare", {
        timeout: 35000,
        signal: abortControllerRef.current.signal,
      });

      setMessage("✅ Comparison complete.");
      setProgress(100);

      setDiffs(data.diffs || []);

      await new Promise((resolve) => setTimeout(resolve, 1000));
      setShowResult(true);
      setMessage("");
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);
      setMessage(`❌ ${errorMessage}`);
      setDiffs([]);
      setShowResult(false);
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
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

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();

    try {
      const data = await apiClient<{ diffs: DiffLine[] }>(
        "/api/compare-custom",
        {
          method: "POST",
          body: {
            payload1: validation1.data,
            payload2: validation2.data,
          },
          timeout: 10000, // 10 seconds for custom mode
          signal: abortControllerRef.current.signal,
        }
      );

      setMessage("✅ Comparison complete.");
      setProgress(100);

      await new Promise((resolve) => setTimeout(resolve, 1000));
      setDiffs(data.diffs || []);
      setShowResult(true);
      setMessage("");
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);
      setMessage(`❌ ${errorMessage}`);
      setDiffs([]);
      setShowResult(false);
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  };

  const cancelRequest = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setMessage("Request cancelled.");
    }
  };

  const reset = () => {
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

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
    <div className="bg-foreground mx-auto min-h-screen w-full px-4 py-8">
      <div className="border-background/20 mx-auto mb-6 flex max-w-4xl justify-between border-b">
        <h1 className="text-background mb-6 text-3xl font-bold">
          JSON Payload Differ
        </h1>

        {/* Mode Selection */}
        <div className="mb-6 flex items-center gap-2">
          <label className="text-background text-sm font-medium">Mode:</label>
          <Select
            defaultValue="example"
            onValueChange={(value) =>
              handleModeChange(value as "example" | "custom")
            }
          >
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="example">Use Example Payloads</SelectItem>
              <SelectItem value="custom">Paste Custom JSON</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border-background/20 mx-auto mb-6 max-w-4xl border-b pb-6">
        <p className="text-background mb-4 leading-relaxed">
          Visualize and compare JSON payloads with detailed diff highlighting.
          Choose your comparison mode:
        </p>
        <div className="text-background space-y-2 pl-4 leading-relaxed">
          <p>
            <span className="font-semibold">• Example Mode:</span> Simulates a
            real-world webhook scenario by sending two payloads with a 30-second
            delay, then comparing them automatically.
          </p>
          <p>
            <span className="font-semibold">• Custom Mode:</span> Paste your own
            JSON payloads to compare any two data structures and see the
            differences side-by-side.
          </p>
        </div>
      </div>

      {/* Example Mode */}
      {mode === "example" && (
        <div className="mx-auto mb-6 max-w-4xl">
          <p className="mb-4 text-white">
            This simulates receiving two webhook payloads with a 30-second
            delay.
          </p>
          <div className="flex gap-3">
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
            {loading && (
              <button
                onClick={cancelRequest}
                className="cursor-pointer rounded bg-rose-500 px-4 py-2 text-white transition-colors hover:bg-rose-700"
              >
                Cancel
              </button>
            )}
          </div>

          {message && <p className="text-background mt-3 text-sm">{message}</p>}
          {loading && (
            <div className="mt-3 h-2 w-full rounded-full bg-gray-200">
              <div
                className="h-2 rounded-full bg-indigo-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      )}

      {/* Custom Mode */}
      {mode === "custom" && (
        <div className="text-background mx-auto mb-6 max-w-4xl space-y-4">
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
              className={`placeholder-background/50 h-40 w-full rounded-lg border p-3 font-mono text-sm ${
                errors.payload1 ? "border-rose-500" : "border-gray-300"
              }`}
              disabled={loading}
            />
            {errors.payload1 && (
              <p className="mt-1 text-sm text-rose-500">{errors.payload1}</p>
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
              className={`placeholder-background/50 h-40 w-full rounded-lg border p-3 font-mono text-sm ${
                errors.payload2 ? "border-rose-500" : "border-gray-300"
              }`}
              disabled={loading}
            />
            {errors.payload2 && (
              <p className="mt-1 text-sm text-rose-500">{errors.payload2}</p>
            )}
          </div>

          <div className="flex gap-3">
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
            {loading && (
              <button
                onClick={cancelRequest}
                className="cursor-pointer rounded bg-rose-500 px-4 py-2 text-white transition-colors hover:bg-rose-700"
              >
                Cancel
              </button>
            )}
          </div>

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

      {loading && <DiffViewerSkeleton />}

      {showResult && diffs && diffs.length > 0 && (
        <div className="mt-8 mb-40 w-full xl:px-20">
          <div className="mx-auto max-w-4xl">
            <h2 className="animate-fade-in text-background mb-4 text-xl font-bold">
              Comparison Results
            </h2>
          </div>
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
