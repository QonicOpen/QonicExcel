import * as React from 'react';
import toast from "react-hot-toast";
import {jwtDecode} from "jwt-decode";

let loginDialog;

export const ApiTokenContext = React.createContext<string | null>(null);

export const useApiToken = () => {
    return React.useContext(ApiTokenContext);
}

export const configureAuth = () => {
    const [apiToken, setApiToken] = React.useState<string | null>(null);

    const processLoginMessage = (arg) => {
        // Confirm origin is correct.
        if (arg.origin !== window.location.origin) {
            throw new Error("Incorrect origin passed to processLoginMessage.");
        }

        let messageFromDialog = JSON.parse(arg.message);
        if (messageFromDialog.status === 'success') {
            localStorage.setItem('apiToken', messageFromDialog.token);
            setApiToken(messageFromDialog.token)
        } else {
            toast.error("An error occurred while logging in.")
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
                console.log("Triggering login popup");
                // Trigger the login popup
                const fullUrl = window.location.origin + '/login.html'; // Ensure correct URL

                Office.context.ui.displayDialogAsync(fullUrl, {height: 50, width: 50},
                    function (result) {
                        loginDialog = result.value
                        loginDialog.addEventHandler(Office.EventType.DialogMessageReceived, processLoginMessage);
                    });
            }
        };

        checkAuthAndTriggerLogin().catch(() => toast.error("An error occurred while checking authentication."));
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

