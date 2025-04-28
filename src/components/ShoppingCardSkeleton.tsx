
export const ShoppingCardSkeleton = () => {
  return (
    <div className="border rounded-lg overflow-hidden animate-pulse">
      <div className="h-40 bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
        <div className="h-8 bg-gray-200 rounded mt-4" />
      </div>
    </div>
  );
};
