import {
  PublicClientApplication,
  SilentRequest,
  AuthenticationResult,
  Configuration,
  LogLevel,
  AccountInfo,
  InteractionRequiredAuthError,
  RedirectRequest,
  PopupRequest,
  EndSessionRequest,
  SsoSilentRequest,
} from "@azure/msal-browser";
/**
 * Configuration class for @azure/msal-browser:
 * https://azuread.github.io/microsoft-authentication-library-for-js/ref/msal-browser/modules/_src_config_configuration_.html
 */

/**
 * AuthModule for application - handles authentication in app.
 */
export class AuthModule {
  private myMSALObj?: PublicClientApplication; // https://azuread.github.io/microsoft-authentication-library-for-js/ref/msal-browser/classes/_src_app_publicclientapplication_.publicclientapplication.html
  private account: AccountInfo | null; // https://azuread.github.io/microsoft-authentication-library-for-js/ref/msal-common/modules/_src_account_accountinfo_.html
  private loginRedirectRequest: RedirectRequest; // https://azuread.github.io/microsoft-authentication-library-for-js/ref/msal-browser/modules/_src_request_redirectrequest_.html
  private loginRequest: PopupRequest; // https://azuread.github.io/microsoft-authentication-library-for-js/ref/msal-browser/modules/_src_request_popuprequest_.html
  private profileRedirectRequest: RedirectRequest;
  private profileRequest: PopupRequest;
  private silentProfileRequest: SilentRequest; // https://azuread.github.io/microsoft-authentication-library-for-js/ref/msal-browser/modules/_src_request_silentrequest_.html
  private silentLoginRequest: SsoSilentRequest;

  private msalConfig: Configuration = {
    auth: {
      clientId: "",
    },
    cache: {
      cacheLocation: "localStorage", // This configures where your cache will be stored
      storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    },
    system: {
      loggerOptions: {
        loggerCallback: (level, message, containsPii) => {
          if (containsPii) {
            return;
          }
          switch (level) {
            case LogLevel.Error:
              console.error(message);
              return;
            case LogLevel.Info:
              console.info(message);
              return;
            case LogLevel.Verbose:
              console.debug(message);
              return;
            case LogLevel.Warning:
              console.warn(message);
              return;
          }
        },
      },
    },
  };
  constructor() {
    this.account = null;

    this.loginRequest = {
      scopes: [],
    };

    this.loginRedirectRequest = {
      ...this.loginRequest,
      redirectStartPage: window.location.href,
    };

    this.profileRequest = {
      scopes: ["User.Read"],
    };

    this.profileRedirectRequest = {
      ...this.profileRequest,
      redirectStartPage: window.location.href,
    };

    this.silentProfileRequest = {
      scopes: ["openid", "profile", "User.Read"],
      forceRefresh: false,
    };

    this.silentLoginRequest = {
      loginHint: "",
    };
  }
  public createAuthApplication(config: {
    clientId: string;
    redirectUri?: string;
    authority?: string;
  }) {
    if (!config.clientId) return { msg: "auth config is empty or not full" };
    this.msalConfig.auth.clientId = config.clientId;
    if (config.authority) {
      this.msalConfig.auth.redirectUri = config.redirectUri;
    }
    if (config.authority) {
      this.msalConfig.auth.authority = config.authority;
    }
    this.myMSALObj = new PublicClientApplication(this.msalConfig);
    this.loadAuthModule()?.then((res) => this.getTokenRedirect());
  }

  /**
   * Calls getAllAccounts and determines the correct account to sign into, currently defaults to first account found in cache.
   * TODO: Add account chooser code
   *
   * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-common/docs/Accounts.md
   */
  private static msalAppNotCreated() {
    console.log("msal app not created");
    return null;
  }
  public getAccount(): AccountInfo | null {
    if (!this.myMSALObj) {
      return AuthModule.msalAppNotCreated();
    }
    // need to call getAccount here?
    const currentAccounts = this.myMSALObj.getAllAccounts();
    if (currentAccounts === null) {
      console.log("No accounts detected");
      return null;
    }

    if (currentAccounts.length > 1) {
      // Add choose account code here
      console.log(
        "Multiple accounts detected, need to add choose account code.",
        currentAccounts
      );
      this.myMSALObj.setActiveAccount(currentAccounts[0])
      return currentAccounts[0];
    } else if (currentAccounts.length === 1) {
      this.myMSALObj.setActiveAccount(currentAccounts[0])
      return currentAccounts[0];
    }

    return null;
  }

