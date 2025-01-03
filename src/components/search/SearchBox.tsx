import { Search, TrendingUp } from "lucide-react";
import { Input } from "../ui/input";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface SearchBoxProps {
  className?: string;
}

export const SearchBox = ({ className }: SearchBoxProps) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const trendingTopics = [
    { topic: "Community Center", count: "2.5K posts" },
    { topic: "Local Events", count: "1.8K posts" },
    { topic: "Neighborhood Watch", count: "1.2K posts" },
    { topic: "Local Business", count: "950 posts" },
    { topic: "Community Garden", count: "820 posts" },
  ];

  return (
    <div className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-start text-muted-foreground"
          >
            <Search className="mr-2 h-4 w-4" />
            {value || "Search neighborhoods, topics, posts..."}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Type to search..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Trending Topics">
                {trendingTopics.map((item) => (
                  <CommandItem
                    key={item.topic}
                    onSelect={() => {
                      setValue(item.topic);
                      setOpen(false);
                    }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <TrendingUp className="mr-2 h-4 w-4 text-muted-foreground" />
                      {item.topic}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {item.count}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};