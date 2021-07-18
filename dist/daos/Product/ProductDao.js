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
const OracleDB_1 = __importDefault(require("@daos/OracleDb/OracleDB"));
const Product_1 = require("@entities/Product");
const Result_1 = require("@entities/Result");
const ProductRes_1 = require("../../response/ProductRes");
const CategoryDao_1 = __importDefault(require("../Categories.ts/CategoryDao"));
const ProductUpdateReq_1 = require("../../request/ProductUpdateReq");
const categoryDao = new CategoryDao_1.default();
class ProductDao extends OracleDB_1.default {
    constructor() {
        super(...arguments);
        this.tableName = "PRODUCTS";
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = this.OpenDB();
            if (db) {
                let productRes;
                const result = yield db(this.tableName)
                    .select("*")
                    .where("ID", id)
                    .first();
                if (result === null || result === void 0 ? void 0 : result.CATEGORYID) {
                    const category = yield db("CATEGORIES")
                        .select("*")
                        .where("ID", result.CATEGORYID)
                        .first();
                    if (category) {
                        productRes = new ProductRes_1.ProductRes(result, category);
                        return new Result_1.Result(productRes);
                    }
                }
                return new Result_1.Result(null);
            }
            return new Result_1.Result(null, "Lỗi");
        });
    }
    getManyByIds(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = this.OpenDB();
            if (db) {
                const result = yield db(this.tableName)
                    .select("*")
                    .whereIn("ID", ids);
                return new Result_1.Result(result);
            }
            return new Result_1.Result(null, "Lỗi");
        });
    }
    filter(productReq) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = this.OpenDB();
            if (!productReq.PAGEINDEX) {
                productReq.PAGEINDEX = 1;
            }
            if (!productReq.PAGESIZE) {
                productReq.PAGESIZE = 20;
            }
            if (db) {
                const tmp = db(this.tableName);
                if (productReq.NAME) {
                    tmp.whereRaw(`LOWER(NAME) LIKE ?`, [
                        `%${productReq.NAME.toLowerCase()}%`,
                    ]);
                }
                const countQuery = tmp.clone();
                const { COUNT } = (yield countQuery.count("* AS COUNT").first());
                if (productReq.ORDERBYNAME) {
                    if (productReq.ORDERBYASC != undefined) {
                        tmp.orderBy([
                            {
                                column: productReq.ORDERBYNAME,
                                order: productReq.ORDERBYASC ? "asc" : "desc",
                            },
                        ]);
                    }
                    else {
                        tmp.orderBy([{ column: productReq.ORDERBYNAME, order: "asc" }]);
                    }
                }
                tmp
                    .limit(productReq.PAGESIZE)
                    .offset((productReq.PAGEINDEX - 1) * productReq.PAGESIZE);
                const result = yield tmp.select("*");
                const categoryIds = [...new Set(result.map((p) => p.CATEGORYID))];
                const categories = yield categoryDao.getManyByIds(categoryIds);
                const productRes = result.map((p) => {
                    var _a;
                    const category = (_a = categories.data) === null || _a === void 0 ? void 0 : _a.find((z) => z.ID === p.CATEGORYID);
                    if (category) {
                        return new ProductRes_1.ProductRes(p, category);
                    }
                    else {
                        return new ProductRes_1.ProductRes(p, {});
                    }
                });
                return new Result_1.Result(productRes, "", COUNT);
            }
            return new Result_1.Result([], "");
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = this.OpenDB();
            if (db) {
                const result = yield db(this.tableName).select("*");
                return new Result_1.Result(result);
            }
            return new Result_1.Result([]);
        });
    }
    add(productReq) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = this.OpenDB();
            const product = new Product_1.Product(productReq);
            if (db) {
                const transaction = yield db.transaction();
                try {
                    yield db(this.tableName)
                        .transacting(transaction)
                        .insert(product);
                    transaction.commit();
                    return new Result_1.Result(product.ID);
                }
                catch (e) {
                    transaction.rollback();
                    return new Result_1.Result(null, e.message);
                }
            }
            return new Result_1.Result(null, "connect oracle err");
        });
    }
    update(productReq) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = this.OpenDB();
            if (!productReq.ID) {
                return new Result_1.Result(null);
            }
            const productUpdateReq = new ProductUpdateReq_1.ProductUpdateReq(productReq);
            if (db) {
                const transaction = yield db.transaction();
                try {
                    const result = yield db(this.tableName)
                        .transacting(transaction)
                        .where("ID", productReq.ID)
                        .update(productUpdateReq);
                    transaction.commit();
                    if (result > 0) {
                        return new Result_1.Result(productReq.ID);
                    }
                    return new Result_1.Result(null);
                }
                catch (e) {
                    transaction.rollback();
                    return new Result_1.Result(null);
                }
            }
            return new Result_1.Result(null, "connect oracle err");
        });
    }
    changeSold(proudctId, sold, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = this.OpenDB();
            if (!proudctId) {
                return new Result_1.Result(null);
            }
            if (db) {
                let soldNew = 0;
                try {
                    const product = yield this.getById(proudctId);
                    if (product && product.data) {
                        soldNew = product.data.SOLD + sold;
                    }
                    else {
                        return new Result_1.Result(null, "productId không tồn tại");
                    }
                    const result = yield db(this.tableName)
                        .transacting(transaction)
                        .where("ID", proudctId)
                        .update("SOLD", soldNew);
                    return new Result_1.Result(result);
                }
                catch (e) {
                    transaction.rollback();
                    return new Result_1.Result(null);
                }
            }
            return new Result_1.Result(null, "connect oracle err");
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = this.OpenDB();
            if (db) {
                try {
                    yield db(this.tableName).where("ID", id).del();
                    return new Result_1.Result(id);
                }
                catch (e) {
                    return new Result_1.Result(null, "Lỗi");
                }
            }
            return new Result_1.Result(null, "Lỗi");
        });
    }
}
exports.default = ProductDao;
