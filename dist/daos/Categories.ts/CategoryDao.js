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
const Categories_1 = require("@entities/Categories");
const Result_1 = require("@entities/Result");
class CategoryDao extends OracleDB_1.default {
    constructor() {
        super(...arguments);
        this.tableName = "CATEGORIES";
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = this.OpenDB();
            if (db) {
                const result = yield db(this.tableName)
                    .select("*")
                    .where("ID", id)
                    .first();
                return new Result_1.Result(result);
            }
            return undefined;
        });
    }
    filler(categoryReq) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = this.OpenDB();
            if (!categoryReq.PAGEINDEX || !categoryReq.PAGESIZE) {
                categoryReq.PAGEINDEX = 1;
                categoryReq.PAGESIZE = 20;
            }
            if (db) {
                const result = yield db(this.tableName)
                    .select("*")
                    .where(categoryReq)
                    .orderBy([{ column: "DISCOUNT" }])
                    .limit(categoryReq.PAGESIZE)
                    .offset((categoryReq.PAGEINDEX - 1) * categoryReq.PAGESIZE);
                return new Result_1.Result(result);
            }
            return new Result_1.Result([]);
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = this.OpenDB();
            if (db) {
                const result = yield db(this.tableName).select("*");
                return new Result_1.Result(result);
            }
            return undefined;
        });
    }
    getManyByIds(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = this.OpenDB();
            if (db) {
                const result = yield db(this.tableName).select("*").whereIn('ID', data);
                return new Result_1.Result(result);
            }
            return new Result_1.Result(null, "Lỗi");
        });
    }
    add(categoryReq) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = this.OpenDB();
            let category;
            if (categoryReq.CATEGORYNAME) {
                category = new Categories_1.Category(categoryReq.CATEGORYNAME);
            }
            else {
                return new Result_1.Result(null, 'Thiếu thông tin');
            }
            if (db) {
                const transaction = yield db.transaction();
                try {
                    yield db(this.tableName)
                        .transacting(transaction)
                        .insert(category);
                    transaction.commit();
                    transaction.rollback();
                    return new Result_1.Result(category.ID);
                }
                catch (e) {
                    transaction.rollback();
                    return new Result_1.Result(null, e.message);
                }
            }
            return new Result_1.Result(null, "connect oracle err");
        });
    }
    update(category) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = this.OpenDB();
            if (!category.ID) {
                return new Result_1.Result(null);
            }
            if (db) {
                const transaction = yield db.transaction();
                try {
                    const result = yield db(this.tableName)
                        .transacting(transaction)
                        .where("ID", category.ID)
                        .update(category)
                        .returning("*");
                    transaction.commit();
                    return new Result_1.Result(result[1]);
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
                const transaction = yield db.transaction();
                try {
                    yield db(this.tableName).where("ID", id).del();
                    transaction.commit();
                }
                catch (e) {
                    transaction.rollback();
                }
            }
        });
    }
}
exports.default = CategoryDao;
