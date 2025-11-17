// src/components/common/SearchBar.jsx

import { useState } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import { useDebounce } from '../../hooks/useDebounce';

const SearchBar = ({
    placeholder = 'Search...',
    onSearch,
    className = '',
    debounceDelay = 500
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, debounceDelay);

    // Call onSearch when debounced value changes
    useState(() => {
        if (onSearch) {
            onSearch(debouncedSearchTerm);
        }
    }, [debouncedSearchTerm]);

    const handleClear = () => {
        setSearchTerm('');
        if (onSearch) {
            onSearch('');
        }
    };

    return (
        <div className={`relative ${className}`}>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10 pr-10"
                placeholder={placeholder}
            />
            {searchTerm && (
                <button
                    onClick={handleClear}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                    <FiX className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                </button>
            )}
        </div>
    );
};

export default SearchBar;