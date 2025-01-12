import { useState, useMemo } from 'react';

export function usePagination<T>({ 
  data, 
  itemsPerPage = 10 
}: {
  data: T[];
  itemsPerPage?: number;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(itemsPerPage);

  // Computed values
  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage);

  // Paginated data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, rowsPerPage]);

  // Pagination handlers
  const goToPage = (page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(validPage);
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return {
    currentPage,
    totalPages,
    rowsPerPage,
    paginatedData,
    totalItems,
    setRowsPerPage,
    goToPage,
    nextPage,
    prevPage
  };
}