import React from 'react';
import {ExclamationTriangleIcon, InformationCircleIcon} from "@heroicons/react/24/outline";

export const NoFilterResults: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center">
            <div className="bg-gray-100 size-10 rounded-full flex items-center justify-center mt-8 mb-3">
                <ExclamationTriangleIcon className="size-5 text-red-500"/>
            </div>

            <p className="text-qonic-gray-400 text-center">
                No results found for applied filters. Please go back and adjust your filters.
            </p>
        </div>
    );
};