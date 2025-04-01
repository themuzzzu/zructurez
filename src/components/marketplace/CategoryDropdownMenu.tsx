
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
  const [isOpen, setIsOpen] = useState(false);
  const [activeSubCategory, setActiveSubCategory] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubCategoryClick = (subCategoryId: string) => {
    navigate(`/marketplace?category=${categoryId}&subcategory=${subCategoryId}`);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        className="flex items-center space-x-1 px-4 py-2 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{categoryName}</span>
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 left-0 mt-2 bg-white dark:bg-zinc-800 shadow-lg border border-gray-200 dark:border-zinc-700 rounded-md min-w-[250px]">
          <div className="grid grid-cols-1 py-2">
            {subCategories.map((subCategory) => (
              <div 
                key={subCategory.id} 
                className="relative"
                onMouseEnter={() => setActiveSubCategory(subCategory.id)}
                onMouseLeave={() => setActiveSubCategory(null)}
              >
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-zinc-700 text-sm flex justify-between items-center"
                  onClick={() => handleSubCategoryClick(subCategory.id)}
                >
                  {subCategory.name}
                  {subCategory.subSubCategories && (
                    <svg 
                      className="w-4 h-4"
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </button>
                
                {subCategory.subSubCategories && activeSubCategory === subCategory.id && (
                  <div className="absolute left-full top-0 bg-white dark:bg-zinc-800 shadow-lg border border-gray-200 dark:border-zinc-700 rounded-md min-w-[250px] -ml-1">
                    <div className="py-2">
                      {subCategory.subSubCategories.map((item) => (
                        <button
                          key={item.id}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-zinc-700 text-sm"
                          onClick={() => {
                            navigate(`/marketplace?category=${categoryId}&subcategory=${subCategory.id}&subsubcategory=${item.id}`);
                            setIsOpen(false);
                          }}
                        >
                          {item.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
