import React, {useCallback} from "react";
import {useSaveModelDataMutation} from "../../utils/api";
import {useWorksheetContext} from "../../providers/WorksheetProvider";
import {ModelData, ModelModificationErrors} from "../../utils/types";
import {getModelModifications} from "../../excel/getModelModifications";
import {PluginError, PluginErrors} from "../../utils/plugin-error";
import {ButtonOverlay} from "../elements/ButtonOverlay";
import {getCellErrors} from "../../excel/getCellErrors";
import {ExclamationTriangleIcon} from "@heroicons/react/24/outline";
import {CellErrorList} from "../elements/CellErrorList";
import toast from "react-hot-toast";
import {CheckCircleIcon} from "@heroicons/react/24/solid";

interface UtilizeDataProps {
    modelQueryData: ModelData;
}

export const UtilizeData: React.FC<UtilizeDataProps> = ({modelQueryData}: UtilizeDataProps) => {
    const {activeWorkSheet: {selectedModel, cellErrors, hasCellErrors}, updateWorksheetState} = useWorksheetContext();
    const updateDataMutation = useSaveModelDataMutation(selectedModel.projectId, selectedModel.modelId);
    const [isSaving, setIsSaving] = React.useState(false);

    const onSaveChanges = useCallback(() => {
        setIsSaving(true)
        getModelModifications(modelQueryData)
            .then(async (modifications) => {
                const hasModifications = Object.keys(modifications.Values).length > 0;
                return hasModifications ? updateDataMutation.mutateAsync(modifications) : Promise.resolve({errors: []} as ModelModificationErrors);
            })
            .catch((error) => {
                console.error(error)
                updateWorksheetState({error: new PluginError(PluginErrors.SaveDataFailed, error.message)})
            })
            .then(async (modificationErrors: ModelModificationErrors) => {
                if (modificationErrors.errors.length > 0) {
                    const cellErrors = await getCellErrors(modificationErrors.errors)
                        .then((cellErrors) => modificationErrors.errors.length === cellErrors.length ? cellErrors : [])
                        .catch(() => []);
                    updateWorksheetState({cellErrors, hasCellErrors: true});
                } else {
                    toast(() => (
                        <div>
                            <CheckCircleIcon className="size-5 text-primary-500"/>
                            <div className="flex items-center">
                                <h1>Changes pushed</h1>
                                <p>Changes successfully pushed to <em>{selectedModel.name}</em></p>
                            </div>
                        </div>
                    ));

                    updateWorksheetState({cellErrors: [], hasCellErrors: false});
                }
            })
            .finally(() => setIsSaving(false))

    }, []);

    if (hasCellErrors) {
        return (
            <div className="mt-5">
                <div className="flex items-center">
                    <ExclamationTriangleIcon className="size-5 text-red-500"/>
                    <span className="ml-2 font-semibold">Saving failed...</span>
                </div>
                <div className="mt-2 mb-5">
                    <p className="text-qonic-gray-400">Some of the values couldn’t be saved. Please change these to make
                        sure your model can be updated.</p>
                </div>
                <CellErrorList cellErrors={cellErrors}/>
                <ButtonOverlay onPress={() => onSaveChanges()} label="Try again" isDisabled={isSaving}
                               isLoading={isSaving}/>
            </div>
        )
    }

    return (
        <div>
            <div className="mt-2">
                <p className="text-qonic-gray-400">Download your data by saving it, make any necessary modifications,
                    and optionally push your changes back to Qonic.</p>
            </div>
            <ButtonOverlay variant="secondary" onPress={() => onSaveChanges()} label="Push to Qonic"
                           isDisabled={isSaving} isLoading={isSaving}/>
        </div>
    )
}