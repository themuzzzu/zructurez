
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchInput } from "@/components/SearchInput";

export const SearchHero = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (value: string) => {
    if (value.trim()) {
      navigate(`/search?q=${encodeURIComponent(value)}&fromHome=true`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 px-4">
      <SearchInput
        value={query}
        onChange={setQuery}
        onSubmit={() => handleSearch(query)}
        placeholder="Search for products, services, businesses..."
        className="w-full"
      />
    </div>
  );
};
