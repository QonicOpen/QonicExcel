const QONIC_API_URL =
    process.env.QONIC_API_URL ?? "https://api.qonic.com/v1";

const QONIC_CLIENT_ID = process.env.QONIC_CLIENT_ID!;
const QONIC_CLIENT_SECRET = process.env.QONIC_CLIENT_SECRET!;
const QONIC_SCOPES = "projects:read models:read models:write";

const REDIRECT_URI = `${window.location.origin}/login.html`
const PKCE_STORAGE_KEY = process.env.API_ENV ? process.env.API_ENV + "_qonic_pkce" : "qonic_pkce";

function randomString(length: number, chars: string): string {
    let result = "";
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
        result += chars[array[i] % chars.length];
    }
    return result;
}

function makeCodeVerifier(length = 64): string {
    const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._~";
    return randomString(length, alphabet);
}

function base64UrlEncode(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = "";

    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }

    return btoa(binary)
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
}

async function makeCodeChallenge(verifier: string): Promise<string> {
    const data = new TextEncoder().encode(verifier);
    const digest = await crypto.subtle.digest("SHA-256", data);
    return base64UrlEncode(digest);
}

function makeState(length = 24): string {
    const alphabet =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return randomString(length, alphabet);
}

async function startAuthorize(): Promise<void> {
    const codeVerifier = makeCodeVerifier(64);
    const codeChallenge = await makeCodeChallenge(codeVerifier);
    const state = makeState(24);

    sessionStorage.setItem(`${PKCE_STORAGE_KEY}_code_verifier`, codeVerifier,);
    sessionStorage.setItem(`${PKCE_STORAGE_KEY}_state`, state);

    const params = new URLSearchParams({
        client_id: QONIC_CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        scope: QONIC_SCOPES,
        state,
        code_challenge: codeChallenge,
        code_challenge_method: "S256",
    });

    console.log(params)

    window.location.href = `${QONIC_API_URL}/auth/authorize?${params.toString()}`;
}

async function handleCallback(): Promise<void> {
    const qs = new URLSearchParams(window.location.search);
    const code = qs.get("code");
    const returnedState = qs.get("state") ?? "";
    const error = qs.get("error");

    if (error) {
        Office.context.ui.messageParent(
            JSON.stringify({status: "error", error}),
        );
        return;
    }

    if (!code) {
        Office.context.ui.messageParent(
            JSON.stringify({status: "error", error: "Failed to retrieve authorization code"}),
        );
        return;
    }

    const expectedState = sessionStorage.getItem(
        `${PKCE_STORAGE_KEY}_state`,
    );
    if (!expectedState || expectedState !== returnedState) {
        Office.context.ui.messageParent(
            JSON.stringify({status: "error", error: "invalid_state"}),
        );
        return;
    }

    const codeVerifier = sessionStorage.getItem(
        `${PKCE_STORAGE_KEY}_code_verifier`,
    );
    if (!codeVerifier) {
        Office.context.ui.messageParent(
            JSON.stringify({status: "error", error: "missing_code_verifier"}),
        );
        return;
    }

    console.log({
        code,
        redirect_uri: REDIRECT_URI,
        code_verifier: codeVerifier,
        grant_type: "authorization_code",
        client_id: QONIC_CLIENT_ID,
        client_secret: QONIC_CLIENT_SECRET,
    })

    const form = new URLSearchParams();
    form.append("code", code);
    form.append("redirect_uri", REDIRECT_URI);
    form.append("code_verifier", codeVerifier);
    form.append("grant_type", "authorization_code");
    form.append("client_id", QONIC_CLIENT_ID);
    form.append("client_secret", QONIC_CLIENT_SECRET); // ⚠️ see note below

    const resp = await fetch(`${QONIC_API_URL}/auth/token`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: form.toString(),
    });

    if (!resp.ok) {
        Office.context.ui.messageParent(
            JSON.stringify({
                status: "error",
                error: "token_exchange_failed",
            }),
        );
        return;
    }

    const tokenResponse = await resp.json();
    const accessToken = tokenResponse.access_token;

    Office.context.ui.messageParent(
        JSON.stringify({status: "success", token: accessToken}),
    );
}

Office.onReady(async () => {
    const qs = new URLSearchParams(window.location.search);
    const hasCode = qs.has("code");
    const hasError = qs.has("error");

    if (hasCode || hasError) {
        await handleCallback();
    } else {
        await startAuthorize();
    }
});