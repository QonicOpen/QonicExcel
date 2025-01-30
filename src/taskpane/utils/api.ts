import {useMutation, useQuery} from "@tanstack/react-query";
import {Model, ModelData, ModelModificationErrors, ModelModifications, ModelProps, Project} from "./types";
import {PluginError, PluginErrors} from "./plugin-error";
import {useAuth} from "../providers/AuthProvider";
import {useWorksheetContext} from "../providers/WorksheetProvider";
import {Steps} from "./steps";
import {useSessionContext} from "../providers/ModificationSessionProvider";
import {useCallback} from "react";

const baseUrl = process.env.API_URL;

export const useProjects = () => useApiQuery<Project[]>({
    queryKey: ['projects'],
    queryUrl: `projects`,
    errorType: PluginErrors.LoadProjectsFailed,
    formatJson: (response) => response.projects
})

export const useModels = (projectId: string) => useApiQuery<Model[]>({
    queryKey: ['models', projectId],
    queryUrl: `projects/${projectId}/models`,
    errorType: PluginErrors.LoadModelsFailed,
    isEnabled: !!projectId,
    formatJson: (response) => response.models
})

export const useAvailableDataProducts = (projectId: string, modelId: string, isEnabled: boolean) => useApiQuery<string[]>({
    queryKey: ['modelFilters', projectId, modelId],
    queryUrl: `projects/${projectId}/models/${modelId}/products/available-data`,
    errorType: PluginErrors.LoadPropertiesFailed,
    isEnabled: !!projectId && !!modelId && isEnabled,
    formatJson: (response) => response.fields
})

export const useProducts = (projectId: string, modelId: string, includeFields: string[], includeFilters: Record<string, string>, isEnabled: boolean) => {
    const queryUrl = `projects/${projectId}/models/${modelId}/products${getModelQuery(includeFields, includeFilters)}`;

    return useApiQuery<ModelData>({
        queryKey: ['modelData', queryUrl],
        queryUrl: queryUrl,
        errorType: PluginErrors.ImportDataFailed,
        isEnabled: !!projectId && !!modelId && isEnabled,
        formatJson: (response) => ({records: response.result.map((record) => ({...record}))})
    })
}

export const useSaveModelDataMutation = (projectId: string, modelId: string) => {
    const {updateWorksheetState} = useWorksheetContext();
    const {getSession} = useSessionContext();
    const sessionId = getSession(modelId)?.sessionId

    return useApiMutation<ModelModifications, ModelModificationErrors>({
        mutationUrl: `projects/${projectId}/models/${modelId}/products`,
        onError: (response, error) => {
            if (response && response.status === 403) updateWorksheetState({currentStep: Steps.EDITING_ACCESS_DENIED});
            else updateWorksheetState({error: new PluginError(PluginErrors.SaveDataFailed, error.message)});
        },
        sessionId
    })
}

export const useStartSessionMutation = () => {
    const {apiToken} = useAuth();
    return useCallback(({modelId, projectId, sessionId}: ModelProps) => {
        navigator.sendBeacon(`${baseUrl}/projects/${projectId}/models/${modelId}/start-session?session_id=${sessionId}&access_token=${apiToken}`);

    }, [apiToken])
}

export const useEndSessionMutation = () => {
    const {apiToken} = useAuth();
    return useCallback(({modelId, projectId, sessionId}: ModelProps) => {
        navigator.sendBeacon(`${baseUrl}/projects/${projectId}/models/${modelId}/end-session?session_id=${sessionId}&access_token=${apiToken}`);
    }, [apiToken])
}

const getModelQuery = (includeFields: string[], includeFilters: Record<string, string>) => {
    let query = "?";

    if (includeFields.length > 0) {
        query += "fields=" + includeFields.join("&fields=");

        if (includeFields.length > 0) query += "&";
    }


    for (const [key, value] of Object.entries(includeFilters)) {
        if (!value) continue;
        query += `filters[${encodeURIComponent(key)}]=${encodeURIComponent(value)}&`;
    }

    return query
}


const useHeaders = () => {
    const {apiToken} = useAuth()
    if (!apiToken) return null;

    return {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
    }
}

interface ApiQueryOptions<T> {
    queryKey: string[];
    queryUrl: string;
    errorType: PluginErrors;
    isEnabled?: boolean;
    formatJson?: (json: any) => T;
}

export const useApiQuery = <T>({
                                   queryKey,
                                   queryUrl,
                                   errorType,
                                   isEnabled = true,
                                   formatJson = null
                               }: ApiQueryOptions<T>) => {
    const headers = useHeaders();
    const {updateWorksheetState} = useWorksheetContext();

    return useQuery({
        queryKey,
        queryFn: async () => {
            try {
                const response = await fetch(`${baseUrl}/${queryUrl}`, {headers});
                if (!response.ok) throw new Error(`Error ${response.status}: request failed`);

                const jsonData = await response.json();
                return formatJson ? formatJson(jsonData) : jsonData;
            } catch (error: any) {
                console.error(error)
                updateWorksheetState({error: new PluginError(errorType, error.message)});
                return null
            }
        },
        retry: 0,
        enabled: !!headers && isEnabled
    });
};

interface ApiMutationOptions<ResponseType> {
    mutationUrl: string;
    sessionId: string;
    method?: string;
    formatJson?: (json: any) => ResponseType;
    onError?: (response: Response, error: any) => void;
}

export const useApiMutation = <InputType, ResponseType>({
                                                            mutationUrl,
                                                            method = 'POST',
                                                            formatJson,
                                                            onError,
                                                            sessionId
                                                        }: ApiMutationOptions<ResponseType>) => {
    const headers = useHeaders();
    return useMutation({
        mutationFn: async (variables: InputType ) => {
            let response: Response;
            try {
                response = await fetch(`${baseUrl}/${mutationUrl}`, {
                    method,
                    headers: {
                        ...headers,
                        'Content-Type': 'application/json',
                        'X-Client-Session-Id': sessionId,
                        'X-Client-Type': 'Excel'
                    },
                    body: JSON.stringify(variables),
                });
                if (!response.ok) throw new Error(`Error ${response.status}: request failed`);

                if (response.status === 204) return null;
                const jsonData = await response.json();
                return formatJson ? formatJson(jsonData) : jsonData;

            } catch (error: any) {
                console.error(error)
                if (onError) onError(response, error);
            }
        }
    });
};