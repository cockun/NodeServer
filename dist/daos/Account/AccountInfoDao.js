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
const AccountInfo_1 = require("@entities/AccountInfo");
const Result_1 = require("@entities/Result");
class AccountDao extends OracleDB_1.default {
    constructor() {
        super(...arguments);
        this.tableName = "ACCOUNTINFO";
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
            return new Result_1.Result(null);
        });
    }
    getByIdAccount(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = this.OpenDB();
            if (db) {
                const result = yield db(this.tableName)
                    .select("*")
                    .where("ACCOUNTID", id)
                    .first();
                return new Result_1.Result(result);
            }
            return new Result_1.Result(null);
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = this.OpenDB();
            if (db) {
                const result = yield db(this.tableName).select("*");
                return new Result_1.Result(result);
            }
            return new Result_1.Result(null, "Truy vấn lỗi");
        });
    }
    add(accountReq, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = this.OpenDB();
            const accountInfo = new AccountInfo_1.AccountInfo(accountReq);
            if (db) {
                try {
                    const result = yield db(this.tableName)
                        .transacting(transaction)
                        .insert(accountInfo);
                    return new Result_1.Result(result);
                }
                catch (e) {
                    return new Result_1.Result(null, e.message);
                }
            }
            return new Result_1.Result(null, "connect oracle err");
        });
    }
    update(account) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = this.OpenDB();
            if (!account.ID) {
                return new Result_1.Result(null, "Thiếu thông tin");
            }
            if (db) {
                const transaction = yield db.transaction();
                try {
                    yield db(this.tableName)
                        .transacting(transaction)
                        .where("ACCOUNTID", account.ID)
                        .update(account);
                    transaction.commit();
                    return new Result_1.Result({ ID: account.ID });
                }
                catch (e) {
                    transaction.rollback();
                    return new Result_1.Result(null, e.message);
                }
            }
            return new Result_1.Result(null, "Lỗi connect oracle");
        });
    }
    changePoint(accountId, point, transaction) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const db = this.OpenDB();
            if (!accountId) {
                return new Result_1.Result(null);
            }
            const accountInfo = yield this.getByIdAccount(accountId);
            let pointNew = 0;
            if (accountInfo && accountInfo.data) {
                pointNew = ((_a = accountInfo.data) === null || _a === void 0 ? void 0 : _a.POINTS) + point;
            }
            else {
                return new Result_1.Result(null, accountInfo.err ? accountInfo.err : "Lỗi");
            }
            if (db) {
                try {
                    const result = yield db(this.tableName)
                        .transacting(transaction)
                        .where("ACCOUNTID", accountId)
                        .update({ "POINTS": pointNew });
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
}
exports.default = AccountDao;
