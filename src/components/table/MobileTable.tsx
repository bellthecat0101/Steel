import { useCallback, useEffect, useRef, useState } from "react";
import type { Item } from "../../types";
import Loading from "../common/Loading";
import ScrollToTop from "../common/ScrollToTop";
const BATCH_SIZE = 20;
export default function MobileTable({ items }: { items: Item[] }) {
  const [visibleItems, setVisibleItems] = useState<Item[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(() => {
    if (!hasMore) return;

    setVisibleItems((prev) => {
      const startIndex = prev.length;
      const endIndex = startIndex + BATCH_SIZE;

      const nextBatch = items.slice(startIndex, endIndex);
      const newVisible = [...prev, ...nextBatch];

      //是否載完
      if (newVisible.length >= items.length) {
        setHasMore(false);
      }

      return newVisible;
    });
  }, [items, hasMore]);

  // items 改變，重置狀態
  useEffect(() => {
    setVisibleItems([]);
    setHasMore(true);
  }, [items]);

  // 初始載入第一批
  useEffect(() => {
    loadMore();
  }, [items, loadMore]);

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
      {visibleItems.map((item, idx) => (
        <div
          key={idx}
          className="p-2 bg-white text-sm grid grid-cols-2 gap-y-2"
        >
          <div>
            <span className="text-[#909399]">商品名稱：</span> {item.name}
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
      ))}

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
