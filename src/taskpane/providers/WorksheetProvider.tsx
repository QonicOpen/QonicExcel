import React, {createContext, useContext, useState, ReactNode, useEffect, useCallback} from "react";
import {onSheetChanged, removeOnSheetChanged} from "../excel/onSheetChanged";
import {Step, Steps} from "../utils/steps";
import {PluginError} from "../utils/plugin-error";
import {CellError, ModelData} from "../utils/types";

export interface WorksheetState {
    currentStep: Step;
    selectedModel: { projectId: string, modelId: string, name: string };
    selectedModelData: ModelData;
    filterSearchTerm: string;
    selectedFilters: string[];
    selectedFilterValues: { [key: string]: string };
    cellErrors: CellError[]
    hasCellErrors: boolean
    error?: PluginError
}

const emptyWorksheetState: WorksheetState = {
    currentStep: Steps.SELECT_MODEL,
    selectedModel: {projectId: "", modelId: "", name: ""},
    selectedModelData: {records: []},
    filterSearchTerm: "",
    selectedFilters: [],
    selectedFilterValues: {},
    cellErrors: [],
    hasCellErrors: false
}

interface WorksheetContextType {
    activeWorkSheet: WorksheetState | undefined;
    updateWorksheetState: (newState: Partial<WorksheetState>) => void;
    resetWorksheetState: () => void;
    worksheets: WorksheetState[];
}

const WorksheetContext = createContext<WorksheetContextType | undefined>(undefined);

export const WorksheetProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [activeWorksheet, setActiveWorksheet] = useState<string | undefined>(undefined);
    const [worksheetStates, setWorksheetStates] = useState<{ [key: string]: WorksheetState }>({});

    useEffect(() => {
        const handleSheetChange = (sheetId: string) => setActiveWorksheet(sheetId);
        onSheetChanged(handleSheetChange)

        return () => {
            removeOnSheetChanged()
        }
    }, [])

    const resetWorksheetState = useCallback(() => {
        setWorksheetStates(prev => ({
            ...prev,
            [activeWorksheet]: emptyWorksheetState
        }));
    }, [activeWorksheet]);

    const updateWorksheetState = useCallback((newState: Partial<WorksheetState>): void => {
        setWorksheetStates(prev => ({
            ...prev,
            [activeWorksheet]: {...prev[activeWorksheet] ?? emptyWorksheetState, ...newState}
        }));
    }, [activeWorksheet]);

    return (
        <WorksheetContext.Provider
            value={{
                activeWorkSheet: (worksheetStates[activeWorksheet] ?? emptyWorksheetState),
                updateWorksheetState,
                resetWorksheetState,
                worksheets: Object.values(worksheetStates)
            }}>
            {children}
        </WorksheetContext.Provider>
    );
};

export const useWorksheetContext = (): WorksheetContextType => {
    const context = useContext(WorksheetContext);
    if (!context) {
        throw new Error("useWorksheetContext must be used within a WorksheetProvider");
    }
    return context;
};