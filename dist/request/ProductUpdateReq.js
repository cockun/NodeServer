"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductUpdateReq = void 0;
class ProductUpdateReq {
    constructor(productReq) {
        this.NAME = productReq.NAME;
        this.PRICE = productReq.PRICE;
        this.CATEGORYID = productReq.CATEGORYID;
        this.IMGSRC = productReq.IMGSRC;
        this.DISCOUNT = productReq.DISCOUNT;
        this.DESCRIPTION = productReq.DESCRIPTION;
    }
}
exports.ProductUpdateReq = ProductUpdateReq;
