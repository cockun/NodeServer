"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryReq = void 0;
const Helper_1 = require("../utils/Helper");
class CategoryReq {
    constructor(CategoryName) {
        this.ID = Helper_1.Helper.generateUID();
        this.CATEGORYNAME = CategoryName;
    }
}
exports.CategoryReq = CategoryReq;
