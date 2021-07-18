"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const knex_1 = __importDefault(require("knex"));
class OracleDB {
    constructor() {
        this.password = "hr";
    }
    OpenDB() {
        var _a;
        if (!this._connection) {
            this._connection = knex_1.default({
                client: "mysql",
                connection: {
                    host: (_a = process.env.db) !== null && _a !== void 0 ? _a : "127.0.0.1",
                    user: "root",
                    password: "123456aA",
                    database: "Demo",
                    requestTimeout: 100,
                },
            });
        }
        return this._connection;
    }
    CloseDB(connection) {
        return __awaiter(this, void 0, void 0, function* () {
            yield connection.close();
        });
    }
}
exports.default = OracleDB;
