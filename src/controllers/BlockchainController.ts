import StatusCodes from "http-status-codes";
import { Request, Response } from "express";
import { blockchainService } from "@daos/Blockchain/BlockchainService";


const { BAD_REQUEST, CREATED, OK } = StatusCodes;


export async function minningBlock(req: Request, res: Response) {
    const { data } = req.body;


    blockchainService.minningBlock(data)

    return res.status(OK).json(blockchainService.blockchainInstance);
}


export async function addTransaction(req: Request, res: Response) {
    const { data } = req.body;
    try {
        blockchainService.addTransaction(data.privateKey, data.toAddress, data.amount)

    } catch (e: any) {
        return res.status(BAD_REQUEST).json(e.message);

    }

}

export async function getPendingTransactions(req: Request, res: Response) {
    return res.status(OK).json(blockchainService.getPendingTransactions());

}
export async function getBlockChain(req: Request, res: Response) {
    return res.status(OK).json(blockchainService.getBlockChain());

}










