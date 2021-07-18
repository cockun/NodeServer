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
exports.deleteOneAccount = exports.updateOneAccount = exports.addOneAccount = exports.getOne = exports.getLogin = exports.getOneById = exports.filter = exports.getAllAccounts = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AccountDao_1 = __importDefault(require("@daos/Account/AccountDao"));
const constants_1 = require("@shared/constants");
const accountDao = new AccountDao_1.default();
const { BAD_REQUEST, CREATED, OK } = http_status_codes_1.default;
function getAllAccounts(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const accounts = yield accountDao.getAll();
        return res.status(OK).json({ accounts });
    });
}
exports.getAllAccounts = getAllAccounts;
function filter(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = req.query;
        const accounts = yield accountDao.filter(data);
        return res.status(OK).json(accounts);
    });
}
exports.filter = filter;
function getOneById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { ID } = req.params;
        const accounts = yield accountDao.getOneById(ID);
        return res.status(OK).json(accounts);
    });
}
exports.getOneById = getOneById;
function getLogin(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data } = req.body;
        const accounts = yield accountDao.Login(data);
        return res.status(OK).json(accounts);
    });
}
exports.getLogin = getLogin;
function getOne(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { USERNAME } = req.body;
        const accounts = yield accountDao.getByUser(USERNAME);
        return res.status(OK).json(accounts);
    });
}
exports.getOne = getOne;
/**
 * Add one user.
 *
 * @param req
 * @param res
 * @returns
 */
function addOneAccount(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data } = req.body;
        if (!data) {
            return res.status(BAD_REQUEST).json({
                error: constants_1.paramMissingError,
            });
        }
        const id = yield accountDao.add(data);
        return res.status(CREATED).json(id);
    });
}
exports.addOneAccount = addOneAccount;
/**
 * Update one account.
 *
 * @param req
 * @param res
 * @returns
 */
function updateOneAccount(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data } = req.body;
        if (!data) {
            return res.status(BAD_REQUEST).json({
                error: constants_1.paramMissingError,
            });
        }
        yield accountDao.update(data);
        return res.status(OK).end();
    });
}
exports.updateOneAccount = updateOneAccount;
/**
 * Delete one account.
 *
 * @param req
 * @param res
 * @returns
 */
function deleteOneAccount(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        yield accountDao.delete(id);
        return res.status(OK).end();
    });
}
exports.deleteOneAccount = deleteOneAccount;
