"use strict";
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
exports.attemptSsoSilent = exports.signOut = exports.signIn = exports.loadAuthApp = exports.creatMsalApplication = exports.AzureAuth = void 0;
var AuthModule_1 = require("./AuthModule");
// Browser check variables
// If you support IE, our recommendation is that you sign-in using Redirect APIs
// If you as a developer are testing using Edge InPrivate mode, please add "isEdge" to the if check
var ua = window.navigator.userAgent;
var msie = ua.indexOf("MSIE ");
var msie11 = ua.indexOf("Trident/");
var isIE = msie > 0 || msie11 > 0;
var authModule = new AuthModule_1.AuthModule();
// Load auth module when browser window loads. Only required for redirect flows.
window.addEventListener("load", function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        authModule.loadAuthModule();
        return [2 /*return*/];
    });
}); });
/**
 * Called when user clicks "Sign in with Redirect" or "Sign in with Popup"
 */
var AzureAuth = /** @class */ (function () {
    function AzureAuth() {
    }
    AzureAuth.prototype.creatMsalApplication = function (config) {
        authModule.createAuthApplication(config);
    };
    AzureAuth.prototype.loadAuthApp = function () {
        authModule.loadAuthModule();
    };
    AzureAuth.prototype.signIn = function () {
        return authModule.login("loginRedirect");
    };
    AzureAuth.prototype.signOut = function () {
        authModule.logout();
    };
    AzureAuth.prototype.attemptSsoSilent = function () {
        authModule.getAccount();
    };
    AzureAuth.prototype.getAccount = function () {
        return authModule.getAccount();
    };
    AzureAuth.prototype.getTokens = function () {
        return authModule.getTokenRedirect();
    };
    return AzureAuth;
}());
exports.AzureAuth = AzureAuth;
function creatMsalApplication(config) {
    authModule.createAuthApplication(config);
}
exports.creatMsalApplication = creatMsalApplication;
function loadAuthApp() {
    authModule.loadAuthModule();
}
exports.loadAuthApp = loadAuthApp;
function signIn() {
    authModule.login("loginRedirect");
}
exports.signIn = signIn;
/**
 * Called when user clicks "Sign Out"
 */
function signOut() {
    authModule.logout();
}
exports.signOut = signOut;
/**
 * Called when user clicks "Attempt SsoSilent"
 */
function attemptSsoSilent() {
    authModule.attemptSsoSilent();
}
exports.attemptSsoSilent = attemptSsoSilent;
