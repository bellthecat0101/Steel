import type { Item } from "../types";

export function useFiltering(
  items: Item[],
  pageSize: number,
  setFilteredItems: React.Dispatch<React.SetStateAction<Item[]>>,
  setVisibleItems: React.Dispatch<React.SetStateAction<Item[]>>,
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>
) {
  const handleFilter = (filters: {
    name?: string;
    categories: string[];
    minPrice: number;
    maxPrice: number;
    inStockOnly: boolean;
  }) => {
    const { name = "", categories, minPrice, maxPrice, inStockOnly } = filters;
    const keyword = name.trim().toLowerCase();

    let result = items.filter((item) => {
      const matchName = item.name.toLowerCase().includes(keyword);
      const matchCategory =
        categories.length === 0 || categories.includes(item.category);
      const matchPrice = item.price >= minPrice && item.price <= maxPrice;
      const matchStock = !inStockOnly || item.inStock;
      return matchName && matchCategory && matchPrice && matchStock;
    });

    setFilteredItems(result);
    setVisibleItems(result.slice(0, pageSize));
    setCurrentPage(1);
  };

  return { handleFilter };
}
