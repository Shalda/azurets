/**
 * Called when user clicks "Sign in with Redirect" or "Sign in with Popup"
 */
export declare class AzureAuth {
    creatMsalApplication(config: {
        clientId: string;
        redirectUri?: string;
        authority?: string;
    }): void;
    loadAuthApp(): void;
    signIn(): void | Promise<any> | null;
    signOut(): void;
    attemptSsoSilent(): void;
    getAccount(): import("@azure/msal-common").AccountInfo | null;
    getTokens(): Promise<string | null>;
}
export declare function creatMsalApplication(config: {
    clientId: string;
    redirectUri?: string;
    authority?: string;
}): void;
export declare function loadAuthApp(): void;
export declare function signIn(): void;
/**
 * Called when user clicks "Sign Out"
 */
export declare function signOut(): void;
/**
 * Called when user clicks "Attempt SsoSilent"
 */
export declare function attemptSsoSilent(): void;
