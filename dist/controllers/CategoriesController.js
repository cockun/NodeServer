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
exports.deleteOneCategory = exports.updateOneCategory = exports.addOneCategory = exports.getCategoryById = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const constants_1 = require("@shared/constants");
const CategoryDao_1 = __importDefault(require("../daos/Categories.ts/CategoryDao"));
const categoryDao = new CategoryDao_1.default();
const { BAD_REQUEST, CREATED, OK } = http_status_codes_1.default;
/**
 * Get all Accounts.
 *
 * @param req
 * @param res
 * @returns
 */
function getCategoryById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { ID } = req.params;
        const category = yield categoryDao.getById(ID);
        return res.status(OK).json(category);
    });
}
exports.getCategoryById = getCategoryById;
function addOneCategory(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data } = req.body;
        if (!data) {
            return res.status(BAD_REQUEST).json({
                error: constants_1.paramMissingError,
            });
        }
        const ID = yield categoryDao.add(data);
        return res.status(OK).json(ID);
    });
}
exports.addOneCategory = addOneCategory;
/**
 * Update one category.
 *
 * @param req
 * @param res
 * @returns
 */
function updateOneCategory(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data } = req.body;
        if (!data) {
            return res.status(BAD_REQUEST).json({
                error: constants_1.paramMissingError,
            });
        }
        const category = yield categoryDao.update(data);
        return res.status(OK).json(category);
    });
}
exports.updateOneCategory = updateOneCategory;
/**
 * Delete one category.
 *
 * @param req
 * @param res
 * @returns
 */
function deleteOneCategory(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        yield categoryDao.delete(id);
        return res.status(OK).end();
    });
}
exports.deleteOneCategory = deleteOneCategory;
