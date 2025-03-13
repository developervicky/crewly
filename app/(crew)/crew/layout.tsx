import NavigationSidebar from "@/components/navigation-sidebar";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <div className="hidden md:flex items-center justify-center ml-3 h-full w-[72px] z-30 flex-col fixed inset-y-0">
        <NavigationSidebar />
      </div>
      <main className="md:pl-[72px] h-full">{children}</main>
    </div>
  );
};

export default layout;
