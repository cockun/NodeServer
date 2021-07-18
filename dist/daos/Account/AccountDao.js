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
const Account_1 = require("@entities/Account");
const Result_1 = require("@entities/Result");
const md5_1 = __importDefault(require("md5"));
const AccountRes_1 = require("../../response/AccountRes");
const AccountInfoDao_1 = __importDefault(require("./AccountInfoDao"));
const accountInfoDao = new AccountInfoDao_1.default();
class AccountDao extends OracleDB_1.default {
    constructor() {
        super(...arguments);
        this.tableName = "ACCOUNTS";
    }
    getByUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = this.OpenDB();
            if (db) {
                const result = yield db(this.tableName)
                    .select("*")
                    .where("USERNAME", user)
                    .first();
                return new Result_1.Result(result);
            }
            return new Result_1.Result(null, "User không tồn tại");
        });
    }
    filter(accountReq) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = this.OpenDB();
            if (!accountReq.PAGEINDEX) {
                accountReq.PAGEINDEX = 1;
            }
            if (!accountReq.PAGESIZE) {
                accountReq.PAGESIZE = 20;
            }
            if (db) {
                let tmp;
                if (accountReq.FULLNAME) {
                    tmp = db("ACCOUNTINFO");
                    tmp.whereRaw(`LOWER(FULLNAME) LIKE ?`, [
                        `%${accountReq.FULLNAME.toLowerCase()}%`,
                    ]);
                }
                else {
                    if (accountReq.USERNAME) {
                        tmp = db(this.tableName);
                        tmp.whereRaw(`LOWER(USERNAME) LIKE ?`, [
                            `%${accountReq.USERNAME.toLowerCase()}%`,
                        ]);
                    }
                    else {
                        tmp = db("ACCOUNTS");
                    }
                }
                const countQuery = tmp.clone();
                const { COUNT } = (yield countQuery.count("* AS COUNT").first());
                if (accountReq.ORDERBYNAME) {
                    if (accountReq.ORDERBYASC != undefined) {
                        tmp.orderBy([
                            {
                                column: accountReq.ORDERBYNAME,
                                order: accountReq.ORDERBYASC ? "asc" : "desc",
                            },
                        ]);
                    }
                    else {
                        tmp.orderBy([{ column: accountReq.ORDERBYNAME, order: "asc" }]);
                    }
                }
                yield tmp
                    .limit(accountReq.PAGESIZE)
                    .offset((accountReq.PAGEINDEX - 1) * accountReq.PAGESIZE)
                    .as("s");
                if (accountReq.FULLNAME) {
                    //tmp.join("ACCOUNTS", { "ACCOUNTS.ID": "s.ACCOUNTID" });
                    tmp = db.from(tmp).join("ACCOUNTS", { "ACCOUNTS.ID": "s.ACCOUNTID" }).as("z");
                }
                else {
                    tmp = db
                        .from(tmp)
                        .join("ACCOUNTINFO", { "s.ID": "ACCOUNTINFO.ACCOUNTID" }).as("z");
                }
                // tmp = db.from (tmp).join("ROLE", { "z.ROLEID": "ROLE.ID" });
                // console.log(tmp.toQuery())
                const result = yield tmp.select("*");
                const result2 = result.map((p) => {
                    return new AccountRes_1.AccountRes(p.ACCOUNTID, p.USERNAME, p.FULLNAME, p.ADDRESS, p.PHONE, p.ROLENAME, p.POINTS, p.CREATEDATE, p.SEX, p.EMAIL, p.BIRTHDAY);
                });
                return new Result_1.Result(result2, "", COUNT);
            }
            return new Result_1.Result([], "");
        });
    }
    getOneById(id) {
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
    //login
    Login(accountReq) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = this.OpenDB();
            if (db) {
                if (accountReq.PASSWORD)
                    accountReq.PASSWORD = md5_1.default(accountReq.PASSWORD);
                const result = yield db(this.tableName)
                    .select("*")
                    .where(accountReq)
                    .join("ACCOUNTINFO", {
                    "ACCOUNTINFO.ACCOUNTID": "ACCOUNTS.ID",
                })
                    .join("ROLE", { "ROLE.ID": "ACCOUNTINFO.ROLEID" })
                    .first();
                //aa
                if (result) {
                    const accountRes = new AccountRes_1.AccountRes(result.ACCOUNTID, result.USERNAME, result.FULLNAME, result.ADDRESS, result.PHONE, result.ROLENAME, result.POINTS, result.CREATEDATE, result.SEX, result.EMAIL, result.BIRTHDAY);
                    return new Result_1.Result(accountRes);
                }
                return new Result_1.Result(null);
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
            return undefined;
        });
    }
    add(accountReq) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = this.OpenDB();
            let account;
            if (accountReq.USERNAME && accountReq.PASSWORD) {
                account = new Account_1.Account(accountReq.USERNAME, accountReq.PASSWORD);
                accountReq.ID = account.ID;
            }
            else {
                return new Result_1.Result(null, "Vui lòng nhập đủ thông tin");
            }
            if (db) {
                const transaction = yield db.transaction();
                try {
                    yield db(this.tableName)
                        .transacting(transaction)
                        .insert(account);
                    const result = yield accountInfoDao.add(accountReq, transaction);
                    if (result && result.data) {
                        transaction.commit();
                        return new Result_1.Result(account.ID);
                    }
                    else {
                        transaction.rollback();
                        return new Result_1.Result(null, result.err ? result.err : "Error");
                    }
                }
                catch (e) {
                    transaction.rollback();
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
                return new Result_1.Result(null);
            }
            if (db) {
                const transaction = yield db.transaction();
                try {
                    const result = yield db(this.tableName)
                        .transacting(transaction)
                        .where("ID", account.ID)
                        .update(account)
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
exports.default = AccountDao;
