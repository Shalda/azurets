import { AuthModule } from "./AuthModule";
// Browser check variables
// If you support IE, our recommendation is that you sign-in using Redirect APIs
// If you as a developer are testing using Edge InPrivate mode, please add "isEdge" to the if check
const ua = window.navigator.userAgent;
const msie = ua.indexOf("MSIE ");
const msie11 = ua.indexOf("Trident/");
const isIE = msie > 0 || msie11 > 0;

const authModule: AuthModule = new AuthModule();

// Load auth module when browser window loads. Only required for redirect flows.
window.addEventListener("load", async () => {
  authModule.loadAuthModule();
});

/**
 * Called when user clicks "Sign in with Redirect" or "Sign in with Popup"
 */
export class AzureAuth {
  creatMsalApplication(config: {
    clientId: string;
    redirectUri?: string;
    authority?: string;
  }) {
    authModule.createAuthApplication(config);
  }
  loadAuthApp() {
    authModule.loadAuthModule();
  }
  signIn() {
    return authModule.login("loginRedirect");
  }
  signOut(): void {
    authModule.logout();
  }
  attemptSsoSilent(): void {
    authModule.getAccount();
  }
  getAccount() {
    return authModule.getAccount();
  }
  getTokens() {
    return authModule.getTokenRedirect();
  }
}
export function creatMsalApplication(config: {
  clientId: string;
  redirectUri?: string;
  authority?: string;
}) {
  authModule.createAuthApplication(config);
}

export function loadAuthApp() {
  authModule.loadAuthModule();
}

export function signIn(): void {
  authModule.login("loginRedirect");
}

/**
 * Called when user clicks "Sign Out"
 */
export function signOut(): void {
  authModule.logout();
}
/**
 * Called when user clicks "Attempt SsoSilent"
 */
export function attemptSsoSilent(): void {
  authModule.attemptSsoSilent();
}
