// components/Pagination.tsx
import { ChevronLeft, ChevronRight } from "lucide-react";
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;

  pageSize: number;
  pageSizeOptions: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (newSize: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  pageSizeOptions,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  return (
    <div className="mt-4 text-sm flex text-gray-500 justify-between items-center ">
      {/* 跳頁下拉 */}
      <label className="flex items-center gap-2 hidden md:flex">
        跳到：
        <select
          className="inputBorder p-1"
          value={currentPage}
          onChange={(e) => onPageChange(Number(e.target.value))}
        >
          {Array.from({ length: totalPages }).map((_, idx) => (
            <option key={idx} value={idx + 1}>
              第 {idx + 1}頁
            </option>
          ))}
        </select>
      </label>

      {/* 分頁控制器 */}
      {totalPages > 1 && (
        <div className="flex flex-wrap items-center">
          {/* 上一頁 */}
          <button
            className="cursor-pointer transition-transform duration-200 text-[#5e6d82]
      hover:-translate-x-1
      disabled:opacity-50 disabled:cursor-not-allowed
      disabled:hover:translate-x-0 disabled:transform-none"
            disabled={currentPage === 1}
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          >
            <ChevronLeft />
          </button>

          {/* 當前頁面資訊 */}
          <div className="px-3">
            <span className="inline-block min-w-5 text-center font-medium text-[#409eff] pr-1">
              {currentPage}
            </span>
            /
            <span className="font-medium text-[#5e6d82] pl-1">
              {totalPages}
            </span>
          </div>

          {/* 下一頁 */}
          <button
            className="cursor-pointer transition-transform duration-200 text-[#5e6d82]
      hover:translate-x-1
      disabled:opacity-50 disabled:cursor-not-allowed
      disabled:hover:translate-x-0 disabled:transform-none"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          >
            <ChevronRight />
          </button>
        </div>
      )}

      {/* 筆數選擇 */}
      <div className="flex items-center gap-2 hidden md:flex">
        <div className="pr-2">
          共:
          <span className="font-medium text-[#5e6d82] px-2">{totalItems}</span>
          筆
        </div>
        /<label>每頁：</label>
        <select
          className="inputBorder p-1"
          value={pageSize}
          onChange={(e) => onPageSizeChange(parseInt(e.target.value, 10))}
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size} 筆
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
