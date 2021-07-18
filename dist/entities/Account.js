"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Account = void 0;
const Helper_1 = require("../utils/Helper");
const md5_1 = __importDefault(require("md5"));
class Account {
    constructor(USERNAME, PASSWORD) {
        this.ID = Helper_1.Helper.generateUID();
        this.USERNAME = USERNAME;
        this.PASSWORD = md5_1.default(PASSWORD);
    }
}
exports.Account = Account;
