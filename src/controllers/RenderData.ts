import fs from "fs";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import AccountDao from "../daos/Account/AccountDao";
import { AccountReq } from "../request/AccountReq";
import BillDao from "../daos/Bill/BillDao";
import { BillReq } from "../request/BillReq";
import { BillInfo } from "../entities/Billinfo";
import { BillinfoReq } from "../request/BillInfoReq";
import ProductDao from "../daos/Product/ProductDao";

const { BAD_REQUEST, CREATED, OK } = StatusCodes;
// eslint-disable-next-line @typescript-eslint/require-await
export async function coc(req: Request, res: Response) {
  try {
    const firstNames = fs.readFileSync(
      "C:/Users/Khoa/Desktop/NodeServer/src/controllers/firstName.txt",
      "utf8"
    );
    const names = fs.readFileSync(
      "C:/Users/Khoa/Desktop/NodeServer/src/controllers/name.txt",
      "utf8"
    );
    const address = fs.readFileSync(
      "C:/Users/Khoa/Desktop/NodeServer/src/controllers/Address.txt",
      "utf8"
    );

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
    const accountDao = new AccountDao();
    const billDao = new BillDao();
    const productDao = new ProductDao();
    let productIds;
    const products = await productDao.getAll();
    if (products.data) {
      productIds = products.data.map((p) => p.ID);
    } else {
      return;
    }

    for (let i = 0; i < 10; ++i) {
      const randomFirstName = getRandomInt(0, firstNameArr.length - 1);
      const randomAddressArr = getRandomInt(0, addressArr.length - 1);
      const randomNamesArr = getRandomInt(0, namesArr.length - 1);
      const firstName = firstNameArr[randomFirstName];
      const addres = addressArr[randomAddressArr];
      const name = namesArr[randomNamesArr];
      const fullName = firstName + " " + name;
      const randomProductId =
        productIds[getRandomInt(0, productIds.length - 1)];
      const randomBill = getRandomInt(1, 3);

      let sex: string;
      const randomSex = getRandomInt(1, 2);
      if (randomSex === 1) {
        sex = "Nam";
      } else {
        sex = "Nữ";
      }
      const accountReq = new AccountReq();
      accountReq.FULLNAME = fullName;
      accountReq.BIRTHDAY = new Date(
        getRandomInt(1980, 2015),
        getRandomInt(1, 12),
        getRandomInt(1, 28)
      );
      accountReq.ADDRESS = addres;
      accountReq.USERNAME = "user" + i;
      accountReq.PASSWORD = "user" + i;
      accountReq.PHONE = getRandomInt(10000000000, 99999999999).toString();
      accountReq.ROLE = "1";
      accountReq.SEX = sex;
      accountReq.EMAIL = "user" + i + "@gmail.com";

      const accountId = (await accountDao.add(accountReq)).data;

      for (let i = 0; i < randomBill; ++i) {
        const billInfoReqs: BillinfoReq[] = [];

        const randomBillInfo = getRandomInt(1, 3);
        for (let i = 0; i < randomBillInfo; ++i) {
          const billInfoReq = new BillinfoReq(
            randomProductId,
            getRandomInt(1, 3)
          );
          billInfoReqs.push(billInfoReq);
        }

        const billReq = new BillReq();

        billReq.ACCOUNTID = accountId ?? "";
        billReq.FULLNAME = fullName;
        billReq.PHONE = accountReq.PHONE;
        billReq.ADDRESS = accountReq.ADDRESS;
        billReq.BILLSTATUS = "Hoàn thành";
        billReq.BILLINFOS = billInfoReqs;

        const billId = await billDao.add(billReq);
      }
    }
  } catch (e) {
    console.log("Error:", e.stack);
  }
  return res.status(OK).json("");
}
function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}
