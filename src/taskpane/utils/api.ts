import {useMutation, useQuery} from "@tanstack/react-query";
import {Model, ModelData, ModelModificationErrors, ModelModifications, ModelProps, ProductsQuery, Project} from "./types";
import {PluginError, PluginErrors} from "./plugin-error";
import {useAuth} from "../providers/AuthProvider";
import {useWorksheetContext} from "../providers/WorksheetProvider";
import {Steps} from "./steps";
import {useSessionContext} from "../providers/ModificationSessionProvider";
import {useCallback} from "react";

const apiUrl = process.env.QONIC_API_URL;
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
    queryUrl: `projects/${projectId}/models/${modelId}/products/properties/available-data`,
    errorType: PluginErrors.LoadPropertiesFailed,
    isEnabled: !!projectId && !!modelId && isEnabled,
    pagedField: 'fields',
    formatJson: (response) => response.fields
})

export const useQueryProductsMutation = (projectId: string, modelId: string) => {
    const {updateWorksheetState} = useWorksheetContext();
    const {getSession} = useSessionContext();

    return useApiMutation<ProductsQuery, ModelData>({
        mutationUrl: `projects/${projectId}/models/${modelId}/products/properties/query`,
        pagedField: 'result',
        formatJson: (response) => ({records: response.result.map((record) => ({...record}))}),
        onError: (response, error) => {
            if (response && response.status === 403) updateWorksheetState({currentStep: Steps.EDITING_ACCESS_DENIED});
            else updateWorksheetState({error: new PluginError(PluginErrors.ImportDataFailed, error.message)});
        }
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

type SessionArgs = { projectId: string; modelId: string; sessionId: string };

export const useStartSession = () => {
    const { apiToken } = useAuth();

    return useCallback(async ({ projectId, modelId, sessionId }: SessionArgs) => {
        const resp = await fetch(
            `${apiUrl}/projects/${projectId}/models/${modelId}/start-session`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${apiToken}`,
                    "X-Client-Type": "Excel",
                    "X-Client-Session-Id": sessionId,
                },
            }
        );

        if (!resp.ok) throw new Error(`start-session failed: ${resp.status}`);
    }, [apiToken]);
};

export const useEndSession = () => {
    const { apiToken } = useAuth();

    return useCallback(async ({ projectId, modelId, sessionId }: SessionArgs) => {
        const resp = await fetch(
            `${apiUrl}/projects/${projectId}/models/${modelId}/end-session`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${apiToken}`,
                    "X-Client-Type": "Excel",
                    "X-Client-Session-Id": sessionId,
                },
            }
        );

        if (!resp.ok) throw new Error(`end-session failed: ${resp.status}`);
    }, [apiToken]);
};

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

// Paged endpoints return one page per request; without pagedField only the first page would be read.
const fetchJson = async (url: string, init: RequestInit, pagedField?: string) => {
    const items = [];
    for (let page = 1; ; page++) {
        const response = await fetch(pagedField ? `${url}?page=${page}` : url, init);
        if (!response.ok || response.status === 204) return {response, json: null};

        const json = await response.json();
        if (!pagedField) return {response, json};

        items.push(...json[pagedField]);
        if (json[pagedField].length === 0 || items.length >= json.totalCount)
            return {response, json: {...json, [pagedField]: items}};
    }
}

interface ApiQueryOptions<T> {
    queryKey: string[];
    queryUrl: string;
    errorType: PluginErrors;
    isEnabled?: boolean;
    pagedField?: string;
    formatJson?: (json: any) => T;
}

export const useApiQuery = <T>({
                                   queryKey,
                                   queryUrl,
                                   errorType,
                                   isEnabled = true,
                                   pagedField,
                                   formatJson = null
                               }: ApiQueryOptions<T>) => {
    const headers = useHeaders();
    const {updateWorksheetState} = useWorksheetContext();

    return useQuery({
        queryKey,
        queryFn: async () => {
            try {
                const {response, json: jsonData} = await fetchJson(`${apiUrl}/${queryUrl}`, {headers}, pagedField);
                if (!response.ok) throw new Error(`Error ${response.status}: request failed`);

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
    method?: string;
    pagedField?: string;
    formatJson?: (json: any) => ResponseType;
    onError?: (response: Response, error: any) => void;
    sessionId?: string;
}

export const useApiMutation = <InputType, ResponseType>({
                                                            mutationUrl,
                                                            method = 'POST',
                                                            pagedField,
                                                            formatJson,
                                                            onError,
                                                            sessionId
                                                        }: ApiMutationOptions<ResponseType>) => {
    const headers = useHeaders();
    return useMutation({
        mutationFn: async (variables: InputType ) => {
            let response: Response;
            let requestHeaders: Record<string, string> = {
                ...headers,
                'Content-Type': 'application/json',
                'X-Client-Type': 'Excel'
            }
            if(!!sessionId) requestHeaders['X-Client-Session-Id'] = sessionId;

            try {
                let jsonData: any;
                ({response, json: jsonData} = await fetchJson(`${apiUrl}/${mutationUrl}`, {
                    method,
                    headers: requestHeaders,
                    body: JSON.stringify(variables),
                }, pagedField));
                if (!response.ok) throw new Error(`Error ${response.status}: request failed`);

                if (response.status === 204) return null;
                return formatJson ? formatJson(jsonData) : jsonData;

            } catch (error: any) {
                console.error(error)
                if (onError) onError(response, error);
            }
        }
    });
};