import { useEffect, useRef } from "react";
import { FixedSizeList as List } from "react-window";
import { useItemStore } from "../../store/itemStore";
import Pagination from "../common/Pagination";
import SetOrder from "./SetSort";
// 頁數 小於 500 原生dom
// 頁數 大於 500 react window
const ROW_HEIGHT = 45;
const USE_VIRTUAL_SCROLL = 500;

export default function DesktopTable() {
  const {
    filteredItems,
    visibleItems,
    pageSize,
    currentPage,
    setPageSize,
    setCurrentPage,
  } = useItemStore();
  const PAGE_SIZE_OPTIONS = [10, 20, 50, 100, 500, 1000, 5000];
  const outerRef = useRef<HTMLDivElement>(null);
  const totalPages = Math.ceil(filteredItems.length / pageSize);
  const useVirtual = visibleItems.length >= USE_VIRTUAL_SCROLL;
  useEffect(() => {
    outerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [visibleItems]);

  const Row = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => {
    const item = visibleItems[index];
    return (
      <div
        style={style}
        className="px-4 py-1 border-b border-[#ebeef5] text-sm grid grid-cols-4 items-center hover:bg-[#eaf2ff] bg-white"
      >
        <div>{item.name}</div>
        <div>{item.category}</div>
        <div className="font-bold">${item.price}</div>
        <div className={item.inStock ? "text-green-600" : "text-[#fe6c6f]"}>
          {item.inStock ? "是" : "否"}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="border border-[#ebebeb] rounded overflow-hidden">
        {/* 表頭 */}
        <div className="grid grid-cols-4 bg-[#f5f7fa] text-sm font-medium text-[#606266] px-4 py-2 sticky top-0 z-10">
          <div className="flex items-center justify-start">商品名稱</div>
          <div className="flex items-center justify-start">類別</div>
          <div className="flex items-center justify-start gap-2">
            價格 <SetOrder />
          </div>
          <div className="flex items-center justify-start">有庫存</div>
        </div>

        {visibleItems.length === 0 ? (
          <div className="h-[500px] flex items-center justify-center text-gray-500">
            無搜尋結果
          </div>
        ) : useVirtual ? (
          <List
            height={450}
            itemCount={visibleItems.length}
            itemSize={ROW_HEIGHT}
            width="100%"
            outerRef={outerRef}
          >
            {Row}
          </List>
        ) : (
          <div className="h-[450px] overflow-y-auto" ref={outerRef}>
            {visibleItems.map((item, index) => (
              <div
                key={index}
                className="px-4 py-3 border-b border-[#ebeef5] text-sm grid grid-cols-4 items-center hover:bg-[#eaf2ff] bg-white"
              >
                <div>{item.name}</div>
                <div>{item.category}</div>
                <div className="font-bold">${item.price}</div>
                <div
                  className={item.inStock ? "text-green-600" : "text-[#fe6c6f]"}
                >
                  {item.inStock ? "是" : "否"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/*表單*/}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredItems.length}
        pageSize={pageSize}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        onPageChange={setCurrentPage}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setCurrentPage(1);
        }}
      />
    </>
  );
}
