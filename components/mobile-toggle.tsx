import { Menu } from "lucide-react";
import CrewSidebar from "./crew-sidebar";
import NavigationSidebar from "./navigation-sidebar";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

const MobileToggle = ({ crewId }: { crewId: string }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 flex gap-0 flex-row">
        <div className="w-[72px] h-screen">
          <NavigationSidebar />
        </div>
        <CrewSidebar crewId={crewId} />
      </SheetContent>
    </Sheet>
  );
};

export default MobileToggle;
