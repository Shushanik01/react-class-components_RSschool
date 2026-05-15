import { useState, useEffect, useRef } from 'react';
import { getAllData, getData } from '../services/api';
import type { UsePaginationReturn, Item } from '../types';
import { useSearchParams } from 'react-router';
const ITEMS_PER_PAGE = 20;
const LOADING_DELAY_MS = 500;

export const usePagination = (
  searchTerm: string,
  initialPage = 1
): UsePaginationReturn => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const isFirstRender = useRef(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const pageUrl = Number(searchParams.get('page') || 1);
  const [currentPage, setCurrentPage] = useState<number>(
    pageUrl || initialPage
  );

  useEffect(() => {
    setSearchParams({ page: currentPage.toString() });
  }, [currentPage, setSearchParams]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    const loadItems = async () => {
      setLoading(true);
      setError(null);

      await new Promise((resolve) => setTimeout(resolve, LOADING_DELAY_MS));

      try {
        let results: Item[], count: number;

        if (searchTerm.trim()) {
          const item = await getData(searchTerm.trim());
          results = [item];
          count = 1;
        } else {
          const offset = (currentPage - 1) * ITEMS_PER_PAGE;
          const fetchData = await getAllData(offset, ITEMS_PER_PAGE);
          results = fetchData.results;
          count = fetchData.count;
        }

        setItems(results);
        setTotalCount(count);
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
