
import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  onSubmit?: () => void;
  autoFocus?: boolean;
  disabled?: boolean;
}

export const SearchInput = ({ 
  placeholder = "Search...", 
  value, 
  onChange,
  className,
  onSubmit,
  autoFocus = false,
  disabled = false
}: SearchInputProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSubmit) {
      onSubmit();
    }
  };

  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400 z-10" />
      <Input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        autoFocus={autoFocus}
        disabled={disabled}
        className={cn(
          "pl-10 w-full bg-transparent focus-visible:ring-2 focus-visible:ring-primary",
          "rounded-md border-muted",
          disabled && "opacity-70 cursor-not-allowed"
        )}
      />
    </div>
  );
};
