"use client";

import Link from "next/link";
import { useMatchResult } from "@/components/match-result-provider";
import { selectionToSearchParams } from "@/lib/dimensions";
import { usePathname } from "next/navigation";
import { cn } from "cn";

export function TestList() {
  const { possibleTests, selectedCriteria } = useMatchResult();
  const query = selectionToSearchParams(selectedCriteria).toString();
  const path = usePathname();
  return (
    <div className="flex-1 min-h-0 h-full flex flex-col">
      <div className="flex pt-2">
        <div className="text-sm text-muted-foreground">
          {possibleTests.length} Tests
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-2 min-h-0 overflow-y-auto scrollbar-thumb-only p-4">
        {possibleTests.map((test) => (
          <Link
            href={`/test/${test.id}${query ? `?${query}` : ""}`}
            key={test.id}
            className={cn(
              "space-y-2 rounded px-4 py-2 transition-colors duration-300 ease-in-out cursor-pointer hover:bg-muted",
              path === `/test/${test.id}` && "bg-muted",
            )}
          >
            <div>{test.name}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
