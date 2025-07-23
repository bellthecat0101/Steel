import { useEffect } from "react";
import Filter from "./components/filter/FilterPanel";
import RwdTable from "./components/table/RwdTable";
import { useItemStore } from "./store/itemStore";

export default function App() {
  const { setAllItems, setLoading } = useItemStore();

  useEffect(() => {
    setLoading(true);

    // 模擬載入時間
    const MIN_LOADING_TIME = 600;
    const startTime = Date.now();

    fetch(import.meta.env.BASE_URL + "data/items.json")
      .then((res) => res.json())
      .then((data) => {
        const elapsed = Date.now() - startTime;
        const delay = Math.max(0, MIN_LOADING_TIME - elapsed);

        setTimeout(() => {
          setAllItems(data);
          setLoading(false);
        }, delay);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-3">
      <div className="overflow-x-auto rounded shadow-[0_2px_12px_0_rgba(0,0,0,0.1)] p-5 border border-[#ebebeb]">
        <h1 className="hidden md:inline-block text-[25px]">商品清單</h1>
        {/*篩選*/}
        <Filter />
        {/*表單*/}
        <RwdTable />
      </div>
    </div>
  );
}
