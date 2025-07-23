import { create } from "zustand";
import type { Item } from "../types";

type SortOrder = "asc" | "desc" | "none";

interface Filters {
  name?: string;
  categories: string[];
  minPrice: number;
  maxPrice: number;
  inStockOnly: boolean;
}

interface ItemStore {
  allItems: Item[];
  filteredItems: Item[];
  visibleItems: Item[];
  pageSize: number;
  currentPage: number;
  sortOrder: SortOrder;
  filters: Filters;
  isLoading: boolean;
  // setters
  setAllItems: (items: Item[]) => void;
  setFilters: (filters: Filters) => void;
  setPageSize: (size: number) => void;
  setCurrentPage: (page: number) => void;
  setSortOrder: (order: SortOrder) => void;
  setLoading: (loading: boolean) => void;
  // recompute pipeline
  recompute: () => void;
}

export const useItemStore = create<ItemStore>((set, get) => ({
  allItems: [],
  filteredItems: [],
  visibleItems: [],
  pageSize: 10,
  currentPage: 1,
  sortOrder: "none",
  filters: {
    name: "",
    categories: [],
    minPrice: 0,
    maxPrice: Infinity,
    inStockOnly: false,
  },
  isLoading: false,

  setAllItems: (items) => {
    set({ allItems: items });
    get().recompute();
  },

  setFilters: (filters) => {
    set({ filters, currentPage: 1 });
    get().recompute();
  },

  setPageSize: (size) => {
    set({ pageSize: size, currentPage: 1 });
    get().recompute();
  },

  setCurrentPage: (page) => {
    set({ currentPage: page });
    get().recompute();
  },

  setSortOrder: (order) => {
    set({ sortOrder: order, currentPage: 1 });
    get().recompute();
  },
  setLoading: (loading) => set({ isLoading: loading }),
  recompute: () => {
    const { allItems, pageSize, currentPage, sortOrder, filters } = get();
    // filter
    let items = allItems.filter((item) => {
      const keyword = (filters.name ?? "").toLowerCase().trim();
      return (
        item.name.toLowerCase().includes(keyword) &&
        (filters.categories.length === 0 ||
          filters.categories.includes(item.category)) &&
        item.price >= filters.minPrice &&
        item.price <= filters.maxPrice &&
        (!filters.inStockOnly || item.inStock)
      );
    });

    // sort
    if (sortOrder === "asc") items.sort((a, b) => a.price - b.price);
    if (sortOrder === "desc") items.sort((a, b) => b.price - a.price);
    // determine if mobile
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const start = (currentPage - 1) * pageSize;
    const visible = isMobile
      ? items // 顯示所有資料
      : items.slice(start, start + pageSize);

    set({ filteredItems: items, visibleItems: visible });
  },
}));
