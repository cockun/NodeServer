import StatusCodes from "http-status-codes";
import { Request, Response } from "express";
import { blockchainService } from "@daos/Blockchain/BlockchainService";
import { Result } from "@entities/Result";


const { BAD_REQUEST, CREATED, OK, } = StatusCodes;


export async function minningBlock(req: Request, res: Response) {
    const { addressMining } = req.body;

    try {
        blockchainService.minningBlock(addressMining)
        return res.status(OK).json(new Result<string>("Mining Block thành công"));
    } catch (e: any) {
        return res.status(OK).json(new Result<string>(null, e.message));
    }



}


export async function addTransaction(req: Request, res: Response) {
    const { data } = req.body;
    try {

        blockchainService.addTransaction(data.fromAddress, data.toAddress, data.amount)

        return res.status(OK).json(new Result<string>("Thành công, transaction đang được xử lý"));


    } catch (e: any) {
        return res.status(OK).json(new Result<string>(null, e.message));
    }

}

export async function getPendingTransactions(req: Request, res: Response) {
    return res.status(OK).json(blockchainService.getPendingTransactions());

}
export async function getBlockChain(req: Request, res: Response) {
    return res.status(OK).json(blockchainService.getBlockChain());

}

export async function getBalance(req: Request, res: Response) {
    const { address } = req.query as any;
    return res.status(OK).json(blockchainService.blockchainInstance.getBalanceOfAddress(address));


}











