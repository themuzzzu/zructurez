
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SearchLayoutProps {
  filters: ReactNode;
  content: ReactNode;
  className?: string;
}

export function SearchLayout({ filters, content, className }: SearchLayoutProps) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-[280px_1fr] gap-4 p-4", className)}>
      <aside className="hidden md:block">
        {filters}
      </aside>
      <main>
        {content}
      </main>
    </div>
  );
}
