import StatusCodes from 'http-status-codes';
import { Request, Response } from 'express';

import { paramMissingError } from '@shared/constants';
import CategoryDao from '../daos/Categories.ts/CategoryDao';
const categoryDao = new CategoryDao();

const { BAD_REQUEST, CREATED, OK } = StatusCodes;



/**
 * Get all Accounts.
 * 
 * @param req 
 * @param res 
 * @returns 
 */

export async function getCategoryById(req: Request, res: Response) {
    const {ID} = req.params;
    const category = await categoryDao.getById(ID);
    return res.status(OK).json(category);
}


export async function addOneCategory(req: Request, res: Response) {
    const { data } = req.body;
    if (!data) {
        return res.status(BAD_REQUEST).json({
            error: paramMissingError,
        });
    }
    const ID = await categoryDao.add(data);
    return res.status(OK).json(ID);   
}


/**
 * Update one category.
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export async function updateOneCategory(req: Request, res: Response) {
    const { data } = req.body;
    if (!data) {
        return res.status(BAD_REQUEST).json({
            error: paramMissingError,
        });
    }
  
    const category = await categoryDao.update(data);
    return res.status(OK).json(category);
}


/**
 * Delete one category.
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export async function deleteOneCategory(req: Request, res: Response) {
    const { id } = req.params;
    await categoryDao.delete(id);
    return res.status(OK).end();
}
