import { ChevronDown, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
interface MultiSelectDropdownProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

export default function MultiSelectDropdown({
  options,
  selected,
  onChange,
}: MultiSelectDropdownProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (option: string) => {
    const isSelected = selected.includes(option);
    const newSelected = isSelected
      ? selected.filter((o) => o !== option)
      : [...selected, option];
    onChange(newSelected);
  };

  const removeOption = (option: string) => {
    onChange(selected.filter((o) => o !== option));
  };

  return (
    <div className="relative w-full max-w-md" ref={containerRef}>
      {/* 選擇框 + 下拉按鈕 */}
      <div
        className="flex items-center justify-between md:w-[250px] min-h-[32px] px-2 py-1 border border-gray-300 rounded bg-white text-sm cursor-pointer"
        onClick={() => setDropdownOpen((prev) => !prev)}
      >
        <div className="flex flex-wrap items-center gap-1">
          {selected.length === 0 ? (
            <span className="text-sm text-gray-500">請選擇類別</span>
          ) : (
            selected.map((item) => (
              <span
                key={item}
                onClick={(e) => {
                  e.stopPropagation();
                  removeOption(item);
                }}
                className="flex items-center px-1 text-xs bg-[#f4f4f5] text-[#909399] border border-[#e9e9eb] rounded-sm"
              >
                {item}
                <X
                  size={15}
                  className="ml-1 text-[#909399] hover:text-blue-700"
                />
              </span>
            ))
          )}
        </div>
        {/* 展開按鈕 */}
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transform transition-transform duration-300 origin-center ${
            dropdownOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </div>

      {/* 下拉選單 */}
      {dropdownOpen && (
        <div className="absolute z-11 w-full mt-1 bg-white border border-gray-300 rounded shadow max-h-60 overflow-auto">
          {options.length === 0 ? (
            <div className="px-3 py-2 text-gray-500">無選項</div>
          ) : (
            <ul>
              {options.map((option) => (
                <li
                  key={option}
                  onClick={() => toggleOption(option)}
                  className={`px-3 py-2 cursor-pointer hover:bg-blue-50 ${
                    selected.includes(option) ? "bg-blue-100 text-blue-700" : ""
                  }`}
                >
                  {option}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
