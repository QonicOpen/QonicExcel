import React from "react";
import {MagnifyingGlassIcon} from "@heroicons/react/24/outline";

interface SearchPropertyProps {
    onSearch: (searchTerm: string) => void;
    searchTerm: string;
}

export const SearchProperty: React.FC<SearchPropertyProps> = ({onSearch, searchTerm}: SearchPropertyProps) => {
    return (
        <div className="flex items-center text-gray-400 py-1 px-2 border border-gray-200 rounded-sm">
            <MagnifyingGlassIcon className="size-6"/>
            <input
                type="text"
                placeholder="Search"
                className="w-full shadow-none ring-0 border-0 outline-none hover:border-0 focus:border-0 hover:ring-0 focus:ring-0"
                value={searchTerm}
                onChange={(e) => onSearch(e.target.value)}
            />
        </div>
    );
}