import {Model} from "../../utils/types";
import React from "react";
import {Loading} from "./Loading";
import classNames from "../../utils/class-names";
import {ButtonOverlay} from "./ButtonOverlay";
import {ExclamationTriangleIcon} from "@heroicons/react/24/outline";

interface ModelListProps {
    isLoadingModels: boolean;
    models: Model[];
    onChange: (model: Model) => void;
    modelId: string;
}

export const ModelList: React.FC<ModelListProps> = ({isLoadingModels, models, onChange, modelId}: ModelListProps) => {
    if (isLoadingModels) return <Loading message={"Loading models from project..."}/>

    if(models.length === 0) {
        return (<div className="flex flex-col justify-center items-center px-4 py-7">
            <div className="bg-gray-100 rounded-full size-10 flex justify-center items-center">
                <ExclamationTriangleIcon className="size-6 text-red-500 text-center"/>
            </div>
            <p className="mt-3 text-center text-qonic-gray-400">You have no models available in this project.</p>
        </div>)
    }

    return (
        <div className="space-y-1">
            {models.map((model) => (
                <div
                    key={model.id}
                    onClick={() => onChange(model)}
                    className={classNames("h-16 flex items-center cursor-pointer rounded-sm p-2",
                        model.id === modelId ? "outline outline-2 outline-primary-500" : " border border-gray-300 hover:outline hover:outline-2 hover:outline-gray-300"
                    )}
                >
                    <div className={classNames(
                        "w-20 h-12 flex-shrink-0 rounded-sm", // Consistent image size
                        model.discipline ? `${model.discipline.toLowerCase()} bg-opacity-25` : 'bg-gray-100'
                    )}
                         style={{
                             backgroundColor: model.discipline ? `${model.discipline.toLowerCase()}` : 'bg-gray-400', // Adding opacity manually with hex value
                         }}
                    >
                        <img
                            src={model.image}
                            alt={model.name}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <span className="max-h-14 text-sm font-medium ml-3 mr-1 my-2 break-words line-clamp-2">{model.name}</span>
                </div>
            ))}
        </div>
    );
}