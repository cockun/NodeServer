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
exports.updateOneAccountInfo = exports.getOneById = exports.getAllAccountInfos = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AccountInfoDao_1 = __importDefault(require("@daos/Account/AccountInfoDao"));
const constants_1 = require("@shared/constants");
const accountInfoDao = new AccountInfoDao_1.default();
const { BAD_REQUEST, CREATED, OK } = http_status_codes_1.default;
/**
 * Get all Accounts.
 *
 * @param req
 * @param res
 * @returns
 */
function getAllAccountInfos(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const accountInfos = yield accountInfoDao.getAll();
        return res.status(OK).json({ accountInfos });
    });
}
exports.getAllAccountInfos = getAllAccountInfos;
function getOneById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data } = req.body;
        const accounts = yield accountInfoDao.getById(data.id);
        return res.status(OK).json({ accounts });
    });
}
exports.getOneById = getOneById;
/**
 * Add one user.
 *
 * @param req
 * @param res
 * @returns
 */
/**
 * Update one account.
 *
 * @param req
 * @param res
 * @returns
 */
function updateOneAccountInfo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data } = req.body;
        if (!data) {
            return res.status(BAD_REQUEST).json({
                error: constants_1.paramMissingError,
            });
        }
        const accountInfo = yield accountInfoDao.update(data);
        return res.status(OK).json(accountInfo);
    });
}
exports.updateOneAccountInfo = updateOneAccountInfo;
