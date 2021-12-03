import { Block } from "./Block";
import { Transaction } from "./Transaction";


export interface IBlockchain {
    chain: Block[];
    difficulty: number;
    pendingTransactions: Transaction[];
}

export class Blockchain implements IBlockchain {
    public chain: Block[];
    public difficulty: number;
    public pendingTransactions: Transaction[];
    public miningReward: number;

    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 10000;

    }
    createGenesisBlock() {

        return new Block(Date.parse('2020-01-01'), [], '');
    }
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }
    minePendingTransactions(miningRewardAddress: string) {
        const rewardTx = new Transaction( null, miningRewardAddress, this.miningReward);
        this.pendingTransactions.push(rewardTx);
        const block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
        block.mineBlock(this.difficulty);
        this.chain.push(block);
        this.pendingTransactions = [];
    }


    addTransaction(transaction: Transaction) {
        if (!transaction.fromAddress || !transaction.toAddress) {
            throw new Error('Transaction must include from and to address');
        }


        if (!transaction.isValid()) {
            throw new Error('Cannot add invalid transaction to chain');
        }

        if (transaction.amount <= 0) {
            throw new Error('Transaction amount should be higher than 0');
        }


        if (this.getBalanceOfAddress(transaction.fromAddress) < transaction.amount) {
            throw new Error('Not enough balance');
        }

        this.pendingTransactions.push(transaction);
    }


    getBalanceOfAddress(address: string) {
        let balance = 0;

        for (const block of this.chain) {
            for (const trans of block.transactions) {
                if (trans.fromAddress === address) {
                    balance -= trans.amount;
                }

                if (trans.toAddress === address) {
                    balance += trans.amount;
                }
            }
        }
        return balance;
    }


    getAllTransactionsForWallet(address: string) {
        const txs = [];

        for (const block of this.chain) {
            for (const tx of block.transactions) {
                if (tx.fromAddress === address || tx.toAddress === address) {
                    txs.push(tx);
                }
            }
        }

        return txs;
    }


    isChainValid() {

        const realGenesis = JSON.stringify(this.createGenesisBlock());

        if (realGenesis !== JSON.stringify(this.chain[0])) {
            return false;
        }


        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (previousBlock.hash !== currentBlock.previousHash) {
                return false;
            }

            if (!currentBlock.hasValidTransactions()) {
                return false;
            }

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }
        }

        return true;
    }
}