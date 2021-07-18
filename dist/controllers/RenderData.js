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
exports.coc = void 0;
const fs_1 = __importDefault(require("fs"));
const http_status_codes_1 = require("http-status-codes");
const AccountDao_1 = __importDefault(require("../daos/Account/AccountDao"));
const AccountReq_1 = require("../request/AccountReq");
const BillDao_1 = __importDefault(require("../daos/Bill/BillDao"));
const BillReq_1 = require("../request/BillReq");
const BillInfoReq_1 = require("../request/BillInfoReq");
const ProductDao_1 = __importDefault(require("../daos/Product/ProductDao"));
const { BAD_REQUEST, CREATED, OK } = http_status_codes_1.StatusCodes;
// eslint-disable-next-line @typescript-eslint/require-await
function coc(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const firstNames = fs_1.default.readFileSync("C:/Users/Khoa/Desktop/NodeServer/src/controllers/firstName.txt", "utf8");
            const names = fs_1.default.readFileSync("C:/Users/Khoa/Desktop/NodeServer/src/controllers/name.txt", "utf8");
            const address = fs_1.default.readFileSync("C:/Users/Khoa/Desktop/NodeServer/src/controllers/Address.txt", "utf8");
            const firstNameArr = firstNames.split("\n").map((p) => p.trim());
            const addressArr = address.split("\n").map((p) => p.trim());
            const namesArr = names
                .split("\n")
                .map((p) => {
                const tmp = p.split(".");
                if (tmp.length > 1) {
                    return tmp[1].trim();
                }
                return tmp[0].trim();
            })
                .filter((p) => p);
            const accountDao = new AccountDao_1.default();
            const billDao = new BillDao_1.default();
            const productDao = new ProductDao_1.default();
            let productIds;
            const products = yield productDao.getAll();
            if (products.data) {
                productIds = products.data.map((p) => p.ID);
            }
            else {
                return;
            }
            for (let i = 5; i < 2000000; ++i) {
                const randomFirstName = getRandomInt(0, firstNameArr.length - 1);
                const randomAddressArr = getRandomInt(0, addressArr.length - 1);
                const randomNamesArr = getRandomInt(0, namesArr.length - 1);
                const firstName = firstNameArr[randomFirstName];
                const addres = addressArr[randomAddressArr];
                const name = namesArr[randomNamesArr];
                const fullName = firstName + " " + name;
                const randomProductId = productIds[getRandomInt(0, productIds.length - 1)];
                const randomBill = getRandomInt(1, 4);
                let sex;
                const randomSex = getRandomInt(1, 3);
                if (randomSex === 1) {
                    sex = "Nam";
                }
                else {
                    sex = "Nữ";
                }
                const accountReq = new AccountReq_1.AccountReq();
                accountReq.FULLNAME = fullName;
                accountReq.BIRTHDAY = new Date(getRandomInt(1980, 2015), getRandomInt(1, 12), getRandomInt(1, 28));
                accountReq.ADDRESS = addres;
                accountReq.USERNAME = "user" + i;
                accountReq.PASSWORD = "user" + i;
                accountReq.PHONE = getRandomInt(10000000000, 99999999999).toString();
                accountReq.ROLE = "1";
                accountReq.SEX = sex;
                accountReq.EMAIL = "user" + i + "@gmail.com";
                const accountId = (yield accountDao.add(accountReq)).data;
                for (let i = 0; i < randomBill; ++i) {
                    const billInfoReqs = [];
                    const randomBillInfo = getRandomInt(1, 3);
                    for (let i = 0; i < randomBillInfo; ++i) {
                        const billInfoReq = new BillInfoReq_1.BillinfoReq(randomProductId, getRandomInt(1, 3));
                        billInfoReqs.push(billInfoReq);
                    }
                    const billReq = new BillReq_1.BillReq();
                    billReq.DATEBUY = new Date(2021, 6, getRandomInt(1, 30));
                    billReq.ACCOUNTID = accountId !== null && accountId !== void 0 ? accountId : "";
                    billReq.FULLNAME = fullName;
                    billReq.PHONE = accountReq.PHONE;
                    billReq.ADDRESS = accountReq.ADDRESS;
                    billReq.BILLSTATUS = "Hoàn thành";
                    billReq.BILLINFOS = billInfoReqs;
                    const billId = yield billDao.add(billReq);
                }
            }
        }
        catch (e) {
            console.log("Error:", e.stack);
        }
        return res.status(OK).json("");
    });
}
exports.coc = coc;
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}
