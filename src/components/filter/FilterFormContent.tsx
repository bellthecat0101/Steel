import { useState } from "react";
import { useItemStore } from "../../store/itemStore";
import MultiSelectDropdown from "../common/MultiSelectDropdown";
// 電腦與手機 篩選器相同內容
export default function FilterFormContent() {
  const { allItems, setMobileOpen, setFilters } = useItemStore();

  const categories = Array.from(new Set(allItems.map((item) => item.category)));
  const [form, setForm] = useState({
    name: "",
    minPrice: "",
    maxPrice: "",
    selectedCategories: [] as string[],
    inStockOnly: false,
  });
  const onApplyFilters = () => {
    setFilters({
      name: form.name.trim(),
      categories: form.selectedCategories,
      minPrice: parseFloat(form.minPrice) || 0,
      maxPrice: parseFloat(form.maxPrice) || Infinity,
      inStockOnly: form.inStockOnly,
    });
    setMobileOpen?.(false);
  };

  const onResetFilters = () => {
    const resetForm = {
      name: "",
      minPrice: "",
      maxPrice: "",
      selectedCategories: [] as string[],
      inStockOnly: false,
    };
    setForm(resetForm);

    setFilters({
      name: "",
      categories: [],
      minPrice: 0,
      maxPrice: Infinity,
      inStockOnly: false,
    });
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center flex-wrap lg:flex-nowrap gap-4 w-full md:min-w-full text-gray-500">
      {/* 名稱 */}
      <div className="flex flex-col gap-1 w-full md:w-auto">
        <label className="text-sm text-gray-600">名稱</label>
        <input
          type="text"
          value={form.name}
          placeholder="搜尋關鍵字"
          onChange={(e) =>
            setForm((prev) => ({ ...prev, name: e.target.value }))
          }
          className="inputStyle"
        />
      </div>

      {/* 類別 */}
      <div className="flex flex-col gap-1 w-full md:w-auto">
        <label className="text-sm text-gray-600">類別</label>
        <MultiSelectDropdown
          options={categories}
          selected={form.selectedCategories}
          onChange={(newSelected) =>
            setForm((prev) => ({ ...prev, selectedCategories: newSelected }))
          }
        />
      </div>

      {/* 價格區間 */}
      <div className="flex flex-col gap-1 w-full md:w-auto">
        <label className="text-sm text-gray-600">價格區間</label>
        <div className="flex gap-2">
          <input
            type="text"
            inputMode="numeric"
            placeholder="最低"
            value={form.minPrice}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                minPrice: e.target.value.trim(),
              }))
            }
            className="inputStyle w-full md:w-[100px]"
          />
          <span className="self-center">-</span>
          <input
            type="text"
            inputMode="numeric"
            placeholder="最高"
            value={form.maxPrice}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                maxPrice: e.target.value.trim(),
              }))
            }
            className="inputStyle w-full md:w-[100px]"
          />
        </div>
      </div>

      {/* 庫存 */}
      <div className="flex gap-2 items-center w-full md:w-[100px] pt-1 text-sm md:pt-5">
        <input
          type="checkbox"
          className="accent-blue-500 w-4 h-4"
          checked={form.inStockOnly}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              inStockOnly: e.target.checked,
            }))
          }
        />
        <span>有庫存</span>
      </div>

      {/* 按鈕 */}
      <div className="md:pt-5 flex justify-end">
        {/* 搜尋 */}
        <button
          type="button"
          onClick={onApplyFilters}
          className="border rounded md:text-sm text-gray-700 border-gray-300 bg-blue-400 text-white px-2 py-1 hover:bg-blue-600 cursor-pointer mr-3"
        >
          搜尋
        </button>

        {/* 清除 */}
        <button
          type="button"
          onClick={onResetFilters}
          className="border rounded md:text-sm text-gray-700 border-gray-300 bg-white px-2 py-1 hover:bg-blue-600 cursor-pointer"
        >
          清除
        </button>
      </div>
    </div>
  );
}
