"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillInfo = void 0;
const Helper_1 = require("../utils/Helper");
class BillInfo {
    constructor(BillID, ProductID, PRODUCTNAME, Quantity, Price) {
        this.ID = Helper_1.Helper.generateUID();
        this.BILLID = BillID;
        this.PRODUCTID = ProductID;
        this.PRODUCTNAME = PRODUCTNAME;
        this.QUANTITY = Quantity;
        this.PRICE = Price;
    }
}
exports.BillInfo = BillInfo;
