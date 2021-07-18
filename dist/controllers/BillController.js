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
exports.deleteOneBill = exports.updateOneBill = exports.GetManyById = exports.addOneBill = exports.filterBills = exports.getAllBills = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const BillDao_1 = __importDefault(require("@daos/Bill/BillDao"));
const constants_1 = require("@shared/constants");
const billDao = new BillDao_1.default();
const { BAD_REQUEST, CREATED, OK } = http_status_codes_1.default;
/**
 * Get all Accounts.
 *
 * @param req
 * @param res
 * @returns
 */
function getAllBills(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const bills = yield billDao.getAll();
        return res.status(OK).json(bills);
    });
}
exports.getAllBills = getAllBills;
function filterBills(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = req.query;
        if (!data) {
            return res.status(BAD_REQUEST).json({
                error: constants_1.paramMissingError,
            });
        }
        const result = yield billDao.filter(data);
        return res.status(OK).json(result);
    });
}
exports.filterBills = filterBills;
/**
 * Add one user.
 *
 * @param req
 * @param res
 * @returns
 */
function addOneBill(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data } = req.body;
        if (!data) {
            return res.status(BAD_REQUEST).json({
                error: constants_1.paramMissingError,
            });
        }
        const bill = yield billDao.add(data);
        return res.status(CREATED).json(bill);
    });
}
exports.addOneBill = addOneBill;
function GetManyById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data } = req.body;
        if (!data) {
            return res.status(BAD_REQUEST).json({
                error: constants_1.paramMissingError,
            });
        }
        const bill = yield billDao.getManyById(data.ACCOUNTID);
        return res.status(CREATED).json(bill);
    });
}
exports.GetManyById = GetManyById;
/**
 * Update one product.
 *
 * @param req
 * @param res
 * @returns
 */
function updateOneBill(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data } = req.body;
        if (!data) {
            return res.status(BAD_REQUEST).json({
                error: constants_1.paramMissingError,
            });
        }
        data.id = Number(data.id);
        yield billDao.update(data);
        return res.status(OK).end();
    });
}
exports.updateOneBill = updateOneBill;
/**
 * Delete one product.
 *
 * @param req
 * @param res
 * @returns
 */
function deleteOneBill(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        yield billDao.delete(id);
        return res.status(OK).end();
    });
}
exports.deleteOneBill = deleteOneBill;
