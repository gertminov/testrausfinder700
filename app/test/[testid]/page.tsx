import { allTests, catalog, TestId } from "@/lib/tests";
import { Badge } from "@/components/ui/badge";
import { type Accepts, dimensionNames, type Tag } from "@/lib/dimensions";
import { criterionName, dimensionName } from "@/lib/display-names";

export default async function TestPage(props: PageProps<"/test/[testid]">) {
  const { testid } = await props.params;
  const test = catalog[testid as TestId];
  // Each Catalog entry has its own literal type; `Accepts` gives one shape to
  // index by any Dimension.
  const accepts: Accepts = test.accepts;
  return (
    <div className="space-y-4 pt-2">
      <div className="pl-4 ">
        <div className="text-xl font-bold">{test.name}</div>
        <div className="flex pt-2 gap-2 flex-wrap">
          {dimensionNames.flatMap((dimension) => {
            const values: readonly string[] | undefined = accepts[dimension];
            if (!values) return [];
            return (
              <Badge key={dimension} variant={"outline"}>
                {dimensionName(dimension)}:{" "}
                {values
                  // `value` was read from `dimension`'s own key, so the pairing holds.
                  .map((value) => criterionName({ dimension, value } as Tag))
                  .join(" / ")}
              </Badge>
            );
          })}
        </div>
      </div>
      <div className="border-b border-muted"></div>
      <div className="whitespace-pre-line pl-4">{test.info}</div>
    </div>
  );
}
