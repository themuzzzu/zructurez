
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function ShoppingCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="w-full aspect-[4/3]" />
      <CardContent className="p-3">
        <Skeleton className="h-5 w-[80%] mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-[60%] mb-2" />
        <div className="flex justify-between items-center mt-2">
          <Skeleton className="h-5 w-[40%]" />
          <Skeleton className="h-4 w-[25%] rounded-full" />
        </div>
      </CardContent>
      <CardFooter className="p-3 pt-0">
        <Skeleton className="h-8 w-full rounded-md" />
      </CardFooter>
    </Card>
  );
}
