import {SelectModel} from "./steps/SelectModel";
import {SetDataFilters} from "./steps/SetDataFilters";
import {SetFilterValues} from "./steps/SetFilterValues";
import {UtilizeData} from "./steps/UtilizeData";
import React, {useEffect} from "react";
import {useAvailableDataProducts, useQueryProductsMutation} from "../utils/api";
import {previousStep, stepProgress, stepIndex, Steps, stepTitle, totalSteps} from "../utils/steps";
import StepIndicator from "./elements/StepIndicator";
import {LoadDataFilters} from "./steps/LoadDataFilters";
import {LoadQueryData} from "./steps/LoadQueryData";
import {fillModelData} from "../excel/fillModelData";
import {useWorksheetContext} from "../providers/WorksheetProvider";
import {Fallback} from "./elements/Fallback";
import {PluginError, PluginErrors} from "../utils/plugin-error";
import {NoFilterResults} from "./steps/NoFilterResults";
import {EditingAccessDenied} from "./steps/EditingAccessDenied";
import {getCurrentModelData} from "../excel/getModelModifications";


const StepComponent: React.FC = () => {
    const {activeWorkSheet, updateWorksheetState} = useWorksheetContext();
    const {currentStep, selectedModelData, selectedModel, selectedFilters, selectedFilterValues, error} = activeWorkSheet;
    const {data: availableData} = useAvailableDataProducts(selectedModel.projectId, selectedModel.modelId, stepIndex(currentStep) >= stepIndex(Steps.LOAD_DATA_FILTERS))
    const queryProductsMutation = useQueryProductsMutation(selectedModel.projectId, selectedModel.modelId);

    useEffect(() => {
        if (!!availableData && currentStep === Steps.LOAD_DATA_FILTERS) {
            updateWorksheetState({currentStep: Steps.SET_DATA_FILTERS});
        }
    }, [updateWorksheetState, availableData, currentStep]);

    useEffect(() => {
        console.log('currentStep', currentStep, selectedModelData)
        if (currentStep === Steps.LOAD_QUERY_DATA) {
            queryProductsMutation.mutateAsync({ fields: selectedFilters, filters: selectedFilterValues })
                .then((modelQueryData) => {
                    if (modelQueryData.records.length === 0) {
                        updateWorksheetState({currentStep: Steps.NO_FILTER_RESULTS});
                        return;
                    }

                    fillModelData(modelQueryData)
                        .then(() => getCurrentModelData())
                        .then((selectedModelData) => updateWorksheetState({currentStep: Steps.UTILIZE_DATA, cellErrors: [], hasCellErrors: false, selectedModelData}))
                        .catch((error) => updateWorksheetState({error: new PluginError(PluginErrors.ImportDataFailed, error.message)}))
                })
        }
    }, [updateWorksheetState, activeWorkSheet, currentStep]);

    const renderStepComponent = () => {
        switch (currentStep) {
            case Steps.SELECT_MODEL:
                return <SelectModel/>;
            case Steps.LOAD_DATA_FILTERS:
                return <LoadDataFilters/>
            case Steps.SET_DATA_FILTERS:
                return <SetDataFilters dataFilters={availableData}/>;
            case Steps.SET_FILTER_VALUES:
                return <SetFilterValues/>;
            case Steps.LOAD_QUERY_DATA:
                return <LoadQueryData/>;
            case Steps.NO_FILTER_RESULTS:
                return <NoFilterResults/>
            case Steps.UTILIZE_DATA:
                return <UtilizeData/>;
            case Steps.EDITING_ACCESS_DENIED:
                return <EditingAccessDenied/>
            default:
                return <></>
        }
    };

    if(error) return <Fallback error={error}/>

    return (
        <div className="mx-5">
            <StepIndicator
                progress={stepProgress(currentStep)}
                totalSteps={totalSteps}
                title={stepTitle(currentStep)}
                onGoBack={() => updateWorksheetState({ currentStep: previousStep(currentStep) })}
            />
            {renderStepComponent()}
        </div>
    )
};

export default StepComponent;
