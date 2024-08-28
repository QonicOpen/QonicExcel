import * as React from "react";

export interface SelectedModel {
    modelId: string | null,
    projectId: string | null
    canEdit: boolean
}


const defaultValue: SelectedModel = { modelId: null, projectId: null, canEdit: false };

// Modify the context to include both the model and the setModel function
export const ModelContext = React.createContext<[
    SelectedModel,
    React.Dispatch<React.SetStateAction<SelectedModel>>
]>([defaultValue, () => {}]);

export const useUpdateModel = () => {
    const [, setModel] = React.useContext(ModelContext);

    return (newModel: SelectedModel) => {
        setModel(newModel);
    };
}

export const useSelectedModel = () => {
    const [model] = React.useContext(ModelContext);
    return model;
}

export const ModelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [model, setModel] = React.useState<SelectedModel>(defaultValue);

    return (
        <ModelContext.Provider value={[model, setModel]}>
            {children}
        </ModelContext.Provider>
    );
}