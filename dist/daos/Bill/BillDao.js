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
const Result_1 = require("@entities/Result");
const Bills_1 = require("@entities/Bills");
const ProductDao_1 = __importDefault(require("../Product/ProductDao"));
const Billinfo_1 = require("../../entities/Billinfo");
const BillInfoDao_1 = __importDefault(require("./BillInfoDao"));
const AccountInfoDao_1 = __importDefault(require("../Account/AccountInfoDao"));
const billInfoDao = new BillInfoDao_1.default();
const productDao = new ProductDao_1.default();
const accountInfoDao = new AccountInfoDao_1.default();
class BillDao extends OracleDB_1.default {
    constructor() {
        super(...arguments);
        this.tableName = "BILLS";
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
    // get bill with accountid
    getManyById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = this.OpenDB();
            if (db) {
                const result = yield db(this.tableName)
                    .select("*")
                    .where("ACCOUNTID", id);
                return new Result_1.Result(result);
            }
            return new Result_1.Result(null, "Lỗi");
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = this.OpenDB();
            if (db) {
                const result = yield db(this.tableName).select("*");
                return new Result_1.Result(result);
            }
            return new Result_1.Result([], "Connect Oracle Error");
        });
    }
    filter(billReq) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = this.OpenDB();
            if (!billReq.PAGEINDEX) {
                billReq.PAGEINDEX = 1;
            }
            if (!billReq.PAGESIZE) {
                billReq.PAGESIZE = 20;
            }
            if (db) {
                const tmp = db(this.tableName);
                if (billReq.ACCOUNTID) {
                    tmp.where("ACCOUNTID", billReq.ACCOUNTID);
                }
                if (billReq.FULLNAME) {
                    tmp.whereRaw(`LOWER(FULLNAME) LIKE ?`, [
                        `%${billReq.FULLNAME.toLowerCase()}%`,
                    ]);
                }
                if (billReq.FROMDATE && billReq.TODATE) {
                    tmp
                        .where("DATEBUY", "<=", new Date(billReq.TODATE))
                        .where("DATEBUY", ">=", new Date(billReq.FROMDATE));
                }
                const countQuery = tmp.clone();
                const { COUNT } = (yield countQuery.count("* AS COUNT").first());
                if (billReq.ORDERBYNAME) {
                    if (billReq.ORDERBYASC != undefined) {
                        tmp.orderBy([
                            {
                                column: billReq.ORDERBYNAME,
                                order: billReq.ORDERBYASC ? "asc" : "desc",
                            },
                        ]);
                    }
                    else {
                        tmp.orderBy([{ column: billReq.ORDERBYNAME, order: "asc" }]);
                    }
                }
                tmp
                    .limit(billReq.PAGESIZE)
                    .offset((billReq.PAGEINDEX - 1) * billReq.PAGESIZE);
                console.log(tmp.toQuery());
                let bill = yield tmp.select("*");
                const billIds = bill.map((p) => p.ID);
                if (billIds.length > 0) {
                    const billInfos = (yield billInfoDao.getByIdBill(billIds)).data;
                    bill = bill.map((p) => {
                        return Object.assign(Object.assign({}, p), { BILLINFOS: billInfos === null || billInfos === void 0 ? void 0 : billInfos.filter((billinfo) => billinfo.BILLID === p.ID) });
                    });
                }
                return new Result_1.Result(bill, "", COUNT);
            }
            return new Result_1.Result([], "");
        });
    }
    add(billReq) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!billReq.ACCOUNTID) {
                    return new Result_1.Result(null, "Thiếu thông tin");
                }
                const db = this.OpenDB();
                const bill = new Bills_1.Bill(billReq);
                bill.BILLSTATUS = "Hoàn thành";
                if (!billReq.BILLINFOS) {
                    return new Result_1.Result(null, "Lỗi thiếu thông tin");
                }
                const productIds = (_a = billReq.BILLINFOS.map((p) => p.PRODUCTID)) !== null && _a !== void 0 ? _a : [];
                const products = (yield productDao.getManyByIds(productIds)).data;
                if (!products) {
                    return new Result_1.Result(null, "Mã sản phẩm lỗi");
                }
                let total = 0;
                const billInfos = billReq.BILLINFOS.map((p) => {
                    const product = products.find((z) => z.ID === p.PRODUCTID);
                    if (product) {
                        return new Billinfo_1.BillInfo(bill.ID, p.PRODUCTID, product.NAME, p.QUANTITY, product.DISCOUNT);
                    }
                    else {
                        return {};
                    }
                });
                billInfos.forEach((p) => {
                    total = total + p.QUANTITY * p.PRICE;
                });
                bill.TOTAL = total;
                if (db) {
                    const transaction = yield db.transaction();
                    yield db(this.tableName).transacting(transaction).insert(bill);
                    const tmp = yield billInfoDao.add(billInfos, transaction);
                    //SOLD
                    for (let i = 0; i < billInfos.length; ++i) {
                        const tmp = yield productDao.changeSold(billInfos[i].PRODUCTID, billInfos[i].QUANTITY, transaction);
                        if (!tmp.data) {
                            return new Result_1.Result(null, tmp.err ? tmp.err : "Lỗi");
                        }
                    }
                    //Points
                    const resultChangePoint = yield accountInfoDao.changePoint(bill.ACCOUNTID, bill.TOTAL / 100, transaction);
                    if (tmp && tmp.data && resultChangePoint) {
                        transaction.commit();
                        return new Result_1.Result(bill.ID);
                    }
                    else {
                        transaction.rollback();
                        return new Result_1.Result(null, tmp.err ? tmp.err : "Lỗi");
                    }
                }
                return new Result_1.Result(null, "connect oracle err");
            }
            catch (e) {
                return new Result_1.Result(null, e.message);
            }
        });
    }
    update(billReq) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = this.OpenDB();
            if (!billReq.ID) {
                return new Result_1.Result(null, "Bill không tồn tại");
            }
            if (!billReq.BILLSTATUS) {
                return new Result_1.Result(null);
            }
            if (db) {
                const transaction = yield db.transaction();
                try {
                    if (billReq.BILLSTATUS == "Hoàn thành") {
                        const bill = yield this.getById(billReq.ID);
                        if (!bill || !bill.data) {
                            return new Result_1.Result(null, "Bill không tồn tại");
                        }
                        const accountInfoDao = new AccountInfoDao_1.default();
                        const resultChangePoint = yield accountInfoDao.changePoint(bill.data.ACCOUNTID, bill.data.TOTAL / 100, transaction);
                        if (!resultChangePoint.data) {
                            return new Result_1.Result(null, resultChangePoint.err ? resultChangePoint.err : "Lỗi");
                        }
                    }
                    const result = yield db(this.tableName)
                        .transacting(transaction)
                        .where("ID", billReq.ID)
                        .update("BILLSTATUS", billReq.BILLSTATUS)
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
exports.default = BillDao;
