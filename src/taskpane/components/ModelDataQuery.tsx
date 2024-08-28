import * as React from "react";
import {useUpdateModelData, useAvailableData, useModelDataQuery} from "../utils/api";
import {fillAvailableData} from "../excel/fillAvailableData";
import {getModelQuery} from "../excel/getModelQuery";
import toast from "react-hot-toast";
import {getUpdatedData} from "../excel/getUpdatedModelData";
import {useSelectedModel} from "../utils/models";
import {fillModelData} from "../excel/fillModelData";

export const ModelDataQuery = () => {
    const {data: availableData, error} = useAvailableData();
    const queryModelData = useModelDataQuery()
    const updateModelData = useUpdateModelData()
    const [queryData, setQueryData] = React.useState<Record<string, string>[]>([]);
    const {canEdit} = useSelectedModel()
    const [isSaving, setIsSaving] = React.useState(false)

    const onClickQuery = React.useCallback(() => {
        getModelQuery()
            .then((query) => queryModelData(query))
            .then((queryData) => {
                setQueryData(queryData)
                return fillModelData(queryData)
            })
            .catch((e) => {
                console.error(e)
                toast.error("Something went wrong while querying the data")
            })
    }, [queryModelData])

    const onClickSave = React.useCallback(() => {
        if (isSaving) return;
        setIsSaving(true)
        getUpdatedData()
            .then((newData) => updateModelData(queryData, newData))
            .then(() => {
                setIsSaving(false)
                toast.success("Data saved successfully")
            })
            .catch((e) => {
                console.error(e)
                toast.error("Something went wrong while updating the data")
            })
            .finally(() => setIsSaving(false))
    }, [queryData])

    React.useEffect(() => {
        if (!availableData) return;
        fillAvailableData(availableData).then((sheetName => {
            console.log(sheetName)
        }))
    }, [availableData]);

    React.useEffect(() => {
        if (error) {
            toast.error("Something went wrong while fetching the data")
        }
    }, [error])

    if (!availableData) return (<></>)

    return (
        <div className="flex flex-col">
            <button onClick={onClickQuery}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Query
            </button>
            {canEdit && (<button onClick={onClickSave} disabled={isSaving}
                                 className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                {isSaving ? "Saving..." : "Save"}
            </button>)}
        </div>
    );
}