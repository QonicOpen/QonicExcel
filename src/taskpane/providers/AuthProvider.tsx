import React, {ReactNode, useCallback} from "react";
import {jwtDecode} from "jwt-decode";
import {PluginError, PluginErrors} from "../utils/plugin-error";

let loginDialog;

interface AuthContextType {
    apiToken: string | null;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const AuthProvider :React.FC<{children: ReactNode}> = ({children}) => {
    const apiToken = configureAuth();

    return (
        <AuthContext.Provider value={{apiToken}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within a AuthProvider');
    }
    return context;
}

const configureAuth = () => {
    const [apiToken, setApiToken] = React.useState<string | null>(null);

    const processLoginMessage = (arg) => {
        // Confirm origin is correct.
        if (arg.origin !== window.location.origin) {
            throw new PluginError(PluginErrors.LoginFailed);
        }

        let messageFromDialog = JSON.parse(arg.message);
        if (messageFromDialog.status === 'success') {
            localStorage.setItem('apiToken', messageFromDialog.token);
            setApiToken(messageFromDialog.token)
        } else {
            throw new PluginError(PluginErrors.LoginFailed);
        }

        loginDialog.close();
    };

    React.useEffect(() => {
        const checkAuthAndTriggerLogin = async () => {
            const storedApiToken = localStorage.getItem('apiToken');
            if (isTokenValid(storedApiToken)) {
                setApiToken(storedApiToken);
                return;
            }

            if (!apiToken) {
                // Trigger the login popup
                const fullUrl = window.location.origin + '/login.html'; // Ensure correct URL

                Office.context.ui.displayDialogAsync(fullUrl, {height: 50, width: 50},
                    function (result) {
                        loginDialog = result.value
                        loginDialog.addEventHandler(Office.EventType.DialogMessageReceived, processLoginMessage);
                    });
            }
        };

        checkAuthAndTriggerLogin().catch(() => {
            throw new PluginError(PluginErrors.LoginFailed)
        });
    }, []);

    return apiToken;
}


const isTokenValid = (token: string) => {
    try {
        const decodedToken: any = jwtDecode(token);  // Decode the JWT token
        const currentTime = Math.floor(Date.now() / 1000);  // Get current time in seconds
        return decodedToken.exp > currentTime;  // Compare expiration time with the current time
    } catch (error) {
        return false;
    }
}

