import { useEffect, useState } from "react";
import { useItemStore } from "../../store/itemStore";
import Loading from "../common/Loading";
import DesktopTable from "./DesktopTable";
import MobileTable from "./MobileTable";

export default function RwdTable() {
  const { isLoading } = useItemStore();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  if (isLoading) {
    return (
      <div className="h-[500px] flex justify-center items-center text-gray-500">
        <Loading />
      </div>
    );
  }

  return isMobile ? <MobileTable /> : <DesktopTable />;
}
