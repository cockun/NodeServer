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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AccountDao_1 = __importDefault(require("@daos/Account/AccountDao"));
const JwtService_1 = require("@shared/JwtService");
const constants_1 = require("@shared/constants");
const accountDao = new AccountDao_1.default();
const jwtService = new JwtService_1.JwtService();
const { BAD_REQUEST, OK, UNAUTHORIZED } = http_status_codes_1.default;
/**
 * Login in a user.
 *
 * @param req
 * @param res
 * @returns
 */
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // Check email and password present
        const { username, password } = req.body;
        if (!(username && password)) {
            return res.status(BAD_REQUEST).json({
                error: constants_1.paramMissingError,
            });
        }
        // Fetch user
        const user = yield accountDao.getByUser(username);
        if (!user) {
            return res.status(UNAUTHORIZED).json({
                error: constants_1.loginFailedErr,
            });
        }
        // Check password
        //const pwdPassed = await bcrypt.compare(password, user.pwdHash);
        // const pwdPassed = await bcrypt.compare(password, "");
        const pwdPassed = "sida";
        if (!pwdPassed) {
            return res.status(UNAUTHORIZED).json({
                error: constants_1.loginFailedErr,
            });
        }
        // Setup Admin Cookie
        const jwt = yield jwtService.getJwt({
            id: Number(""),
            role: Number(""),
        });
        const { key, options } = constants_1.cookieProps;
        res.cookie(key, jwt, options);
        // Return
        return res.status(OK).end();
    });
}
exports.login = login;
/**
 * Logout the user.
 *
 * @param req
 * @param res
 * @returns
 */
// eslint-disable-next-line @typescript-eslint/require-await
function logout(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { key, options } = constants_1.cookieProps;
        res.clearCookie(key, options);
        return res.status(OK).end();
    });
}
exports.logout = logout;
