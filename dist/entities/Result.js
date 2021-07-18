"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Result = void 0;
class Result {
    constructor(data, err, count = 0) {
        this.err = err;
        this.count = count;
        if (data) {
            this.data = data;
        }
        else {
            this.data = null;
        }
    }
}
exports.Result = Result;
