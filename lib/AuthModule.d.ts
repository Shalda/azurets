import { AuthenticationResult, AccountInfo } from "@azure/msal-browser";
/**
 * Configuration class for @azure/msal-browser:
 * https://azuread.github.io/microsoft-authentication-library-for-js/ref/msal-browser/modules/_src_config_configuration_.html
 */
/**
 * AuthModule for application - handles authentication in app.
 */
export declare class AuthModule {
    private myMSALObj?;
    private account;
    private loginRedirectRequest;
    private loginRequest;
    private profileRedirectRequest;
    private profileRequest;
    private silentProfileRequest;
    private silentLoginRequest;
    private msalConfig;
    constructor();
    createAuthApplication(config: {
        clientId: string;
        redirectUri?: string;
        authority?: string;
    }): {
        msg: string;
    } | undefined;
    /**
     * Calls getAllAccounts and determines the correct account to sign into, currently defaults to first account found in cache.
     * TODO: Add account chooser code
     *
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-common/docs/Accounts.md
     */
    private static msalAppNotCreated;
    getAccount(): AccountInfo | null;
    /**
     * Checks whether we are in the middle of a redirect and handles state accordingly. Only required for redirect flows.
     *
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/initialization.md#redirect-apis
     */
    loadAuthModule(): Promise<any> | null;
    /**
     * Handles the response from a popup or redirect. If response is null, will check if we have any accounts and attempt to sign in.
     * @param response
     */
    handleResponse(response: AuthenticationResult | null): void;
    /**
     * Calls ssoSilent to attempt silent flow. If it fails due to interaction required error, it will prompt the user to login using popup.
     * @param request
     */
    attemptSsoSilent(): null | undefined;
    /**
     * Calls loginPopup or loginRedirect based on given signInType.
     * @param signInType
     */
    login(signInType: string): void | null | Promise<any>;
    /**
     * Logs out of current account.
     */
    logout(): void | null;
    /**
     * Gets a token silently, or falls back to interactive redirect.
     */
    getTokenRedirect(): Promise<string | null>;
}
