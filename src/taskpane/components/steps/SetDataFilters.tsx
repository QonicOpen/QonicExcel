import React, {useCallback, useEffect} from "react";
import {PropertyCheckbox} from "../elements/PropertyCheckbox";
import {SearchProperty} from "../elements/SearchProperty";
import {ButtonOverlay} from "../elements/ButtonOverlay";
import {Steps} from "../../utils/steps";
import {useWorksheetContext} from "../../providers/WorksheetProvider";

interface DataFilterProps {
    dataFilters: string[];
}

export const SetDataFilters: React.FC<DataFilterProps> = ({dataFilters}: DataFilterProps) => {
    const [visibleProperties, setVisibleProperties] = React.useState<string[]>(dataFilters);
    const {activeWorkSheet: {selectedFilters, filterSearchTerm}, updateWorksheetState} = useWorksheetContext();

    const onSelectProperty = useCallback((property: string, checked: boolean) => {
        if (checked) {
            onChangeFilters([...selectedFilters, property]);
        } else {
            onChangeFilters(selectedFilters.filter(f => f !== property));
        }
    }, [selectedFilters]);

    const onSelectAll = useCallback((checked: boolean) => {
        if (checked) {
            onChangeFilters(dataFilters);
        } else {
            onChangeFilters([]);
        }
    }, [dataFilters]);

    const onChangeFilters = useCallback((filters: string[]) => {
        updateWorksheetState({selectedFilters: filters});
    }, [updateWorksheetState]);

    const onChooseFilters = useCallback(() => {
        updateWorksheetState({currentStep: Steps.SET_FILTER_VALUES});
    }, [updateWorksheetState]);

    const onSearch = useCallback((searchTerm: string) => {
        updateWorksheetState({filterSearchTerm: searchTerm});
    }, [updateWorksheetState]);


    useEffect(() => {
        setVisibleProperties(dataFilters.filter((dataFilter) => dataFilter.toLowerCase().includes(filterSearchTerm.toLowerCase())));
    }, [dataFilters, filterSearchTerm]);

    if (dataFilters === undefined || dataFilters === null) return (<div>Loading...</div>)
    if (dataFilters.length === 0) return (<div>No data filters found</div>);

    return (
        <div className="mt-2">
            <p className="mb-4 text-qonic-gray-400">Select the model data you want to import.</p>
            <div className="flex flex-col border-collapse mt-5">
                <div className="mb-2">
                    <SearchProperty onSearch={onSearch} searchTerm={filterSearchTerm}/>
                </div>

                <div className="border-b border-gray-200">
                    {!filterSearchTerm && (
                        <PropertyCheckbox label={"All"} value={selectedFilters.length === dataFilters.length}
                                          onChange={(value) => onSelectAll(value)}/>)}
                </div>

                {visibleProperties.map((dataFilter) => (
                    <div key={dataFilter} className="border-b border-gray-100">
                        <PropertyCheckbox label={dataFilter} value={selectedFilters.includes(dataFilter)}
                                          onChange={(value) => onSelectProperty(dataFilter, value)}/>
                    </div>
                ))}
            </div>

            <ButtonOverlay onPress={() => onChooseFilters()} label={`Choose (${selectedFilters.length})`}
                           isDisabled={selectedFilters.length === 0}/>
        </div>
    )
}