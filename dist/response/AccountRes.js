"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountRes = void 0;
class AccountRes {
    constructor(ID, USERNAME, FULLNAME, ADDRESS, PHONE, ROLE, POINTS, CREATEDATE, SEX, EMAIL, BIRTHDAY) {
        this.ACCOUNTID = ID;
        this.USERNAME = USERNAME;
        this.FULLNAME = FULLNAME;
        this.ADDRESS = ADDRESS;
        this.PHONE = PHONE;
        this.ROLENAME = ROLE;
        this.POINTS = POINTS;
        this.CREATEDATE = CREATEDATE;
        this.SEX = SEX;
        this.EMAIL = EMAIL;
        this.BIRTHDAY = BIRTHDAY;
    }
}
exports.AccountRes = AccountRes;
