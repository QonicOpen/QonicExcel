import * as React from "react";
import {useModels} from "../utils/api";
import {useUpdateModel} from "../utils/models";

export const ModelSelector = () => {
    const { data: models, isFetched } = useModels();
    const setSelectedModel = useUpdateModel()

    const onSelectModel = React.useCallback((e) => {
        const modelId = e.target.value;
        const selectedModel = models.find((model) => model.id === modelId);
        if(!selectedModel) return;

        setSelectedModel({modelId, projectId: selectedModel.projectId, canEdit: selectedModel.canEdit})
    }, [models]);

    if(!isFetched || !models) return <></>

    return (
        <select onChange={onSelectModel} className="w-full">
            <option value="">Select a model</option>
            {models.map((model) => (
                <option key={model.id} value={model.id}>{model.name}</option>
            ))}
        </select>
    );
}