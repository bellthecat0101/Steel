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
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
        setSearchTerm("");
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

  // 過濾選項根據搜尋字串
  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative w-full max-w-md" ref={containerRef}>
      {/* 標籤框 */}
      <div
        className="flex flex-wrap items-center md:w-[200px] min-h-[32px] px-2 py-1 border border-gray-300 rounded bg-white cursor-text text-sm"
        onClick={() => setDropdownOpen(true)}
      >
        {selected.map((item) => (
          <span
            key={item}
            className="flex items-center px-1 text-xs bg-[#f4f4f5] text-[#909399] border border-[#e9e9eb] rounded-sm mr-1 "
          >
            {item}
            <button
              type="button"
              className="ml-1 text-[#909399] cursor-pointer hover:text-blue-700"
              onClick={(e) => {
                e.stopPropagation();
                removeOption(item);
              }}
            >
              ✕
            </button>
          </span>
        ))}

        {/* 當選項全選時不顯示 input */}
        {selected.length < filteredOptions.length && (
          <input
            type="text"
            className="flex-1 min-w-[40px] h-5 outline-none bg-transparent placeholder:text-gray-500"
            placeholder={selected.length === 0 ? "搜尋類別（可複選）" : ""}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if (!dropdownOpen) setDropdownOpen(true);
            }}
            onFocus={() => setDropdownOpen(true)}
          />
        )}
      </div>

      {/* 下拉選單 */}
      {dropdownOpen && (
        <div className="absolute z-11 w-full mt-1 bg-white border border-gray-300 rounded shadow max-h-60 overflow-auto">
          {filteredOptions.length === 0 ? (
            <div className="px-3 py-2 text-gray-500">無符合條件的選項</div>
          ) : (
            <ul>
              {filteredOptions.map((option) => (
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
