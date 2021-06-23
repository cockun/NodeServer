import StatusCodes from 'http-status-codes';
import { Request, Response } from 'express';

import ProductDao from '@daos/Product/ProductDao';
import { paramMissingError } from '@shared/constants';
    import { format } from 'morgan';
const productDao = new ProductDao();

const { BAD_REQUEST, CREATED, OK } = StatusCodes;



/**
 * Get all Accounts.
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export async function getAllProducts(req: Request, res: Response) {
    const products = await productDao.getAll();
    return res.status(OK).json({products});
}

export async function getOne(req: Request, res: Response) {
    const {accountname} = req.body;
    const product = await productDao.getOne(accountname);
    return res.status(OK).json({product});
}

/**
 * Add one user.
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export async function addOneProduct(req: Request, res: Response) {
    const { product } = req.body;
    if (!product) {
        return res.status(BAD_REQUEST).json({
            error: paramMissingError,
        });
    }
    await productDao.add(product);
    return res.status(CREATED).end();
}


/**
 * Update one product.
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export async function updateOneProduct(req: Request, res: Response) {
    const { product } = req.body;
    if (!product) {
        return res.status(BAD_REQUEST).json({
            error: paramMissingError,
        });
    }
    product.id = Number(product.id);
    await productDao.update(product);
    return res.status(OK).end();
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
    await productDao.delete(id);
    return res.status(OK).end();
}
