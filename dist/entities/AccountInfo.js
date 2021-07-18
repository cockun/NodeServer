"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountInfo = void 0;
const Helper_1 = require("../utils/Helper");
class AccountInfo {
    constructor(accountReq) {
        var _a, _b, _c, _d;
        this.ACCOUNTID = accountReq.ID ? accountReq.ID : "";
        this.ID = Helper_1.Helper.generateUID();
        this.FULLNAME = accountReq.FULLNAME ? accountReq.FULLNAME : "";
        this.ADDRESS = accountReq.ADDRESS ? accountReq.ADDRESS : "";
        this.PHONE = accountReq.PHONE ? accountReq.PHONE : "";
        this.POINTS = 0;
        this.ROLEID = (_a = accountReq.ROLE) !== null && _a !== void 0 ? _a : "";
        this.CREATEDATE = new Date(Date.now());
        this.SEX = (_b = accountReq.SEX) !== null && _b !== void 0 ? _b : "NAM";
        this.EMAIL = (_c = accountReq.EMAIL) !== null && _c !== void 0 ? _c : "";
        this.BIRTHDAY = new Date((_d = accountReq.BIRTHDAY) !== null && _d !== void 0 ? _d : new Date(1995, 1, 1).toJSON());
    }
}
exports.AccountInfo = AccountInfo;
