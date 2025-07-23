import { Menu, X } from "lucide-react";
import { useItemStore } from "../../store/itemStore";
import SetOrder from "../table/SetSort";
import FilterFormContent from "./FilterFormContent";
// 電腦與手機 篩選器
export default function FilterPanel() {
  const { mobileOpen, setMobileOpen } = useItemStore();
  return (
    <>
      {/* 桌機版 */}
      <div className="hidden md:block w-full mb-4">
        <FilterFormContent />
      </div>
      {/* 手機版篩選按鈕 */}
      <div className="md:hidden w-full fixed top-0 left-0 bg-white shadow py-2 flex justify-between items-center px-2">
        <div>
          商品清單{" "}
          <span className="text-gray-400 text-xs">
            (電腦版拉成手機版請刷新載入)
          </span>
        </div>
        <div className="flex justify-end px-4">
          <SetOrder />
          <button onClick={() => setMobileOpen(true)} className="p-2 ">
            <Menu />
          </button>
        </div>
      </div>

      {/* 手機版 */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          mobileOpen
            ? "bg-black/70 pointer-events-auto opacity-100"
            : "bg-transparent pointer-events-none opacity-0"
        }`}
        onClick={() => setMobileOpen(false)}
      >
        <div
          className={`absolute top-0 right-0 h-full w-5/6 max-w-sm bg-white shadow-lg p-4 transform transition-transform duration-300 ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-700">商品篩選</h2>
            <button onClick={() => setMobileOpen(false)}>
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
          <FilterFormContent />
        </div>
      </div>
    </>
  );
}
