// src/hooks/useDebounce.js
import { useState, useEffect } from "react";

/**
 * Hook debounce để trì hoãn việc cập nhật giá trị
 * @param {any} value - Giá trị cần debounce
 * @param {number} delay - Thời gian delay (ms)
 * @returns {any} - Giá trị sau khi debounce
 */
export const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        // Set timeout để delay việc cập nhật
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Cleanup function để clear timeout khi value thay đổi
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

/**
 * Hook tạo debounced callback
 * @param {Function} callback - Function cần debounce
 * @param {number} delay - Thời gian delay (ms)
 * @param {Array} deps - Dependencies
 * @returns {Function} - Debounced function
 */
export const useDebouncedCallback = (callback, delay, deps = []) => {
    const [debounceTimer, setDebounceTimer] = useState(null);

    const debouncedCallback = (...args) => {
        // Clear timeout cũ nếu có
        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }

        // Tạo timeout mới
        const newTimer = setTimeout(() => {
            callback(...args);
        }, delay);

        setDebounceTimer(newTimer);
    };

    // Cleanup khi component unmount
    useEffect(() => {
        return () => {
            if (debounceTimer) {
                clearTimeout(debounceTimer);
            }
        };
    }, [debounceTimer]);

    return debouncedCallback;
};
