import StatusCodes from "http-status-codes";
import { Request, Response } from "express";

import AccountInfoDao from "@daos/Account/AccountInfoDao";
import { paramMissingError } from "@shared/constants";
import BillDao from "../daos/Bill/BillDao";
import { BillReq } from "../request/BillReq";

const { BAD_REQUEST, CREATED, OK } = StatusCodes;

export async function getMomoReq(req: Request, res: Response) {
  const data = req.body;

  if (data.errorCode === "0") {
    const billDao = new BillDao();
    const billReq = new BillReq();
    billReq.ID = data.orderId;

    billReq.BILLSTATUS = "Hoàn thành";
    await billDao.update(billReq);
  }
  return res.status(OK).json("");
}
