import StatusCodes from "http-status-codes";
import { json, query, Request, Response } from "express";
import CryptoJS from "crypto-js";
import ProductDao from "@daos/Product/ProductDao";
import { paramMissingError } from "@shared/constants";
const productDao = new ProductDao();

const { BAD_REQUEST, CREATED, OK } = StatusCodes;

import querystring from "querystring";
import { IMomoReq, MomoReq } from "../request/MomoReq";

export async function getAllProducts(req: Request, res: Response) {
  const products = await productDao.getAll();

  const data: IMomoReq = {
    accessKey: "ddJvoojK2D3iXivV",
    partnerCode: "MOMOF5HY20210719",
    notifyUrl: "https://momo.vn",
    returnUrl: "https://momo.vn",
    orderId: "MM15404566895576",
    amount: "150000",
    orderInfo: "SDK team.",
    requestId: "MM1540456472575",
    extraData: "email=abc@gmail.com",
  };

  const momoReq = new MomoReq(data);
  momoReq.getString();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const signature = CryptoJS.HmacSHA256(
    momoReq.getString(),
    "Nb7DJ8MJLZMd6PRVcAWHcn8BoUedb2yt"
  );

  const heo = signature.toString();
  return res.status(OK).json(products);
}

export async function getById(req: Request, res: Response) {
  const { ID } = req.params;
  const product = await productDao.getById(ID);
  return res.status(OK).json(product);
}

export async function getBySlug(req: Request, res: Response) {
  const { SLUG } = req.params;
  const product = await productDao.getBySlug(SLUG);
  return res.status(OK).json(product);
}

export async function filler(req: Request, res: Response) {
  const data = req.query;
  const product = await productDao.filter(data);
  return res.status(OK).json(product);
}

/**
 * Add one user.
 *
 * @param req
 * @param res
 * @returns
 */
export async function addOneProduct(req: Request, res: Response) {
  const { data } = req.body;
  if (!data) {
    return res.status(BAD_REQUEST).json({
      error: paramMissingError,
    });
  }
  const ID = await productDao.add(data);
  return res.status(OK).json(ID);
}

/**
 * Update one product.
 *
 * @param req
 * @param res
 * @returns
 */
export async function updateOneProduct(req: Request, res: Response) {
  const { data } = req.body;
  if (!data) {
    return res.status(BAD_REQUEST).json({
      error: paramMissingError,
    });
  }

  const result = await productDao.update(data);
  return res.status(OK).json(result);
}

/**
 * Delete one product.
 *
 * @param req
 * @param res
 * @returns
 */
export async function deleteOneProduct(req: Request, res: Response) {
  const { id } = req.params;
  const result = await productDao.delete(id);
  return res.status(OK).end();
}
