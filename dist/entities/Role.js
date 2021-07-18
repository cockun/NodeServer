"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = void 0;
const Helper_1 = require("../utils/Helper");
class Role {
    constructor(ROLENAME) {
        this.ID = Helper_1.Helper.generateUID();
        this.ROLENAME = ROLENAME;
    }
}
exports.Role = Role;
