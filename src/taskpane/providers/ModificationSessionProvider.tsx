import React, {createContext, useCallback, useEffect, useState} from "react";
import {useWorksheetContext} from "./WorksheetProvider";
import {useEndSessionMutation, useStartSessionMutation} from "../utils/api";
import {Steps} from "../utils/steps";

interface ModificationSession {
    projectId: string;
    modelId: string;
    sessionId: string;
}

interface ModificationSessionContextType {
    getSession: (modelId: string) => ModificationSession | undefined;
}

const ModificationSessionContext = createContext<ModificationSessionContextType | undefined>(undefined);

export const useSessionContext = () => {
    const context = React.useContext(ModificationSessionContext);
    if (!context) {
        throw new Error('useSessionContext must be used within a ModificationSessionProvider');
    }
    return context;
}

export const ModificationSessionProvider = ({children}) => {
    const { worksheets } = useWorksheetContext();
    const [activeSessions, setActiveSessions] = useState<ModificationSession[]>([]);
    const startSession = useStartSessionMutation();
    const endSession = useEndSessionMutation();

    const addSession = useCallback((projectId: string, modelId: string, sessionId: string) => setActiveSessions(activeSession => [...activeSession, { modelId, sessionId, projectId }]), []);
    const removeSession = useCallback((modelId: string) => setActiveSessions(activeSession => activeSession.filter(session => session.modelId !== modelId)), []);
    const getSession = useCallback((modelId: string) => activeSessions.find(session => session.modelId === modelId), [activeSessions]);
    const hasSession = useCallback((modelId: string) => !!getSession(modelId), [getSession]);

    useEffect(() => {
        // A session needs to be started once the step is UTILIZE_DATA
        const modelsToStartSession = worksheets.filter(worksheet => worksheet.currentStep === Steps.UTILIZE_DATA && !hasSession(worksheet.selectedModel.modelId));
        modelsToStartSession.forEach(worksheet => {
            const { projectId, modelId } = worksheet.selectedModel;
            const sessionId = crypto.randomUUID()
            addSession(projectId, modelId, sessionId);
            startSession({ projectId, modelId, sessionId })
        });

        const modelsToEndSession = worksheets.filter(worksheet => worksheet.currentStep !== Steps.UTILIZE_DATA && hasSession(worksheet.selectedModel.modelId));
        modelsToEndSession.forEach(worksheet => {
            const { projectId, modelId } = worksheet.selectedModel;
            const { sessionId } = getSession(modelId);
            removeSession(modelId);
            endSession({ projectId, modelId, sessionId })
        });
    }, [worksheets, activeSessions]);

    // before window unload, end all active sessions
    window.addEventListener('unload', () => {
        activeSessions.forEach(session => {
            const { projectId, modelId, sessionId } = session;
            endSession({ projectId, modelId, sessionId })
        });
    });

    return (
        <ModificationSessionContext.Provider value={{getSession}}>
            {children}
        </ModificationSessionContext.Provider>
    );
}