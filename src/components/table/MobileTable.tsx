import { useCallback, useEffect, useRef, useState } from "react";
import { useItemStore } from "../../store/itemStore";
import type { Item } from "../../types";
import Loading from "../common/Loading";
import ScrollToTop from "../common/ScrollToTop";
const BATCH_SIZE = 20;
export default function MobileTable() {
  const { visibleItems } = useItemStore();
  const [tableItems, settableItems] = useState<Item[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(() => {
    if (!hasMore) return;

    settableItems((prev) => {
      const startIndex = prev.length;
      const endIndex = startIndex + BATCH_SIZE;

      const nextBatch = visibleItems.slice(startIndex, endIndex);
      const newVisible = [...prev, ...nextBatch];

      //是否載完
      if (newVisible.length >= visibleItems.length) {
        setHasMore(false);
      }

      return newVisible;
    });
  }, [visibleItems, hasMore]);

  // items 改變，重置狀態
  useEffect(() => {
    settableItems([]);
    setHasMore(true);
  }, [visibleItems]);

  // 初始載入第一批
  useEffect(() => {
    loadMore();
  }, [visibleItems, loadMore]);

  // 無限載入
  useEffect(() => {
    if (!sentinelRef.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        loadMore();
      }
    });

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [loadMore]);
  return (
    <div className="divide-y divide-[#ebeef5] pt-[50px]">
      {tableItems.length === 0 ? (
        <div className="text-center py-20 text-gray-500 text-sm h-[calc(100vh-50px)]">
          無搜尋結果
        </div>
      ) : (
        tableItems.map((item, idx) => (
          <div
            key={idx}
            className="p-2 bg-white text-sm grid grid-cols-2 gap-y-2"
          >
            <div>
              <span className="text-[#909399]">商品：</span> {item.name}
            </div>
            <div>
              <span className="text-[#909399]">類別：</span> {item.category}
            </div>
            <div>
              <span className="text-[#909399]">價格：</span>{" "}
              <span className="font-bold">${item.price}</span>
            </div>
            <div>
              <span className="text-[#909399]">庫存：</span>{" "}
              <span
                className={item.inStock ? "text-green-600" : "text-[#fe6c6f]"}
              >
                {item.inStock ? "有現貨" : "缺貨"}
              </span>
            </div>
          </div>
        ))
      )}

      {hasMore && (
        <div
          ref={sentinelRef}
          className="text-center py-4 text-[#909399] text-sm"
        >
          <Loading />
        </div>
      )}
      <ScrollToTop />
    </div>
  );
}
