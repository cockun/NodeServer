"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Helper = void 0;
const uuid_js_1 = __importDefault(require("uuid-js"));
class Helper {
    static generateUID() {
        const uid = uuid_js_1.default.create();
        return uid.toString();
    }
}
exports.Helper = Helper;
