// src/components/SelectForm/index.jsx
import { memo, useState, useRef, useEffect } from "react";
import { ChevronDown, Search, Loader2 } from "lucide-react";

const SelectForm = ({
    label,
    options = [],
    searchResults = [],
    selectedValue,
    onSelectionChange,
    onSearch,
    loading = false,
    placeholder,
    displayField,
    valueField,
    disabled = false,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [showSearchResults, setShowSearchResults] = useState(false);
    const dropdownRef = useRef(null);
    const searchInputRef = useRef(null);

    // Đóng dropdown khi click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
                setShowSearchResults(false);
                setSearchTerm("");
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Focus vào search input khi mở dropdown
    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isOpen]);

    // Xử lý tìm kiếm
    const handleSearch = (value) => {
        setSearchTerm(value);
        setShowSearchResults(!!value.trim());
        if (onSearch) {
            onSearch(value);
        }
    };

    // Xử lý chọn option
    const handleSelect = (option) => {
        onSelectionChange(option);
        setIsOpen(false);
        setShowSearchResults(false);
        setSearchTerm("");
    };

    // Reset selection
    const handleReset = () => {
        onSelectionChange(null);
        setIsOpen(false);
        setShowSearchResults(false);
        setSearchTerm("");
    };

    // Lấy danh sách hiển thị
    const getDisplayOptions = () => {
        if (showSearchResults && searchResults.length > 0) {
            return searchResults;
        }
        return options;
    };

    // Lấy text hiển thị
    const getDisplayText = () => {
        if (selectedValue && displayField) {
            return selectedValue[displayField];
        }
        return `--Chọn ${label}`;
    };

    return (
        <div className="flex flex-col gap-2 flex-1 relative" ref={dropdownRef}>
            <label className="font-medium text-gray-700">{label}</label> {/* Dropdown Button */}
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={`
                    flex items-center justify-between w-full p-2 border rounded-md outline-none
                    transition-colors duration-200
                    ${
                        disabled
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                            : "bg-white hover:border-blue-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 border-gray-300"
                    }
                    ${isOpen ? "border-blue-500 ring-1 ring-blue-500" : ""}
                `}
            >
                <span className={`truncate ${!selectedValue ? "text-gray-500" : "text-gray-900"}`}>
                    {getDisplayText()}
                </span>
                <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""} ${
                        disabled ? "text-gray-400" : "text-gray-600"
                    }`}
                />
            </button>
            {/* Dropdown Menu */}
            {isOpen && !disabled && (
                <div className="absolute top-full left-0 right-0 z-50 bg-white border border-gray-200 rounded-md shadow-lg max-h-64 overflow-hidden">
                    {/* Search Input */}
                    <div className="p-2 border-b border-gray-100">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={searchTerm}
                                onChange={(e) => handleSearch(e.target.value)}
                                placeholder={placeholder || `Tìm kiếm ${label.toLowerCase()}...`}
                                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded focus:outline-none focus:border-blue-500"
                            />
                            {loading && (
                                <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-500 animate-spin" />
                            )}
                        </div>
                    </div>

                    {/* Options List */}
                    <div className="max-h-48 overflow-y-auto">
                        {/* Reset Option */}
                        <button
                            type="button"
                            onClick={handleReset}
                            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 text-gray-500 border-b border-gray-100"
                        >
                            --Chọn {label}
                        </button>

                        {/* Loading State */}
                        {loading && (
                            <div className="px-3 py-2 text-sm text-gray-500 flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Đang tải...
                            </div>
                        )}

                        {/* No Results */}
                        {!loading && getDisplayOptions().length === 0 && searchTerm && (
                            <div className="px-3 py-2 text-sm text-gray-500">
                                Không tìm thấy kết quả cho "{searchTerm}"
                            </div>
                        )}

                        {/* Options */}
                        {!loading &&
                            getDisplayOptions().map((option) => {
                                const isSelected = selectedValue && selectedValue[valueField] === option[valueField];
                                return (
                                    <button
                                        key={option[valueField]}
                                        type="button"
                                        onClick={() => handleSelect(option)}
                                        className={`
                                        w-full px-3 py-2 text-left text-sm transition-colors duration-150
                                        ${
                                            isSelected
                                                ? "bg-blue-50 text-blue-700 font-medium"
                                                : "hover:bg-gray-50 text-gray-900"
                                        }
                                    `}
                                    >
                                        {option[displayField]}
                                    </button>
                                );
                            })}

                        {/* Search Results Info */}
                        {showSearchResults && searchResults.length > 0 && (
                            <div className="px-3 py-1 text-xs text-gray-500 bg-gray-50 border-t border-gray-100">
                                Tìm thấy {searchResults.length} kết quả
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default memo(SelectForm);
