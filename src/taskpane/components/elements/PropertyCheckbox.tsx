import React from "react";
import {CheckCircleIcon as CheckedCircleIcon} from "@heroicons/react/24/solid";
import {CheckCircleIcon as UncheckedCircleIcon} from "@heroicons/react/24/outline";

interface PropertyCheckboxProps {
    label: string;
    value: boolean;
    onChange: (value: boolean) => void;
}

const CheckedIcon = () => {
    return (
        <CheckedCircleIcon className="h-6 w-6 text-primary-500 align-middle"/>
    );
}

const UncheckedIcon = () => {
    return (
        <UncheckedCircleIcon className="h-6 w-6 text-gray-300 align-middle group-hover:text-qonic-gray-400"/>
    );
}

export const PropertyCheckbox: React.FC<PropertyCheckboxProps> = ({label, value, onChange}: PropertyCheckboxProps) => {
    return (
        <div className="group flex items-center py-1 hover:bg-gray-100 hover:cursor-pointer"
             onClick={() => onChange(!value)}>
            {value ? <CheckedIcon/> : <UncheckedIcon/>}
            <span className="ml-2 align-middle">{label}</span>
        </div>
    );
}