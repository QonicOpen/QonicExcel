import * as React from 'react';
import {jwtDecode} from "jwt-decode";
import {PluginError, PluginErrors} from "../utils/plugin-error";
import {ReactNode, useCallback} from "react";

let loginDialog;

interface AuthContextType {
    apiToken: string | null;
    authorize: () => void;  // Add configureAuth to the context type
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);
const apiTokenKey = process.env.API_ENV ? process.env.API_ENV + '_qonic_api_token' : 'qonic_api_token';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [apiToken, setApiToken] = React.useState<string | null>(null);

    // Define configureAuth inside the AuthProvider
    const authorize = useCallback(() => {
        const processLoginMessage = (arg) => {
            // Confirm origin is correct.
            if (arg.origin !== window.location.origin) {
                throw new PluginError(PluginErrors.LoginFailed);
            }

            let messageFromDialog = JSON.parse(arg.message);
            if (messageFromDialog.status === 'success') {
                localStorage.setItem(apiTokenKey, messageFromDialog.token);
                setApiToken(messageFromDialog.token);
            } else {
                throw new PluginError(PluginErrors.LoginFailed);
            }

            loginDialog.close();
        };

        const checkAuthAndTriggerLogin = async () => {
            const storedApiToken = localStorage.getItem(apiTokenKey);
            if (isTokenValid(storedApiToken)) {
                setApiToken(storedApiToken);
                return;
            }

            if (!apiToken) {
                // Trigger the login popup
                const fullUrl = window.location.origin + '/login.html'; // Ensure correct URL

                Office.context.ui.displayDialogAsync(fullUrl, { height: 50, width: 50 },
                    function (result) {
                        loginDialog = result.value;
                        loginDialog.addEventHandler(Office.EventType.DialogMessageReceived, processLoginMessage);
                    })
            }
        };

        checkAuthAndTriggerLogin().catch(() => {
            throw new PluginError(PluginErrors.LoginFailed);
        })

    }, [apiToken, setApiToken]);

    return (
        <AuthContext.Provider value={{ apiToken, authorize }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

const isTokenValid = (token: string) => {
    try {
        const decodedToken: any = jwtDecode(token);  // Decode the JWT token
        const currentTime = Math.floor(Date.now() / 1000);  // Get current time in seconds
        return decodedToken.exp > currentTime;  // Compare expiration time with the current time
    } catch (error) {
        return false;
    }
}
