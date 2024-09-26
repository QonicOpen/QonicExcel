import {SelectModel} from "./steps/SelectModel";
import {SetDataFilters} from "./steps/SetDataFilters";
import {SetFilterValues} from "./steps/SetFilterValues";
import {UtilizeData} from "./steps/UtilizeData";
import React, {useEffect} from "react";
import {useModelFilters, useModelData} from "../utils/api";
import {previousStep, stepProgress, stepIndex, Steps, stepTitle, totalSteps} from "../utils/steps";
import StepIndicator from "./elements/StepIndicator";
import {LoadDataFilters} from "./steps/LoadDataFilters";
import {LoadQueryData} from "./steps/LoadQueryData";
import {fillModelData} from "../excel/fillModelData";
import {useWorksheetContext} from "../providers/WorksheetProvider";
import {Fallback} from "./elements/Fallback";
import {PluginError, PluginErrors} from "../utils/plugin-error";
import {NoFilterResults} from "./steps/NoFilterResults";


const StepComponent: React.FC = () => {
    const {activeWorkSheet, updateWorksheetState} = useWorksheetContext();
    const {currentStep, selectedModel, selectedFilters, selectedFilterValues, error} = activeWorkSheet;
    const {data: availableData} = useModelFilters(selectedModel.projectId, selectedModel.modelId, stepIndex(currentStep) >= stepIndex(Steps.LOAD_DATA_FILTERS))
    const {data: modelQueryData} = useModelData(selectedModel.projectId, selectedModel.modelId, selectedFilters, selectedFilterValues, stepIndex(currentStep) >= stepIndex(Steps.LOAD_QUERY_DATA));

    useEffect(() => {
        if (!!availableData && currentStep === Steps.LOAD_DATA_FILTERS) {
            updateWorksheetState({currentStep: Steps.SET_DATA_FILTERS});
        }
    }, [updateWorksheetState, availableData, currentStep]);

    useEffect(() => {
        if (!!modelQueryData && currentStep === Steps.LOAD_QUERY_DATA) {
            console.log(modelQueryData.records)
            if (modelQueryData.records.length === 0) {
                updateWorksheetState({currentStep: Steps.NO_FILTER_RESULTS});
                return;
            }

            fillModelData(modelQueryData)
                .then(() => updateWorksheetState({currentStep: Steps.UTILIZE_DATA, cellErrors: [], hasCellErrors: false}))
                .catch((error) => updateWorksheetState({error: new PluginError(PluginErrors.ImportDataFailed, error.message)}))
        }
    }, [updateWorksheetState, modelQueryData, currentStep]);

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
                return <UtilizeData modelQueryData={modelQueryData}/>;
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
