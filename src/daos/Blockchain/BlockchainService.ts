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

        const adminWallet = this.getKeyFromPrivateKey("8e81c77ca8051da9693c99520af6c82c612d8b0f81131cd0346a6b198d540e35")

        this.blockchainInstance.minePendingTransactions(adminWallet.publicKey, 100000000000);
        console.log(this.blockchainInstance.getBalanceOfAddress("04f3a46bccb02267bd55bb303cd4616b58e5cafb14fd43b29bb8185c7f1f7dddda3fb9f48c17535dd9e51c8f0db1b9cd44ec7c6897e91cee8d8085b30ecd0dd1ee"))
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
        else {
            throw new Error("Không có transaction pendding");
        }
    }

    public getPendingTransactions(): Transaction[] {
        return this.blockchainInstance.pendingTransactions

    }

    public getBlockChain(): Block[] {
        return this.blockchainInstance.chain;
    }

    public isValidAdress(address: string): boolean {
        for (let i = 0; i < this.wallets.length; ++i) {
            if (address === this.wallets[i]) return true
        }
        return false
    }













}
export const blockchainService = new BlockchainService();