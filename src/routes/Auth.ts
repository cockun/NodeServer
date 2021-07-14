import bcrypt from "bcrypt";
import { Request, Response, Router } from "express";
import StatusCodes from "http-status-codes";

import AccountDao from "@daos/Account/AccountDao";
import { JwtService } from "@shared/JwtService";
import {
  paramMissingError,
  loginFailedErr,
  cookieProps,
} from "@shared/constants";

const accountDao = new AccountDao();
const jwtService = new JwtService();
const { BAD_REQUEST, OK, UNAUTHORIZED } = StatusCodes;

/**
 * Login in a user.
 *
 * @param req
 * @param res
 * @returns
 */
export async function login(req: Request, res: Response) {
  // Check email and password present
  const { username, password } = req.body;
  if (!(username && password)) {
    return res.status(BAD_REQUEST).json({
      error: paramMissingError,
    });
  }
  // Fetch user
  const user = await accountDao.getByUser(username);
  if (!user) {
    return res.status(UNAUTHORIZED).json({
      error: loginFailedErr,
    });
  }
  // Check password
  //const pwdPassed = await bcrypt.compare(password, user.pwdHash);
  const pwdPassed = await bcrypt.compare(password, "");
  if (!pwdPassed) {
    return res.status(UNAUTHORIZED).json({
      error: loginFailedErr,
    });
  }
  // Setup Admin Cookie
  const jwt = await jwtService.getJwt({
    id: Number(""),
    role: Number(""),
  });
  const { key, options } = cookieProps;
  res.cookie(key, jwt, options);
  // Return
  return res.status(OK).end();
}

/**
 * Logout the user.
 *
 * @param req
 * @param res
 * @returns
 */
// eslint-disable-next-line @typescript-eslint/require-await
export async function logout(req: Request, res: Response) {
  const { key, options } = cookieProps;
  res.clearCookie(key, options);
  return res.status(OK).end();
}
