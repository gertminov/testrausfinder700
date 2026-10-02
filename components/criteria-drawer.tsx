import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { CriteriaSelector } from "@/components/criteria-selector";

export default function CriteriaDrawer() {
  return (
    <div className="flex flex-col justify-center  items-center pb-4 pt-2 border-t border-muted-foreground">
      <Drawer>
        <DrawerTrigger
          render={
            <Button size={"lg"} className={"min-w-40"}>
              Filter
            </Button>
          }
        />
        <DrawerContent>
          <div className="min-h-[50vh]  flex flex-1 flex-col px-4">
            <CriteriaSelector />
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
