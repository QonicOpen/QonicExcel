import {useQuery} from "@tanstack/react-query";
import {useApiToken} from "./auth";
import {useSelectedModel} from "./models";

const baseUrl = 'https://develop-public-api.qonic.com/v1';

export const useModels = () => {
    const showModelsUrl = `${baseUrl}/models`;
    const headers = useHeaders();
    return useQuery({
        queryKey: ['models'],
        queryFn: () => fetch(showModelsUrl, {headers})
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json()
            })
            .then((json) => json['models']),
        enabled: !!headers
    })
}

export const useAvailableData = () => {
    const headers = useHeaders();
    const {modelId, projectId} = useSelectedModel();
    return useQuery({
        queryKey: ['availableData', projectId, modelId],
        queryFn: () => fetch(`${baseUrl}/projects/${projectId}/models/${modelId}/external-query-available-data`, {headers})
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json()
            })
            .then((json) => json.fields),
        enabled: !!headers && !!projectId && !!modelId,
    })
}

export const useModelDataQuery = () => {
    const {modelId, projectId} = useSelectedModel();
    const headers = useHeaders();
    const queryUrl = `${baseUrl}/projects/${projectId}/models/${modelId}/external-query`;
    return (query: string) => fetch(`${queryUrl}?${query}`, {headers})
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json()
        })
        .then((json) => json.result)
}

export const useUpdateModelData = () => {
    const {modelId, projectId} = useSelectedModel();
    const headers = useHeaders();
    const updateUrl = `${baseUrl}/projects/${projectId}/models/${modelId}/external-data-modification`;
    return (oldData: Record<string, string>[], newData: Record<string, string>[]): Promise<Response | null> => {
        const updatedModelData = getUpdatedModelData(oldData, newData);
        if (Object.keys(updatedModelData).length === 0) return Promise.resolve(null);

        return fetch(updateUrl, {
            method: 'POST',
            headers,
            body: JSON.stringify(updatedModelData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response;
            });
    }
}

const getUpdatedModelData = (oldData: Record<string, string>[], newData: Record<string, string>[]) => {
    const changes = {} as Record<string, Record<string, string>>
    for (const newRow of newData) {
        const oldRow = oldData.find(row => row.Guid === newRow.Guid);
        if (!oldRow) continue;

        const rowId = newRow.Guid;
        for (const [field, value] of Object.entries(newRow)) {
            if (field === 'Guid') continue;
            if (!oldRow[field] && !value) continue;
            const newValue = !!value ? value : null;
            if (oldRow[field] !== newValue) {
                changes[field] = {...changes[field], [rowId]: newValue}
            }
        }
    }

    return {Values: changes}
}

const useHeaders = () => {
    const apiToken = useApiToken()
    if (!apiToken) return null;

    return {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
    }
}

