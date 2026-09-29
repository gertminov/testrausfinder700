"use client"

import {usePathname, useRouter} from "next/navigation";
import {Dimension, dimensions, Selection, selectionToSearchParams, selectionToTags, Tag} from "@/lib/dimensions";
import {useMatchResult} from "@/components/match-result-provider";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Field, FieldLabel} from "@/components/ui/field";
import {useMemo} from "react";
import {ButtonGroup} from "@/components/ui/button-group";
import {Button} from "@/components/ui/button";

/** Writes the Selection to the URL; `MatchResultProvider` picks it up from there. */
export function CriteriaSelector() {
    const router = useRouter()
    const pathname = usePathname()
    const {selectedCriteria: selection, possibleCriteria} = useMatchResult()
    const filters = useMemo(() => {
        const dimensionSet = new Set([...selectionToTags(selection), ...possibleCriteria].map(t => t.dimension))
        console.log(dimensionSet)
        return [...dimensionSet.values().map(c => ({id: c, values: dimensions[c]}))]
    }, [selection]);

    function handleSelectionChange(dimension: Dimension, value: string | null) {
        // `value` comes from `dimension`'s own tags, so the pairing holds.
        const query = selectionToSearchParams({...selection, [dimension]: value ?? undefined} as Selection).toString()
        router.replace(query ? `${pathname}?${query}` : pathname, {scroll: false})
    }

    return (
        <div className="w-72 space-y-4 p-4 min-h-0 overflow-y-auto">
            {filters.map((dimension ) => (
                <Field key={dimension.id}>
                    <FieldLabel>{dimension.id}</FieldLabel>
                    <ButtonGroup>
                        <Select items={dimension.values.map(t => ({label: t, value: t}))}
                                value={selection[dimension.id] ?? null}
                                onValueChange={(value) => handleSelectionChange(dimension.id, value)}>
                            <SelectTrigger className="w-45">
                                <SelectValue placeholder={dimension.id}/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {dimension.values.map((item) => (
                                        <SelectItem key={item} value={item}>
                                            {item}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <Button variant="outline">
X
                        </Button>
                    </ButtonGroup>
                </Field>
            ))}
        </div>
    );
}
