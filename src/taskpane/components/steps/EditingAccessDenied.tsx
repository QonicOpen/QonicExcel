import React from 'react';
import {ExclamationTriangleIcon, InformationCircleIcon} from "@heroicons/react/24/outline";

export const EditingAccessDenied: React.FC = () => {
    return (
        <div>
            <div className="flex content-center mt-5 mb-2">
                <ExclamationTriangleIcon className="size-5 text-red-500 mr-2"/>
                <h1 className="font-semibold">Access denied for editing</h1>
            </div>

            <p className="text-qonic-gray-400">
                You currently don’t have permission to edit this model, so your changes can’t be pushed to Qonic.
            </p>
        </div>
    );
};