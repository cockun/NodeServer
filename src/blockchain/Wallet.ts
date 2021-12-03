import EC from 'elliptic'
const ec = new EC.ec('secp256k1');
export interface IWallet {
    key: any;
    publicKey: string;
    privateKey: string;

}

export class Wallet implements IWallet {
    public key!: ReturnType<typeof ec.genKeyPair>
    public publicKey: string;
    public privateKey: string;

    constructor(key?: ReturnType<typeof ec.genKeyPair>) {
        if (key) {
            this.key = key
            this.publicKey = key.getPublic("hex");
            this.privateKey = key.getPrivate("hex");
        } else {
            this.generateWallet();
            this.publicKey = this.key.getPublic("hex");
            this.privateKey = this.key.getPrivate("hex");
        }

    }

    private generateWallet() {
        this.key = ec.genKeyPair();
    }
}