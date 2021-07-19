import StatusCodes from 'http-status-codes';
import { Request, Response } from 'express';

import BillDao from '@daos/Bill/BillDao';
import { paramMissingError } from '@shared/constants';
    
const billDao = new BillDao();

const { BAD_REQUEST, CREATED, OK } = StatusCodes;



/**
 * Get all Accounts.
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export async function getAllBills(req: Request, res: Response) {
    const bills = await billDao.getAll();
    return res.status(OK).json(bills);
}

export async function filterBills(req: Request, res: Response) {
    const data = req.query;
    if (!data) {
        return res.status(BAD_REQUEST).json({
            error: paramMissingError,
        });
    }
    const result = await billDao.filter(data);
    return res.status(OK).json(result);
}


/**
 * Add one user.
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export async function addOneBill(req: Request, res: Response) {
    const { data } = req.body;
    if (!data) {
        return res.status(BAD_REQUEST).json({
            error: paramMissingError,
        });
    }
    const bill = await billDao.add(data);
    return res.status(CREATED).json(bill);
}
export async function GetManyById(req: Request, res: Response) {
    const { data } = req.body;
    if (!data) {
        return res.status(BAD_REQUEST).json({
            error: paramMissingError,
        });
    }
    const bill = await billDao.getManyById(data.ACCOUNTID);
    return res.status(CREATED).json(bill);
}

/**
 * Update one product.
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export async function updateOneBill(req: Request, res: Response) {
    const { data } = req.body;
    if (!data) {
        return res.status(BAD_REQUEST).json({
            error: paramMissingError,
        });
    }
    await billDao.update(data);
    return res.status(OK).end();
}


/**
 * Delete one product.
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export async function deleteOneBill(req: Request, res: Response) {
    const { id } = req.params;
    await billDao.delete(id);
    return res.status(OK).end();
}
