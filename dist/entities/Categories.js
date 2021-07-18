"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
const Helper_1 = require("../utils/Helper");
class Category {
    constructor(CategoryName) {
        this.ID = Helper_1.Helper.generateUID();
        this.CATEGORYNAME = CategoryName;
    }
}
exports.Category = Category;
