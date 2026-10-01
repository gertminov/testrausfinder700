import { catalog, TestId } from "@/lib/tests";
import { type Accepts } from "@/lib/dimensions";
import TestDrawer from "@/app/test/[testid]/TestDrawer";

export default async function TestPage(props: PageProps<"/test/[testid]">) {
  const { testid } = await props.params;
  const test = catalog[testid as TestId];
  return <TestDrawer test={test} />;
}
