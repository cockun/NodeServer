import StatusCodes from 'http-status-codes';
import { Request, Response } from 'express';

import AccountInfoDao from '@daos/Account/AccountInfoDao';
import { paramMissingError } from '@shared/constants';

const accountInfoDao = new AccountInfoDao();

const { BAD_REQUEST, CREATED, OK } = StatusCodes;



/**
 * Get all Accounts.
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export async function getAllAccountInfos(req: Request, res: Response) {
    const accountInfos = await accountInfoDao.getAll();
    return res.status(OK).json({accountInfos});
}

export async function getOneById(req: Request, res: Response) {
    const {data} = req.body;
    const accounts = await accountInfoDao.getOneById(data.id);
    return res.status(OK).json({accounts});
}



export async function getOne(req: Request, res: Response) {
    const {data} = req.body;
    const accounts = await accountInfoDao.getOne(data);
    return res.status(OK).json({accounts});
}



/**
 * Add one user.
 * 
 * @param req 
 * @param res 
 * @returns 
 */


/**
 * Update one account.
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export async function updateOneAccountInfo(req: Request, res: Response) {
    const { data } = req.body;
    if (!data) {
        return res.status(BAD_REQUEST).json({
            error: paramMissingError,
        });
    }
    
    const accountInfo=  await accountInfoDao.update(data);
    return res.status(OK).json(accountInfo);
}


