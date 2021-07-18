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
exports.deleteOneProduct = exports.updateOneProduct = exports.addOneProduct = exports.filler = exports.getById = exports.getAllProducts = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const ProductDao_1 = __importDefault(require("@daos/Product/ProductDao"));
const constants_1 = require("@shared/constants");
const productDao = new ProductDao_1.default();
const { BAD_REQUEST, CREATED, OK } = http_status_codes_1.default;
function getAllProducts(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const products = yield productDao.getAll();
        return res.status(OK).json(products);
    });
}
exports.getAllProducts = getAllProducts;
function getById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { ID } = req.params;
        const product = yield productDao.getById(ID);
        return res.status(OK).json(product);
    });
}
exports.getById = getById;
function filler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = req.query;
        const product = yield productDao.filter(data);
        return res.status(OK).json(product);
    });
}
exports.filler = filler;
/**
 * Add one user.
 *
 * @param req
 * @param res
 * @returns
 */
function addOneProduct(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data } = req.body;
        if (!data) {
            return res.status(BAD_REQUEST).json({
                error: constants_1.paramMissingError,
            });
        }
        const ID = yield productDao.add(data);
        return res.status(OK).json(ID);
    });
}
exports.addOneProduct = addOneProduct;
/**
 * Update one product.
 *
 * @param req
 * @param res
 * @returns
 */
function updateOneProduct(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data } = req.body;
        if (!data) {
            return res.status(BAD_REQUEST).json({
                error: constants_1.paramMissingError,
            });
        }
        const result = yield productDao.update(data);
        return res.status(OK).json(result);
    });
}
exports.updateOneProduct = updateOneProduct;
/**
 * Delete one product.
 *
 * @param req
 * @param res
 * @returns
 */
function deleteOneProduct(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        const result = yield productDao.delete(id);
        return res.status(OK).end();
    });
}
exports.deleteOneProduct = deleteOneProduct;
