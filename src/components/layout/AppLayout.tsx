
import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isMobile = useIsMobile();

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar open={sidebarOpen && !isMobile} setOpen={setSidebarOpen} />
      <div 
        className={cn(
          "flex-1 transition-all duration-300 ease-in-out min-w-0",
          sidebarOpen && !isMobile ? "ml-64" : isMobile ? "ml-0" : "ml-20"
        )}
      >
        <main className="p-2 sm:p-4 lg:p-6 w-full min-h-screen overflow-x-hidden">
          <div className="max-w-full">
            {children}
          </div>
        </main>
      </div>
      <Toaster />
    </div>
  );
};
