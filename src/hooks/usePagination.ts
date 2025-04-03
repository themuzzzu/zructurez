
import { useState, useCallback, useEffect } from "react";
import { useInView } from "react-intersection-observer";

interface PaginationOptions {
  initialPage?: number;
  initialPageSize?: number;
  threshold?: number;
}

interface PaginationResult<T> {
  data: T[];
  isLoading: boolean;
  error: Error | null;
  page: number;
  pageSize: number;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  hasMore: boolean;
  loadMore: () => void;
  ref: (node?: Element | null) => void; // Intersection observer ref
}

export function usePagination<T>(
  fetchFn: (page: number, pageSize: number) => Promise<{ data: T[]; totalCount: number }>,
  options: PaginationOptions = {}
): PaginationResult<T> {
  const {
    initialPage = 1,
    initialPageSize = 10,
    threshold = 0.5,
  } = options;

  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [hasMore, setHasMore] = useState(true);
  const [totalItems, setTotalItems] = useState(0);

  // Setup intersection observer for infinite scroll
  const { ref, inView } = useInView({
    threshold,
    triggerOnce: false,
  });

  const fetchPage = useCallback(async (pageNum: number) => {
    if (!hasMore && pageNum > 1) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await fetchFn(pageNum, pageSize);
      
      if (pageNum === 1) {
        setData(result.data);
      } else {
        setData(prev => [...prev, ...result.data]);
      }
      
      setTotalItems(result.totalCount);
      setHasMore(pageNum * pageSize < result.totalCount);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
      console.error('Error fetching paginated data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [fetchFn, pageSize, hasMore]);

  // Load initial data
  useEffect(() => {
    fetchPage(initialPage);
  }, [fetchFn, initialPage, pageSize]);

  // Handle infinite scroll
  useEffect(() => {
    if (inView && !isLoading && hasMore) {
      setPage(prev => prev + 1);
      fetchPage(page + 1);
    }
  }, [inView, isLoading, hasMore, fetchPage, page]);

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      setPage(prev => prev + 1);
      fetchPage(page + 1);
    }
  }, [fetchPage, isLoading, hasMore, page]);

  return {
    data,
    isLoading,
    error,
    page,
    pageSize,
    setPage: (newPage: number) => {
      setPage(newPage);
      fetchPage(newPage);
    },
    setPageSize: (newSize: number) => {
      setPageSize(newSize);
      setPage(1);
      fetchPage(1);
    },
    hasMore,
    loadMore,
    ref,
  };
}
