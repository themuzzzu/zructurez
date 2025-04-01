
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { toast } from "sonner";

interface SubSubCategory {
  id: string;
  name: string;
}

interface SubCategory {
  id: string;
  name: string;
  subSubCategories?: SubSubCategory[];
}

interface CategoryMenuProps {
  categoryId: string;
  categoryName: string;
  subCategories: SubCategory[];
}

export const CategoryDropdownMenu = ({ categoryId, categoryName, subCategories }: CategoryMenuProps) => {
  const navigate = useNavigate();
  const [activeSubCategory, setActiveSubCategory] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveSubCategory(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubCategoryHover = (subCategoryId: string) => {
    setActiveSubCategory(subCategoryId);
  };

  const handleSubCategoryClick = (subCategoryId: string) => {
    navigate(`/marketplace?category=${categoryId}&subcategory=${subCategoryId}`);
    toast.success(`Browsing ${subCategories.find(s => s.id === subCategoryId)?.name || ''} products`);
  };

  const handleSubSubCategoryClick = (subCategoryId: string, subSubCategoryId: string) => {
    navigate(`/marketplace?category=${categoryId}&subcategory=${subCategoryId}&subsubcategory=${subSubCategoryId}`);
    
    // Find the subcategory and subsubcategory names for the toast
    const subCategory = subCategories.find(s => s.id === subCategoryId);
    const subSubCategory = subCategory?.subSubCategories?.find(ss => ss.id === subSubCategoryId);
    
    toast.success(`Browsing ${subSubCategory?.name || ''} products`);
  };

  return (
    <div ref={dropdownRef}>
      {subCategories.map((subCategory) => (
        <div 
          key={subCategory.id}
          className="relative"
          onMouseEnter={() => handleSubCategoryHover(subCategory.id)}
          onMouseLeave={() => setActiveSubCategory(null)}
        >
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-zinc-700 text-sm flex justify-between items-center"
            onClick={() => handleSubCategoryClick(subCategory.id)}
          >
            {subCategory.name}
            {subCategory.subSubCategories && subCategory.subSubCategories.length > 0 && (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
          
          {/* If there are sub-sub-categories and this subcategory is active, show them */}
          {subCategory.subSubCategories && activeSubCategory === subCategory.id && (
            <div className="absolute left-full top-0 bg-white dark:bg-zinc-800 shadow-lg border border-gray-200 dark:border-zinc-700 rounded-md min-w-[250px] -ml-1">
              <div className="py-2">
                <div className="px-4 py-2 text-xs font-medium text-gray-500 border-b border-gray-200 dark:border-zinc-700 mb-1">
                  More in {subCategory.name}
                </div>
                {subCategory.subSubCategories.map((subSubCategory) => (
                  <button
                    key={subSubCategory.id}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-zinc-700 text-sm"
                    onClick={() => handleSubSubCategoryClick(subCategory.id, subSubCategory.id)}
                  >
                    {subSubCategory.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
