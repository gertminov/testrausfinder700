"use client";

import { createContext, type ReactNode, use } from "react";
import { useSearchParams } from "next/navigation";
import { findTests, type MatchResult } from "@/lib/engine";
import { allTests } from "@/lib/tests";
import {
  sampleSizeFromSearchParams,
  selectionFromSearchParams,
} from "@/lib/dimensions";

const MatchResultContext = createContext<MatchResult | null>(null);

/**
 * Holds the MatchResult for the Selection and sample size in the URL. The URL is the only
 * source of truth: the criteria write to it, this re-runs `findTests` when it
 * changes, and everything below reads the result through `useMatchResult`.
 *
 * Reads `useSearchParams`, so it must render inside a `<Suspense>` boundary.
 */
export function MatchResultProvider({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const params: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    params[key] = value;
  });

  const result = findTests(
    allTests,
    selectionFromSearchParams(params),
    sampleSizeFromSearchParams(params),
  );
  return <MatchResultContext value={result}>{children}</MatchResultContext>;
}

export function useMatchResult(): MatchResult {
  const result = use(MatchResultContext);
  if (result === null)
    throw new Error("useMatchResult must be used inside a MatchResultProvider");
  return result;
}
