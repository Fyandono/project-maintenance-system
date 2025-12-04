// src/core/hooks/useDebounce.js
import { useState, useEffect } from 'react';

export default function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        // Set up a timer to update the debounced value after the delay
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Cleanup function: If value changes before the delay, clear the old timer
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}