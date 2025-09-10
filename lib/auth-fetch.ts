import { logoutFromProvider, refreshTokenFromProvider } from "@/context/auth-context";
import { getToken } from "@/lib/token";

/**
 * Wrapper fetch con gestione automatica 401 e retry.
 */
export async function authFetch(input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> {
    let token = getToken();

    const headers = new Headers(init.headers || {});
    if (token) headers.set("Authorization", `Bearer ${token}`);

    try {
        let res = await fetch(input, { ...init, headers, credentials: "include" });

        // Se 401 → prova refresh e ritenta una sola volta
        if (res.status === 401) {
            const newToken = await refreshTokenFromProvider();

            if (!newToken) {
                logoutFromProvider();
                return res; // ritorna il 401 originale
            }

            // Aggiorna il token e ritenta la request
            token = newToken;
            headers.set("Authorization", `Bearer ${token}`);
            res = await fetch(input, { ...init, headers, credentials: "include" });
        }

        return res;
    } catch (err) {
        console.error("[AUTH_FETCH_ERROR]", err);
        throw err;
    }
}
