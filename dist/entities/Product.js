"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const Helper_1 = require("../utils/Helper");
class Product {
    constructor(productReq) {
        this.ID = Helper_1.Helper.generateUID();
        this.NAME = productReq.NAME ? productReq.NAME : "";
        this.PRICE = productReq.PRICE ? productReq.PRICE : 0;
        this.CATEGORYID = productReq.CATEGORYID ? productReq.CATEGORYID : '';
        this.IMGSRC = productReq.IMGSRC ? productReq.IMGSRC : "";
        this.DISCOUNT = productReq.DISCOUNT ? productReq.DISCOUNT : 0;
        this.DESCRIPTION = productReq.DESCRIPTION ? productReq.DESCRIPTION : "";
        this.SOLD = 0;
        this.CREATEDATE = new Date(Date.now());
    }
}
exports.Product = Product;
