import OracleDB from "@daos/OracleDb/OracleDB";
import { IAccount ,Account } from "@entities/Account";

import { callbackify } from "util";

export interface IAccountDao {
    getOne: (email: string) => Promise<Account | undefined> ;
    getAll: () =>  Promise<IAccount[] | undefined>;
    add: (account: IAccount) => Promise<void>;
    update: (account: IAccount) => Promise<void>;
    delete: (id: string) => Promise<void>;
}


class AccountDao extends OracleDB implements IAccountDao {


    /**
     * @param email
     */
    public async getOne(username: string): Promise<Account | undefined> {
        const db = this.OpenDB();
        if(db){
            const result =  await db<Account>("ACOUNTS").select('id', 'accountnane',).where('username',username).first();
            return result;
        }
        return undefined;
    }


    /**
     *
     */
    public async getAll(): Promise<IAccount[] | undefined> {
        const db = this.OpenDB();
        if(db){
            const result =  await db<Account>("ACCOUNTS").select('*');
            return result;
        }
        return undefined;
       
    }


    /**
     *
     * @param account
     */
    public async add(account: IAccount): Promise<void> {
        const db = this.OpenDB();
        if(db){
            const transaction = await db.transaction();
            try{
                db<Account>("ACCOUNTS").transacting(transaction).insert(account);
                transaction.commit();
            }catch(e){
                transaction.rollback();
            }
        }
        return Promise.resolve(undefined);
    }


    /**
     *
     * @param account
     */
    public async update(account: IAccount): Promise<void> {
        const db = this.OpenDB();
        if(db){
            const transaction = await db.transaction();
            try{
                db<Account>("ACCOUNTS").transacting(transaction).where({id : account.id }).update(account);
                transaction.commit();
            }catch(e){
                transaction.rollback();
            }
        }
       
    }


    /**
     *
     * @param id
     */
    public async delete(id: string): Promise<void> {
        const db = this.OpenDB();
        if(db){
            const transaction = await db.transaction();
            try{
                db<Account>("ACCOUNTS").transacting(transaction).where({id:id}).delete();
                transaction.commit();
            }catch(e){
                transaction.rollback();
            }
        }
       
    }
}

export default AccountDao;