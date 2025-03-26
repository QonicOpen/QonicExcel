import React, {useCallback} from "react";
import {useSaveModelDataMutation} from "../../utils/api";
import {useWorksheetContext} from "../../providers/WorksheetProvider";
import {ModelModificationErrors} from "../../utils/types";
import {computeModifications, getCurrentModelData} from "../../excel/getModelModifications";
import {PluginError, PluginErrors} from "../../utils/plugin-error";
import {ButtonOverlay} from "../elements/ButtonOverlay";
import {getCellErrors} from "../../excel/getCellErrors";
import {ExclamationTriangleIcon, XMarkIcon} from "@heroicons/react/24/outline";
import {CellErrorList} from "../elements/CellErrorList";
import toast from "react-hot-toast";
import {CheckCircleIcon} from "@heroicons/react/24/solid";

export const UtilizeData: React.FC = () => {
    const {activeWorkSheet: {selectedModel, cellErrors, hasCellErrors, selectedModelData}, updateWorksheetState} = useWorksheetContext();
    const updateDataMutation = useSaveModelDataMutation(selectedModel.projectId, selectedModel.modelId);
    const [isSaving, setIsSaving] = React.useState(false);

    const showNoModificationsToast = () => {
        toast((t) => (
            <div className="flex flex-row items-center">
                <ExclamationTriangleIcon className="min-w-6 min-h-5 text-red-500 mr-4"/>
                <div>
                    <h1 className="font-bold mb-1">No changes</h1>
                    <p>No changes were made yet.</p>
                </div>
                <XMarkIcon className="min-w-5 min-h-5 text-qonic-gray-400 ml-5 cursor-pointer" onClick={() => toast.dismiss(t.id)}/>
            </div>
        ));
    }

    const showSaveSuccessToast = () => {
        toast((t) => (
            <div className="flex flex-row items-center">
                <CheckCircleIcon className="min-w-6 min-h-5 text-primary-500 mr-4"/>
                <div>
                    <h1 className="font-bold mb-1">Changes pushed</h1>
                    <p className="text-qonic-gray-400">Changes successfully pushed to <span className="font-bold text-qonic-black">{selectedModel.name}</span>.</p>
                    <p className="text-qonic-gray-400 mt-1">Reload your model in Qonic to view changes.</p>
                </div>
                <XMarkIcon className="min-w-5 min-h-5 text-qonic-gray-400 ml-5 cursor-pointer" onClick={() => toast.dismiss(t.id)}/>
            </div>
        ));
    }

    const onSaveChanges = useCallback(async () => {
        setIsSaving(true)
        const updatedModelData = await getCurrentModelData();
        const modifications = computeModifications(selectedModelData, updatedModelData);
        if (Object.keys(modifications.Update).length === 0) {
            setIsSaving(false)
            showNoModificationsToast()
            return;
        }

        let modelModificationErrors = {errors: []} as ModelModificationErrors;
        try {
            modelModificationErrors = await updateDataMutation.mutateAsync(modifications);
        } catch (error) {
            console.error(error)
            setIsSaving(false)
            updateWorksheetState({error: new PluginError(PluginErrors.SaveDataFailed, error.message)})
            return;
        }

        const hasErrors = modelModificationErrors.errors.length > 0;
        if(!hasErrors) {
            showSaveSuccessToast()
            updateWorksheetState({cellErrors: [], hasCellErrors: false, selectedModelData: updatedModelData});
        }

        if (hasErrors) {
            const cellErrors = await getCellErrors(modelModificationErrors.errors)
                .then((cellErrors) => modelModificationErrors.errors.length === cellErrors.length ? cellErrors : [])
                .catch(() => []);
            updateWorksheetState({cellErrors, hasCellErrors: true});
        }

        setIsSaving(false)
    }, [updateWorksheetState, selectedModelData]);

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
                <p className="text-qonic-gray-400 mt-2">Please ensure to close your Excel add-in once you're finished.</p>
            </div>
            <ButtonOverlay variant="secondary" onPress={() => onSaveChanges()} label="Push to Qonic"
                           isDisabled={isSaving} isLoading={isSaving}/>
        </div>
    )
}