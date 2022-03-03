"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
var msal_browser_1 = require("@azure/msal-browser");
/**
 * Configuration class for @azure/msal-browser:
 * https://azuread.github.io/microsoft-authentication-library-for-js/ref/msal-browser/modules/_src_config_configuration_.html
 */
/**
 * AuthModule for application - handles authentication in app.
 */
var AuthModule = /** @class */ (function () {
    function AuthModule() {
        this.msalConfig = {
            auth: {
                clientId: "",
            },
            cache: {
                cacheLocation: "localStorage",
                storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
            },
            system: {
                loggerOptions: {
                    loggerCallback: function (level, message, containsPii) {
                        if (containsPii) {
                            return;
                        }
                        switch (level) {
                            case msal_browser_1.LogLevel.Error:
                                console.error(message);
                                return;
                            case msal_browser_1.LogLevel.Info:
                                console.info(message);
                                return;
                            case msal_browser_1.LogLevel.Verbose:
                                console.debug(message);
                                return;
                            case msal_browser_1.LogLevel.Warning:
                                console.warn(message);
                                return;
                        }
                    },
                },
            },
        };
        this.account = null;
        this.loginRequest = {
            scopes: [],
        };
        this.loginRedirectRequest = __assign(__assign({}, this.loginRequest), { redirectStartPage: window.location.href });
        this.profileRequest = {
            scopes: ["User.Read"],
        };
        this.profileRedirectRequest = __assign(__assign({}, this.profileRequest), { redirectStartPage: window.location.href });
        this.silentProfileRequest = {
            scopes: ["openid", "profile", "User.Read"],
            forceRefresh: false,
        };
        this.silentLoginRequest = {
            loginHint: "",
        };
    }
    AuthModule.prototype.createAuthApplication = function (config) {
        var _this = this;
        var _a;
        if (!config.clientId)
            return { msg: "auth config is empty or not full" };
        this.msalConfig.auth.clientId = config.clientId;
        if (config.authority) {
            this.msalConfig.auth.redirectUri = config.redirectUri;
        }
        if (config.authority) {
            this.msalConfig.auth.authority = config.authority;
        }
        this.myMSALObj = new msal_browser_1.PublicClientApplication(this.msalConfig);
        (_a = this.loadAuthModule()) === null || _a === void 0 ? void 0 : _a.then(function (res) { return _this.getTokenRedirect(); });
    };
    /**
     * Calls getAllAccounts and determines the correct account to sign into, currently defaults to first account found in cache.
     * TODO: Add account chooser code
     *
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-common/docs/Accounts.md
     */
    AuthModule.msalAppNotCreated = function () {
        console.log("msal app not created");
        return null;
    };
    AuthModule.prototype.getAccount = function () {
        if (!this.myMSALObj) {
            console.log("here1");
            return AuthModule.msalAppNotCreated();
        }
        // need to call getAccount here?
        var currentAccounts = this.myMSALObj.getAllAccounts();
        if (currentAccounts === null) {
            console.log("No accounts detected");
            return null;
        }
        if (currentAccounts.length > 1) {
            // Add choose account code here
            console.log("Multiple accounts detected, need to add choose account code.", currentAccounts);
            this.myMSALObj.setActiveAccount(currentAccounts[0]);
            return currentAccounts[0];
        }
        else if (currentAccounts.length === 1) {
            this.myMSALObj.setActiveAccount(currentAccounts[0]);
            return currentAccounts[0];
        }
        return null;
    };
    /**
     * Checks whether we are in the middle of a redirect and handles state accordingly. Only required for redirect flows.
     *
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/initialization.md#redirect-apis
     */
    AuthModule.prototype.loadAuthModule = function () {
        var _this = this;
        if (!this.myMSALObj) {
            return AuthModule.msalAppNotCreated();
        }
        return this.myMSALObj
            .handleRedirectPromise()
            .then(function (resp) {
            _this.handleResponse(resp);
        })
            .catch(console.error);
    };
    /**
     * Handles the response from a popup or redirect. If response is null, will check if we have any accounts and attempt to sign in.
     * @param response
     */
    AuthModule.prototype.handleResponse = function (response) {
        if (response !== null) {
            this.account = response.account;
        }
        else {
            this.account = this.getAccount();
        }
        if (this.account) {
            this.silentLoginRequest.loginHint = this.account.username || "";
        }
    };
    /**
     * Calls ssoSilent to attempt silent flow. If it fails due to interaction required error, it will prompt the user to login using popup.
     * @param request
     */
    AuthModule.prototype.attemptSsoSilent = function () {
        var _this = this;
        if (!this.myMSALObj) {
            return AuthModule.msalAppNotCreated();
        }
        this.myMSALObj
            .ssoSilent(this.silentLoginRequest)
            .then(function () {
            _this.account = _this.getAccount();
            if (_this.account) {
                console.log("User: ", _this.account);
            }
            else {
                console.log("No account!");
            }
        })
            .catch(function (error) {
            console.error("Silent Error: " + error);
            if (error instanceof msal_browser_1.InteractionRequiredAuthError) {
                _this.login("loginRedirect");
            }
        });
    };
    /**
     * Calls loginPopup or loginRedirect based on given signInType.
     * @param signInType
     */
    AuthModule.prototype.login = function (signInType) {
        var _this = this;
        if (!this.myMSALObj) {
            return AuthModule.msalAppNotCreated();
        }
        if (signInType === "loginPopup") {
            this.myMSALObj
                .loginPopup(this.loginRequest)
                .then(function (resp) {
                _this.handleResponse(resp);
            })
                .catch(console.error);
        }
        else if (signInType === "loginRedirect") {
            return this.myMSALObj.loginRedirect(this.loginRedirectRequest);
        }
    };
    /**
     * Logs out of current account.
     */
    AuthModule.prototype.logout = function () {
        if (!this.myMSALObj) {
            return AuthModule.msalAppNotCreated();
        }
        var account;
        if (this.account) {
            account = this.account;
        }
        var logOutRequest = {
            account: account,
        };
        this.myMSALObj.logoutRedirect(logOutRequest);
    };
    /**
     * Gets a token silently, or falls back to interactive redirect.
     */
    AuthModule.prototype.getTokenRedirect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var account, response, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("call gettokenredirect");
                        if (!this.myMSALObj) {
                            return [2 /*return*/, AuthModule.msalAppNotCreated()];
                        }
                        this.getAccount();
                        account = this.myMSALObj.getActiveAccount();
                        if (!account) return [3 /*break*/, 4];
                        this.silentProfileRequest = __assign(__assign({}, this.silentProfileRequest), { account: account });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.myMSALObj.acquireTokenSilent(this.silentProfileRequest)];
                    case 2:
                        response = _a.sent();
                        return [2 /*return*/, response.accessToken];
                    case 3:
                        e_1 = _a.sent();
                        console.log("silent token acquisition fails.");
                        if (e_1 instanceof msal_browser_1.InteractionRequiredAuthError) {
                            console.log("acquiring token using redirect");
                            this.myMSALObj
                                .acquireTokenRedirect(this.profileRedirectRequest)
                                .catch(console.error);
                        }
                        else {
                            console.error(e_1);
                        }
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, null];
                }
            });
        });
    };
    return AuthModule;
}());
exports.AuthModule = AuthModule;
