// src/hooks/useFilterInputs.ts
import { useState } from "react";

export function useFilterInputs() {
  const [name, setName] = useState("");
  const [minPriceInput, setMinPriceInput] = useState("");
  const [maxPriceInput, setMaxPriceInput] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);

  return {
    name,
    setName,
    minPriceInput,
    setMinPriceInput,
    maxPriceInput,
    setMaxPriceInput,
    selectedCategories,
    setSelectedCategories,
    inStockOnly,
    setInStockOnly,
  };
}
