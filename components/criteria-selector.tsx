"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  Dimension,
  dimensionNames,
  dimensions,
  SAMPLE_SIZE_PARAM,
  Selection,
  selectionToSearchParams,
  selectionToTags,
  Tag,
} from "@/lib/dimensions";
import {
  criterionName,
  dimensionHint,
  dimensionName,
} from "@/lib/display-names";
import { dimensionColorStyle } from "@/lib/dimension-colors";
import { useMatchResult } from "@/components/match-result-provider";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldLabel } from "@/components/ui/field";
import { useMemo } from "react";
import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
import { EraserIcon, QuestionIcon } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/** Writes the Selection and sample size to the URL; `MatchResultProvider` picks it up from there. */
export function CriteriaSelector() {
  const router = useRouter();
  const pathname = usePathname();
  const {
    selectedCriteria: selection,
    sampleSize,
    possibleCriteria,
  } = useMatchResult();
  const filters = useMemo(() => {
    const shown = new Set(
      [...selectionToTags(selection), ...possibleCriteria].map(
        (t) => t.dimension,
      ),
    );
    return dimensionNames
      .filter((d) => shown.has(d))
      .map((d) => ({
        id: d,
        name: dimensionName(d),
        hint: dimensionHint(d),
        // `value` was read from `d`'s own key, so the pairing holds.
        values: dimensions[d].map((value) => ({
          value,
          label: criterionName({ dimension: d, value } as Tag),
        })),
      }));
  }, [selection]);

  function writeToUrl(
    nextSelection: Selection,
    nextSampleSize: number | undefined,
  ) {
    const params = selectionToSearchParams(nextSelection);
    if (nextSampleSize !== undefined)
      params.set(SAMPLE_SIZE_PARAM, String(nextSampleSize));
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }

  function handleSelectionChange(dimension: Dimension, value: string | null) {
    // `value` comes from `dimension`'s own tags, so the pairing holds.
    writeToUrl(
      { ...selection, [dimension]: value ?? undefined } as Selection,
      sampleSize,
    );
  }

  function handleSampleSizeChange(value: string) {
    const next = Number(value);
    writeToUrl(
      selection,
      value !== "" && Number.isInteger(next) && next > 0 ? next : undefined,
    );
  }

  return (
    <div className="h-full space-y-6 pr-4 py-4 min-h-0 overflow-y-auto scrollbar-gutter-stable scrollbar-thumb-only ">
      <div className="flex justify-center">
        <Button variant={"outline"} onClick={() => router.replace(pathname, { scroll: false })}>
          Reset
        </Button>
      </div>
      <div className="flex">
        <div className="w-3"></div>
        <Field className="gap-1">
          <FieldLabel className={"font-light"}>Sample size</FieldLabel>
          <ButtonGroup>
            <Input
              placeholder="Sample size"
              type="number"
              min={1}
              step={1}
              value={sampleSize ?? ""}
              onChange={(e) => handleSampleSizeChange(e.target.value)}
            />
            <Button
              variant="outline"
              onClick={() => handleSampleSizeChange("")}
            >
              <EraserIcon />
            </Button>
          </ButtonGroup>
        </Field>
      </div>
      {filters.map((dimension) => (
        <Field key={dimension.id} style={dimensionColorStyle(dimension.id)} className="gap-1">
          <div className="flex items-center">
            <div className="flex w-3 items-center">
              <span className={`h-1.5 aspect-square rounded-full ${selection[dimension.id]? 'dimension-dot' : ''}`}></span>
            </div>
            <FieldLabel className="font-light">{dimension.name}</FieldLabel>

            <div className="ml-4 flex-1 flex items-center justify-end">
              <Tooltip>
                <TooltipTrigger
                  render={<QuestionIcon className="text-muted-foreground" />}
                />
                <TooltipContent>{dimension.hint}</TooltipContent>
              </Tooltip>
            </div>
          </div>
          <div className="flex">
            <div className="w-3"></div>

            <ButtonGroup className="flex-1">
              <Select
                items={dimension.values}
                value={selection[dimension.id] ?? null}
                onValueChange={(value) =>
                  handleSelectionChange(dimension.id, value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select…" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {dimension.values.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={() => handleSelectionChange(dimension.id, null)}
              >
                <EraserIcon />
              </Button>
            </ButtonGroup>
          </div>
        </Field>
      ))}
    </div>
  );
}
