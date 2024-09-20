import React from 'react';
import {InformationCircleIcon} from "@heroicons/react/24/outline";

export const NoProjectSelected: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center">
            <div className="bg-gray-100 size-10 rounded-full flex items-center justify-center mt-6 mb-3">
                <InformationCircleIcon className="h-6 w-6 text-primary-500 align-middle"/>
            </div>

            <p className="text-qonic-gray-400 text-lg px-8 text-center">
                Select a project to view its models.
            </p>
        </div>
    );
};