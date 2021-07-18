"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bill = void 0;
const Helper_1 = require("../utils/Helper");
class Bill {
    constructor(billReq) {
        var _a;
        this.ID = Helper_1.Helper.generateUID();
        this.TOTAL = 0;
        this.DATEBUY = new Date(Date.now());
        this.FULLNAME = billReq.FULLNAME ? billReq.FULLNAME : "";
        this.PHONE = billReq.PHONE ? billReq.PHONE : "";
        this.ADDRESS = billReq.ADDRESS ? billReq.ADDRESS : "";
        this.ACCOUNTID = billReq.ACCOUNTID ? billReq.ACCOUNTID : "";
        this.BILLSTATUS = (_a = billReq.BILLSTATUS) !== null && _a !== void 0 ? _a : "Đang xử lý";
    }
}
exports.Bill = Bill;
