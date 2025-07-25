import { useItemStore } from "../../store/itemStore";
export default function SetOrder() {
  const { sortOrder, setSortOrder } = useItemStore();
  return (
    <>
      {/* 電腦版 ▲▼ 按鈕 */}
      <div className="hidden md:flex flex-col px-2">
        <button
          className={`text-xs cursor-pointer hover:text-blue-500 ${
            sortOrder === "asc" ? "text-blue-600 font-bold" : "text-gray-400"
          }`}
          onClick={() => setSortOrder("asc")}
          disabled={sortOrder === "asc"}
        >
          ▲
        </button>
        <button
          className={`text-xs cursor-pointer hover:text-blue-500 ${
            sortOrder === "desc" ? "text-blue-600 font-bold" : "text-gray-400"
          }`}
          onClick={() => setSortOrder("desc")}
          disabled={sortOrder === "desc"}
        >
          ▼
        </button>
      </div>

      {/* 手機版 價格升序 / 價格降序 */}
      <div className="flex md:hidden gap-2 ">
        <button
          className={`mbButton ${
            sortOrder === "asc" ? "bg-blue-500 text-white" : " text-gray-600"
          }`}
          onClick={() => setSortOrder("asc")}
        >
          價格升序
        </button>
        <button
          className={`mbButton ${
            sortOrder === "desc" ? "bg-blue-500 text-white" : " text-gray-600"
          }`}
          onClick={() => setSortOrder("desc")}
        >
          價格降序
        </button>
      </div>
    </>
  );
}
