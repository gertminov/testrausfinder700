import { Drawer, DrawerContent, DrawerHeader } from "@/components/ui/drawer";
import { Test } from "@/lib/tests";
import { dimensionNames, Tag } from "@/lib/dimensions";
import { Badge } from "@/components/ui/badge";
import { criterionName, dimensionName } from "@/lib/display-names";
import { Button, buttonVariants } from "@/components/ui/button";
import { XIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";

export default function TestDrawer({ test }: { test: Test }) {
  return (
    <Drawer open={true} swipeDirection={"right"} modal={false}>
      <DrawerContent className="max-w-2xl w-2/5 min-w-96 bg-muted">
        <DrawerHeader>
          <div className={"flex items-center gap-4 justify-between"}>
            <h2 className="text-xl font-bold">{test.name}</h2>
            <Link
              className={buttonVariants({ variant: "ghost", size: "icon" })}
              href={"/"}
            >
              <XIcon />
            </Link>
          </div>
        </DrawerHeader>
        <div className="mx-4 my-2">
          <div className="flex gap-2 flex-wrap">
            {dimensionNames.flatMap((dimension) => {
              const values: readonly string[] | undefined =
                test.accepts[dimension];
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
          <div className="space-y-4 pt-2">
            <div className="border-b border-muted"></div>
            <div className="whitespace-pre-line">{test.info}</div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
