"use client";

import React from "react";

import { DiffSide, DiffStatus } from "@/lib/types";
import { diffChars } from "@/lib/utils";

import type { Props } from "./types";

// Render left side (removed parts highlighted)
const renderLeftDiff = (oldLine: string, newLine: string) => {
  const diffResult = diffChars(oldLine, newLine);
  return (
    <span className="flex-1 whitespace-pre-wrap">
      {diffResult.map((part, idx) => {
        if (part.removed) {
          return (
            <span key={idx} className="bg-red-500 text-white">
              {part.value}
            </span>
          );
        } else if (!part.added) {
          return (
            <span key={idx} className="whitespace-pre-wrap text-zinc-900">
              {part.value}
            </span>
          );
        }
        return null;
      })}
    </span>
  );
};

// Render right side (added parts highlighted)
const renderRightDiff = (oldLine: string, newLine: string) => {
  const diffResult = diffChars(oldLine, newLine);
  return (
    <span className="flex-1 whitespace-pre-wrap">
      {diffResult.map((part, idx) => {
        if (part.added) {
          return (
            <span key={idx} className="bg-green-400">
              {part.value}
            </span>
          );
        } else if (!part.removed) {
          return (
            <span key={idx} className="whitespace-pre-wrap text-zinc-900">
              {part.value}
            </span>
          );
        }
        return null;
      })}
    </span>
  );
};

export default function DiffViewer({ diffs }: Props) {
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
        {diffs.map((line, idx) => (
          <div
            key={`left-${idx}`}
            className={`flex ${getBgColor(line.status, DiffSide.LEFT)}`}
          >
            <div className="w-10 pr-2 text-right text-gray-500 select-none">
              {line.status === DiffStatus.ADDED ? "" : (line.leftNumber ?? "")}
            </div>
            {line.status === DiffStatus.MODIFIED ? (
              renderLeftDiff(line.left, line.right)
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
        {diffs.map((line, idx) => (
          <div
            key={`right-${idx}`}
            className={`flex ${getBgColor(line.status, DiffSide.RIGHT)}`}
          >
            <div className="w-10 pr-2 text-right text-gray-500 select-none">
              {line.rightNumber ?? ""}
            </div>
            {line.status === DiffStatus.MODIFIED ? (
              renderRightDiff(line.left, line.right)
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
