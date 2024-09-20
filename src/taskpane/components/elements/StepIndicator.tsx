import React from "react";
import classNames from "../../utils/class-names";
import {ChevronLeftIcon} from "@heroicons/react/24/solid";

interface StepIndicatorProps {
    progress: number;
    totalSteps: number;
    title?: string;
    onGoBack: () => void;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ progress, totalSteps, title, onGoBack }) => {
    const steps = Array.from({ length: totalSteps }, (_, index) => index + 1);

    return (
        <div className="flex flex-col">
            <div className="flex space-x-2 items-center w-full py-5">
                {steps.map((step) => (
                    <div
                        key={step}
                        className={classNames(
                            "h-1 rounded flex-1",
                            step <= progress ? "bg-primary-500" : "bg-gray-300"
                        )}
                    />
                ))}
            </div>

            {!!title && (<div className="flex items-center space-x-2">
                {progress != 1 && (<ChevronLeftIcon className="size-6 hover:cursor-pointer" onClick={onGoBack} />)}
                <div className={classNames("flex items-center justify-center size-5 rounded-full text-semibold text-white bg-primary-500")}>
                    {progress}
                </div>
                <h3 className="text-lg font-bold">{title}</h3>
            </div>)}
        </div>
    );
};

export default StepIndicator;