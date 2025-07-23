import { create } from "zustand";
import type { Item } from "../types";

// 價格排序參數
type SortOrder = "asc" | "desc" | "none";

// 篩選條件結構
interface Filters {
  name?: string;
  categories: string[];
  minPrice: number;
  maxPrice: number;
  inStockOnly: boolean;
}

interface ItemStore {
  allItems: Item[]; // 全部資料
  filteredItems: Item[]; // 篩選後資料（未分頁）
  visibleItems: Item[]; // 當頁資料
  pageSize: number; // 每頁筆數（桌機）
  currentPage: number; // 當前頁碼
  sortOrder: SortOrder; // 排序
  filters: Filters; // 篩選條件
  isLoading: boolean; // 資料是否正在載入中
  mobileOpen: boolean; // 手機篩選面板開關

  // setter 函數
  setAllItems: (items: Item[]) => void;
  setFilters: (filters: Filters) => void;
  setPageSize: (size: number) => void;
  setCurrentPage: (page: number) => void;
  setSortOrder: (order: SortOrder) => void;
  setLoading: (loading: boolean) => void;
  setMobileOpen: (open: boolean) => void;

  // 重新計算 filtered 和 visible 的資料
  recompute: () => void;
}

export const useItemStore = create<ItemStore>((set, get) => ({
  // 初始狀態
  allItems: [],
  filteredItems: [],
  visibleItems: [],
  pageSize: 10,
  currentPage: 1,
  sortOrder: "none",
  mobileOpen: false,
  filters: {
    name: "",
    categories: [],
    minPrice: 0,
    maxPrice: Infinity,
    inStockOnly: false,
  },
  isLoading: false,

  // 設定原始資料
  setAllItems: (items) => {
    set({ allItems: items });
    get().recompute();
  },

  // 設定篩選條件
  setFilters: (filters) => {
    set({ filters, currentPage: 1 });
    get().recompute();
  },

  // 筆數更變
  setPageSize: (size) => {
    set({ pageSize: size, currentPage: 1 });
    get().recompute();
  },

  // 頁碼更變
  setCurrentPage: (page) => {
    set({ currentPage: page });
    get().recompute();
  },

  // 排序
  setSortOrder: (order) => {
    set({ sortOrder: order, currentPage: 1 });
    get().recompute();
  },

  // 載入切換
  setLoading: (loading) => set({ isLoading: loading }),

  // 手機篩選面板開關
  setMobileOpen: (open) => set({ mobileOpen: open }),

  // 主邏輯：過濾 + 排序 + 分頁
  recompute: () => {
    const { allItems, pageSize, currentPage, sortOrder, filters } = get();

    // 篩選條件
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

    // 價格排序
    if (sortOrder === "asc") items.sort((a, b) => a.price - b.price);
    if (sortOrder === "desc") items.sort((a, b) => b.price - a.price);

    // 是否為手機
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const start = (currentPage - 1) * pageSize;
    const visible = isMobile
      ? items // 手機版直接顯示所有資料
      : items.slice(start, start + pageSize); // 桌機分頁顯示

    // 更新狀態
    set({ filteredItems: items, visibleItems: visible });
  },
}));
