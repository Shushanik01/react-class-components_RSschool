import { useState, useEffect } from 'react';
import { getAllData } from '../services/api';
import type { UsePaginationReturn, Pokemon } from '../types';

const ITEMS_PER_PAGE = 20;
const LOADING_DELAY_MS = 500;

export const usePagination = (searchTerm: string): UsePaginationReturn => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [items, setItems] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);

  useEffect(() => {
    const loadItems = async () => {
      setLoading(true);
      setError(null);

      await new Promise((resolve) => setTimeout(resolve, LOADING_DELAY_MS));

      try {
        const offset = (currentPage - 1) * ITEMS_PER_PAGE;

        const fetchData = await getAllData(offset, ITEMS_PER_PAGE);

        setItems(fetchData.results);
        setTotalCount(fetchData.count);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };
    loadItems();
  }, [currentPage, searchTerm]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);
  const resetPage = () => setCurrentPage(1);

  return {
    items,
    loading,
    error,
    currentPage,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
    resetPage,
  };
};
