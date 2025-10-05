"use client";

import React, { useMemo } from "react";

import { DiffSide, DiffStatus } from "@/lib/types";
import { diffChars } from "@/lib/utils";

import type { Props } from "./types";

export default function DiffViewer({ diffs }: Props) {
  // Memoize character-level diffs to avoid re-computing on every render
  const computedDiffs = useMemo(() => {
    return diffs.map((line) => {
      if (line.status === DiffStatus.MODIFIED) {
        return {
          ...line,
          charDiff: diffChars(line.left, line.right),
        };
      }
      return line;
    });
  }, [diffs]);

  const getBgColor = (status: DiffStatus, side: DiffSide) => {
    if (status === DiffStatus.MODIFIED)
      return side === DiffSide.LEFT ? "bg-red-100" : "bg-green-100";
    if (status === DiffStatus.ADDED && side === DiffSide.RIGHT)
      return "bg-green-100";
    if (status === DiffStatus.ADDED && side === DiffSide.LEFT)
      return "bg-zinc-300";
    if (status === DiffStatus.REMOVED && side === DiffSide.LEFT)
      return "bg-red-100";
    return "";
  };

  return (
    <div className="grid grid-cols-2 rounded-lg bg-gray-100 p-4 font-mono text-sm">
      {/* Left Column - Original */}
      <div className="border-r">
        <div className="mb-2 bg-gray-200 px-2 py-2 font-bold text-zinc-900">
          Original
        </div>
        {computedDiffs.map((line, idx) => (
          <div
            key={`left-${idx}`}
            className={`flex ${getBgColor(line.status, DiffSide.LEFT)}`}
          >
            <div className="w-10 pr-2 text-right text-gray-500 select-none">
              {line.status === DiffStatus.ADDED ? "" : (line.leftNumber ?? "")}
            </div>
            {line.status === DiffStatus.MODIFIED && line.charDiff ? (
              <span className="flex-1 whitespace-pre-wrap">
                {line.charDiff.map((part, partIdx) => {
                  if (part.removed) {
                    return (
                      <span key={partIdx} className="bg-red-500 text-white">
                        {part.value}
                      </span>
                    );
                  } else if (!part.added) {
                    return (
                      <span
                        key={partIdx}
                        className="whitespace-pre-wrap text-zinc-900"
                      >
                        {part.value}
                      </span>
                    );
                  }
                  return null;
                })}
              </span>
            ) : line.status === DiffStatus.ADDED ? (
              <div className="flex-1">&nbsp;</div>
            ) : (
              <div className="flex-1 whitespace-pre-wrap text-zinc-900">
                {line.left}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Right Column - Modified */}
      <div>
        <div className="mb-2 bg-gray-200 px-2 py-2 font-bold text-zinc-900">
          Modified
        </div>
        {computedDiffs.map((line, idx) => (
          <div
            key={`right-${idx}`}
            className={`flex ${getBgColor(line.status, DiffSide.RIGHT)}`}
          >
            <div className="w-10 pr-2 text-right text-gray-500 select-none">
              {line.rightNumber ?? ""}
            </div>
            {line.status === DiffStatus.MODIFIED && line.charDiff ? (
              <span className="flex-1 whitespace-pre-wrap">
                {line.charDiff.map((part, partIdx) => {
                  if (part.added) {
                    return (
                      <span key={partIdx} className="bg-green-400">
                        {part.value}
                      </span>
                    );
                  } else if (!part.removed) {
                    return (
                      <span
                        key={partIdx}
                        className="whitespace-pre-wrap text-zinc-900"
                      >
                        {part.value}
                      </span>
                    );
                  }
                  return null;
                })}
              </span>
            ) : (
              <div className="flex-1 whitespace-pre-wrap text-zinc-900">
                {line.right}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
