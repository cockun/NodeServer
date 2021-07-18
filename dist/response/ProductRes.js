"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRes = void 0;
class ProductRes {
    constructor(product, category) {
        this.ID = product.ID;
        this.NAME = product.NAME;
        this.PRICE = product.PRICE;
        this.CATEGORY = category;
        this.IMGSRC = product.IMGSRC;
        this.DISCOUNT = product.DISCOUNT;
        this.DESCRIPTION = product.DESCRIPTION;
        this.SOLD = product.SOLD;
    }
}
exports.ProductRes = ProductRes;
