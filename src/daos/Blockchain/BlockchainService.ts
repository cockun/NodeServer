import { timeStamp, trace } from "console";
import { Block } from "src/blockchain/Block";
import { Blockchain, IBlockchain } from "src/blockchain/Blockchain";
import { Transaction } from "src/blockchain/Transaction";
import { Wallet } from "src/blockchain/Wallet";
import EC from 'elliptic'
const ec = new EC.ec('secp256k1');

interface IBlockchainService {
    blockchainInstance: Blockchain
    wallets: string[]
}
class BlockchainService implements IBlockchainService {
    public blockchainInstance: Blockchain
    public wallets: any[]

    constructor() {
        this.blockchainInstance = new Blockchain();
        this.wallets = [];

        const adminWallet = this.generateWallet();

        this.blockchainInstance.minePendingTransactions(adminWallet.publicKey);
    }

    public generateWallet(): Wallet {
        return new Wallet();
    }

    public getKeyFromPrivateKey(privateKey: string): Wallet {
        let wallet = new Wallet(ec.keyFromPrivate(privateKey))
        return wallet
    }
    public addTransaction(privateKey: string, toAddress: string, amount: number) {
        const key = this.getKeyFromPrivateKey(privateKey);
        const tx = new Transaction(key.publicKey, toAddress, amount);
        tx.signTransaction(key.key);
        this.blockchainInstance.addTransaction(tx)
        return;


    }

    public minningBlock(address: string) {
        if (this.blockchainInstance.pendingTransactions.length > 0)
            this.blockchainInstance.minePendingTransactions(address);
    }

    public getPendingTransactions(): Transaction[] {
        return this.blockchainInstance.pendingTransactions

    }

    public getBlockChain(): Block[] {
        return this.blockchainInstance.chain;
    }










}
export const blockchainService = new BlockchainService();