"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillRes = void 0;
const Helper_1 = require("../utils/Helper");
class BillRes {
    constructor(billReq) {
        this.ID = Helper_1.Helper.generateUID();
        this.TOTAL = billReq.TOTAL ? billReq.TOTAL : 0;
        this.DATEBUY = billReq.DATEBUY ? billReq.DATEBUY : new Date(Date.now());
        this.FULLNAME = billReq.FULLNAME ? billReq.FULLNAME : "";
        this.PHONE = billReq.PHONE ? billReq.PHONE : "";
        this.ADDRESS = billReq.ADDRESS ? billReq.ADDRESS : "";
        this.ACCOUNTID = billReq.ACCOUNTID ? billReq.ACCOUNTID : "";
        this.BILLSTATUS = billReq.BILLSTATUS ? billReq.BILLSTATUS : "";
        this.BILLINFOS = [];
    }
}
exports.BillRes = BillRes;
