"use client";

import Link from "next/link";
import { useMatchResult } from "@/components/match-result-provider";
import {dimensionNames, selectionToSearchParams} from "@/lib/dimensions";
import { usePathname } from "next/navigation";
import { cn } from "cn";
import {Badge} from "@/components/ui/badge";
import {criterionName, dimensionName} from "@/lib/display-names";
import { dimensionColorStyle } from "@/lib/dimension-colors";

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
      <div className="flex-1 flex flex-col gap-1 min-h-0 overflow-y-auto scrollbar-thumb-only p-4">
        {possibleTests.map((test) => (
          <Link
            href={`/test/${test.id}${query ? `?${query}` : ""}`}
            key={test.id}
            className={cn(
              "space-y-2 px-4 py-4 transition-all duration-300 border border-transparent" +
                " ease-in-out cursor-pointer hover:border-muted-foreground/50 hover:shadow-xs",
              path === `/test/${test.id}` && "bg-muted",
            )}
          >
            <div>{test.name}</div>
              <div className="flex gap-2 flex-wrap">
                  {dimensionNames.flatMap((dimension) => {
                      const values= test.accepts[dimension];
                      if (!values) return [];
                      return (
                          <Badge
                              key={dimension}
                              variant="dimension"
                              style={dimensionColorStyle(dimension)}
                          >
                              {dimensionName(dimension)}:{" "}
                              {values
                                  .map((value) => criterionName({ dimension, value }))
                                  .join(" / ")}
                          </Badge>
                      );
                  })}
              </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
