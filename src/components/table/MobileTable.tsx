import { useCallback, useEffect, useRef, useState } from "react";
import { useItemStore } from "../../store/itemStore";
import type { Item } from "../../types";
import Loading from "../common/Loading";
import ScrollToTop from "../common/ScrollToTop";

const BATCH_SIZE = 20;

export default function MobileTable() {
  const { visibleItems } = useItemStore();
  const [tableItems, setTableItems] = useState<Item[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [showEmpty, setShowEmpty] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(() => {
    if (!hasMore || isLoadingMore) return;

    setIsLoadingMore(true);
    setTableItems((prev) => {
      const startIndex = prev.length;
      const endIndex = startIndex + BATCH_SIZE;
      const nextBatch = visibleItems.slice(startIndex, endIndex);
      const newVisible = [...prev, ...nextBatch];

      if (newVisible.length >= visibleItems.length) {
        setHasMore(false);
      }

      return newVisible;
    });
    setIsLoadingMore(false);
  }, [visibleItems, hasMore, isLoadingMore]);

  // 資料變動時初始化
  useEffect(() => {
    setTableItems([]);
    setHasMore(true);
    setShowEmpty(false);
  }, [visibleItems]);

  // 首次載入
  useEffect(() => {
    if (visibleItems.length > 0) {
      loadMore();
    }
  }, [visibleItems, loadMore]);

  // Intersection Observer 處理
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        loadMore();
      }
    });

    observer.observe(sentinel);
    return () => {
      if (sentinel) observer.unobserve(sentinel);
      observer.disconnect();
    };
  }, [loadMore, hasMore]);

  return (
    <div className="divide-y divide-[#ebeef5] pt-[50px]">
      {tableItems.length === 0 && showEmpty ? (
        <div className="text-center py-20 text-gray-500 text-sm h-[calc(100vh-50px)]">
          無搜尋結果
        </div>
      ) : (
        tableItems.map((item, idx) => (
          <div
            key={`${idx}-${item.name}`}
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
              <span className="text-[#909399]">有庫存：</span>{" "}
              <span
                className={item.inStock ? "text-green-600" : "text-[#fe6c6f]"}
              >
                {item.inStock ? "是" : "否"}
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
