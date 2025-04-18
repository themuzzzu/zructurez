
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SearchLayoutProps {
  filters: ReactNode;
  content: ReactNode;
  className?: string;
}

export function SearchLayout({ filters, content, className }: SearchLayoutProps) {
  return (
    <div className={cn("flex flex-col md:flex-row gap-4", className)}>
      {/* Filters sidebar - fixed width on desktop */}
      <aside className="hidden md:block w-[240px] flex-shrink-0 border-r pr-4">
        {filters}
      </aside>
      
      {/* Main content area - flexible width */}
      <main className="flex-1 min-w-0">
        {content}
      </main>
    </div>
  );
}
