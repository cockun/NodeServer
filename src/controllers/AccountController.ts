import StatusCodes from 'http-status-codes';
import { Request, Response } from 'express';

import AccountDao from '@daos/Account/AccountDao';
import { paramMissingError } from '@shared/constants';

const accountDao = new AccountDao();

const { BAD_REQUEST, CREATED, OK } = StatusCodes;



/**
 * Get all Accounts.
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export async function getAllAccounts(req: Request, res: Response) {
    const accounts = await accountDao.getAll();
    console.log(res.sessionUser)
    return res.status(OK).json({accounts});
}

export async function getOneById(req: Request, res: Response) {
    const {data} = req.body;
    const accounts = await accountDao.getOneById(data.id);
    return res.status(OK).json({accounts});
}



export async function getOne(req: Request, res: Response) {
    const {data} = req.body;
    const accounts = await accountDao.getOne(data);
    return res.status(OK).json({accounts});
}

/**
 * Add one user.
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export async function addOneAccount(req: Request, res: Response) {
    const { data } = req.body;
    if (!data) {
        return res.status(BAD_REQUEST).json({
            error: paramMissingError,
        });
    }
    let id =  await accountDao.add(data);
    return res.status(CREATED).json(id);
}


/**
 * Update one account.
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export async function updateOneAccount(req: Request, res: Response) {
    const { data } = req.body;
    if (!data) {
        return res.status(BAD_REQUEST).json({
            error: paramMissingError,
        });
    }
    
    await accountDao.update(data);
    return res.status(OK).end();
}


/**
 * Delete one account.
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export async function deleteOneAccount(req: Request, res: Response) {
    const { id } = req.params;
    await accountDao.delete(id);
    return res.status(OK).end();
}
