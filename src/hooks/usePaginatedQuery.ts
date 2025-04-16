
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from './useDebounce';

interface PaginationOptions {
  pageSize?: number;
  initialPage?: number;
}

interface PaginatedResult<T> {
  data: T[];
  isLoading: boolean;
  isError: boolean;
  error: any;
  page: number;
  setPage: (page: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  totalPages: number;
  totalItems: number;
  canNextPage: boolean;
  canPreviousPage: boolean;
  nextPage: () => void;
  previousPage: () => void;
}

/**
 * A hook for handling paginated data with React Query
 */
export function usePaginatedQuery<T>(
  queryKey: string,
  fetchFunction: (page: number, pageSize: number) => Promise<{ data: T[], totalCount: number }>,
  options: PaginationOptions = {}
): PaginatedResult<T> {
  const [page, setPage] = useState(options.initialPage || 1);
  const [pageSize, setPageSize] = useState(options.pageSize || 10);
  
  // Debounce page changes to prevent rapid fire API calls
  const debouncedPage = useDebounce(page, 300);
  const debouncedPageSize = useDebounce(pageSize, 300);
  
  // Use React Query to fetch data
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [queryKey, { page: debouncedPage, pageSize: debouncedPageSize }],
    queryFn: () => fetchFunction(debouncedPage, debouncedPageSize),
    placeholderData: 'keepPrevious', // Updated from keepPreviousData
  });
  
  // Calculate pagination metadata
  const totalItems = data?.totalCount || 0;
  const totalPages = Math.ceil(totalItems / pageSize);
  const canNextPage = page < totalPages;
  const canPreviousPage = page > 1;
  
  // Navigate through pages
  const nextPage = () => {
    if (canNextPage) {
      setPage(old => old + 1);
    }
  };
  
  const previousPage = () => {
    if (canPreviousPage) {
      setPage(old => old - 1);
    }
  };
  
  return {
    data: data?.data || [],
    isLoading,
    isError,
    error,
    page,
    setPage,
    pageSize,
    setPageSize: (newPageSize: number) => {
      setPageSize(newPageSize);
      setPage(1); // Reset to first page when changing page size
    },
    totalPages,
    totalItems,
    canNextPage,
    canPreviousPage,
    nextPage,
    previousPage,
  };
}

/**
 * A hook for handling infinite scrolling with React Query
 */
export function useInfinitePaginatedQuery<T>(
  queryKey: string,
  fetchFunction: (page: number, pageSize: number) => Promise<{ data: T[], totalCount: number }>,
  options: PaginationOptions = {}
) {
  const [page, setPage] = useState(options.initialPage || 1);
  const [allData, setAllData] = useState<T[]>([]);
  const pageSize = options.pageSize || 10;
  
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [queryKey, { page, pageSize }],
    queryFn: () => fetchFunction(page, pageSize),
    meta: {
      onSuccess: (newData: { data: T[], totalCount: number }) => {
        if (page === 1) {
          setAllData(newData.data);
        } else {
          setAllData(prev => [...prev, ...newData.data]);
        }
      }
    },
  });
  
  const totalItems = data?.totalCount || 0;
  const totalPages = Math.ceil(totalItems / pageSize);
  const canLoadMore = page < totalPages;
  
  const loadMore = () => {
    if (canLoadMore && !isLoading) {
      setPage(prev => prev + 1);
    }
  };
  
  const reset = () => {
    setPage(1);
    setAllData([]);
  };
  
  return {
    data: allData,
    isLoading,
    isError,
    error,
    loadMore,
    canLoadMore,
    reset,
    totalItems,
  };
}
