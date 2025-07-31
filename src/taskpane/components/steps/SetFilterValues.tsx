import React, {useCallback} from "react";
import {ButtonOverlay} from "../elements/ButtonOverlay";
import {XMarkIcon} from "@heroicons/react/24/outline";
import {useWorksheetContext} from "../../providers/WorksheetProvider";
import {Steps} from "../../utils/steps";
import classNames from "../../utils/class-names";

export const SetFilterValues = () => {
    const { activeWorkSheet: { selectedFilters, selectedFilterValues }, updateWorksheetState } = useWorksheetContext();

    const onChangeFilterValue = useCallback((filter: string, value: string) => {
        if(!value) {
            const newSelectedFilterValues = {...selectedFilterValues};
            delete newSelectedFilterValues[filter];
            updateWorksheetState({selectedFilterValues: newSelectedFilterValues});
            return;
        }

        updateWorksheetState({selectedFilterValues: {...selectedFilterValues, [filter]: value}});
    }, [selectedFilterValues, updateWorksheetState]);

    const onChooseFilterValues = useCallback(() => {
        updateWorksheetState({currentStep: Steps.LOAD_QUERY_DATA});
    }, [updateWorksheetState]);

    return (
        <div className="mt-2">
            <p className="mb-6 text-qonic-gray-400">Optionally, you can filter the data you are about to import.</p>
            {selectedFilters.map((dataFilter) => (
                <div key={dataFilter} className={classNames("border-b border-gray-100 pb-2 mb-3", dataFilter == 'Guid' ? 'pb-5 border-gray-200' : '')}>
                    <label className="font-semibold mb-1">{dataFilter}</label>
                    <div className="flex items-center justify-center w-full bg-white relative">
                        <input
                            onKeyUp={(e) => {
                                if (e.key === 'Escape') {
                                    onChangeFilterValue(dataFilter, '')
                                }
                            }}
                            autoComplete="off"
                            className="w-full appearance-none border border-gray-200 rounded-sm py-1 px-2 text-sm leading-tight focus:outline-none focus:shadow-outline focus:ring-0 focus:border-primary-500 p-1.5"
                            type="text" placeholder="Filter value" value={selectedFilterValues[dataFilter] ?? ''}
                            onChange={(e) => onChangeFilterValue(dataFilter, e.target.value)}/>
                        {selectedFilterValues[dataFilter] &&
                            (<XMarkIcon
                                className='absolute right-3 z-9 w-5 h-5 text-gray-400 hover:cursor-pointer hover:text-qonic-black focus:ring-0 focus:border-0 focus:outline-none'
                                onClick={() => onChangeFilterValue(dataFilter, '')}/>)
                        }
                    </div>
                </div>
            ))}

            <ButtonOverlay onPress={() => onChooseFilterValues()} label="Fetch data"/>
        </div>
    )
}