  /**
   * Checks whether we are in the middle of a redirect and handles state accordingly. Only required for redirect flows.
   *
   * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/initialization.md#redirect-apis
   */
  loadAuthModule(): Promise<any> | null {
    if (!this.myMSALObj) {
      return AuthModule.msalAppNotCreated();
    }
    return this.myMSALObj
      .handleRedirectPromise()
      .then((resp: AuthenticationResult | null) => {
        this.handleResponse(resp);
      })
      .catch(console.error);
  }

  /**
   * Handles the response from a popup or redirect. If response is null, will check if we have any accounts and attempt to sign in.
   * @param response
   */
  handleResponse(response: AuthenticationResult | null) {
    if (response !== null) {
      this.account = response.account;
    } else {
      this.account = this.getAccount();
    }
    if (this.account) {
      this.silentLoginRequest.loginHint = this.account.username || "";
      console.log("User: ", this.account);
    }
  }

  /**
   * Calls ssoSilent to attempt silent flow. If it fails due to interaction required error, it will prompt the user to login using popup.
   * @param request
   */
  attemptSsoSilent() {
    if (!this.myMSALObj) {
      return AuthModule.msalAppNotCreated();
    }
    this.myMSALObj
      .ssoSilent(this.silentLoginRequest)
      .then(() => {
        this.account = this.getAccount();
        if (this.account) {
          console.log("User: ", this.account);
        } else {
          console.log("No account!");
        }
      })
      .catch((error) => {
        console.error("Silent Error: " + error);
        if (error instanceof InteractionRequiredAuthError) {
          this.login("loginRedirect");
        }
      });
  }

  /**
   * Calls loginPopup or loginRedirect based on given signInType.
   * @param signInType
   */
  login(signInType: string): void | null | Promise<any> {
    if (!this.myMSALObj) {
      return AuthModule.msalAppNotCreated();
    }
    if (signInType === "loginPopup") {
      this.myMSALObj
        .loginPopup(this.loginRequest)
        .then((resp: AuthenticationResult) => {
          this.handleResponse(resp);
        })
        .catch(console.error);
    } else if (signInType === "loginRedirect") {
      return this.myMSALObj.loginRedirect(this.loginRedirectRequest);
    }
  }

  /**
   * Logs out of current account.
   */
  logout(): void | null {
    if (!this.myMSALObj) {
      return AuthModule.msalAppNotCreated();
    }
    let account: AccountInfo | undefined;
    if (this.account) {
      account = this.account;
    }
    const logOutRequest: EndSessionRequest = {
      account,
    };

    this.myMSALObj.logoutRedirect(logOutRequest);
  }

  /**
   * Gets a token silently, or falls back to interactive redirect.
   */
  public async getTokenRedirect(): Promise<string | null> {
    if (!this.myMSALObj) {
      return AuthModule.msalAppNotCreated();
    }
    const account = this.myMSALObj.getActiveAccount();
    if (account) {
      console.log('here acc', account);
      this.silentProfileRequest = { ...this.silentProfileRequest, account };
      try {
        const response = await this.myMSALObj.acquireTokenSilent(
          this.silentProfileRequest
        );
        return response.accessToken;
      } catch (e) {
        console.log("silent token acquisition fails.");
        if (e instanceof InteractionRequiredAuthError) {
          console.log("acquiring token using redirect");
          this.myMSALObj
            .acquireTokenRedirect(this.profileRedirectRequest)
            .catch(console.error);
        } else {
          console.error(e);
        }
      }
    }
console.log('no acc');
    return null;
  }
}
