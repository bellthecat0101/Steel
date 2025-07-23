import { ArrowUp } from "lucide-react"; // 你也可以換成別的 icon
import { useEffect, useState } from "react";

export default function ScrollToTopButton() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShow(window.scrollY > 300);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-10 left-1/2 transform -translate-x-1/2 z-50 w-15 h-15 md:hidden transition-opacity duration-300 ease-in-out 
        flex justify-center items-center rounded-full bg-gray-300/50 text-gray-700  hover:bg-gray-300
        ${
          show
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      aria-label="Scroll to top"
    >
      <ArrowUp size={25} />
    </button>
  );
}
