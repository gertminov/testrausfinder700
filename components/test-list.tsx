"use client"

import Link from "next/link";
import {Badge} from "@/components/ui/badge";
import {useMatchResult} from "@/components/match-result-provider";
import {selectionToSearchParams} from "@/lib/dimensions";

export function TestList() {
    const {possibleTests, selectedCriteria} = useMatchResult()
    const query = selectionToSearchParams(selectedCriteria).toString()
    return (
        <div className="flex-1 flex flex-col gap-2 min-h-0 overflow-y-auto">
            {possibleTests.map((test) => (
                <Link
                    // Carry the Selection along so the lists stay filtered on the detail page.
                    href={`/test/${test.id}${query ? `?${query}` : ""}`}
                    key={test.id}
                    className="space-y-2 rounded px-4 py-2 transition-colors duration-300 ease-in-out cursor-pointer hover:bg-muted">
                    <div>{test.name}</div>
                    <div className="flex gap-2">
                        {Object.entries(test.accepts).flatMap(([key, value]) => (
                            value?.map((tag) => (
                                <Badge key={key + tag} variant="outline">{tag}</Badge>
                            ))
                        ))}
                    </div>
                </Link>
            ))}
        </div>
    );
}
