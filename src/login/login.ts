import {Auth0Client} from "@auth0/auth0-spa-js";

Office.onReady(async () => {
    const auth0 = new Auth0Client({
        domain: process.env.AUTH0_DOMAIN,
        clientId: process.env.AUTH0_CLIENT_ID,
        authorizationParams: {
            audience: process.env.AUTH0_AUDIENCE,
            scope: 'openid profile email',
            redirect_uri:  `${window.location.origin}/login.html`
        }
    });
    try {
        await auth0.handleRedirectCallback()
        const token = await auth0.getTokenSilently({ authorizationParams: { redirect_uri: `${window.location.origin}/login.html` }})
        Office.context.ui.messageParent(JSON.stringify({ status: 'success', token }));
    } catch (error) {
        await auth0.loginWithRedirect({ authorizationParams: { redirect_uri: `${window.location.origin}/login.html` }});
    }
});