import * as React from 'react';
import {PluginError, PluginErrors} from "../../utils/plugin-error";
import Button from "./Button";
import {useWorksheetContext} from "../../providers/WorksheetProvider";
import {useErrorBoundary} from "react-error-boundary";
import {ErrorPlaceholder} from "./ErrorPlaceholder";

interface FallbackProps {
    error: PluginError;
}

const errorContent= {
    [PluginErrors.LoadModelsFailed]: {
        title: "Loading models failed...",
        description: "Something went wrong while loading models. Restart the plugin to try again."
    },
    [PluginErrors.LoadProjectsFailed]: {
        title: "Loading projects failed...",
        description: "Something went wrong while loading projects. Restart the plugin to try again."
    },
    [PluginErrors.LoadPropertiesFailed]: {
        title: "Loading properties failed...",
        description: "Something went wrong while loading properties. Restart the plugin to try again."
    },
    [PluginErrors.ImportDataFailed]: {
        title: "Importing data failed...",
        description: "Something went wrong while importing data. Restart the plugin to try again."
    },
    [PluginErrors.SaveDataFailed]: {
        title: "Pushing to Qonic failed...",
        description: "Something went wrong while saving changes. Restart the plugin to try again."
    }
}

export const Fallback: React.FC<FallbackProps> = ({error}: FallbackProps) => {
    const {resetWorksheetState} = useWorksheetContext();
    const {resetBoundary} = useErrorBoundary();

    const onRestart = React.useCallback(() => {
        if (!errorContent[error.errorType]) window.location.reload();

        resetWorksheetState();
        resetBoundary();
    }, [resetWorksheetState, resetBoundary])

    const {title, description} = errorContent[error.errorType] ?? {
        title: "An error occurred",
        description: "Something went wrong. Restart the plugin to try again."
    }

    return (
        <div role="alert" className="min-h-screen flex flex-col items-center justify-center p-5">
            <ErrorPlaceholder/>
            <h1 className="font-bold text-lg mb-3 mt-5 text-center">{title}</h1>
            <p className="text-qonic-gray-400 mb-10 text-center">{description}</p>
            <Button onPress={() => onRestart()}>Restart</Button>
        </div>
    );
}