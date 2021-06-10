import OracleDB from "@daos/OracleDb/OracleDB";
import { IProduct ,Product } from "@entities/Product";

import { callbackify } from "util";

export interface IProductDao {
    getOne: (email: string) => Promise<Product | undefined> ;
    getAll: () =>  Promise<IProduct[] | undefined>;
    add: (product: IProduct) => Promise<void>;
    update: (product: IProduct) => Promise<void>;
    delete: (id: string) => Promise<void>;
}


class AccountDao extends OracleDB implements IProductDao {


    /**
     * @param email
     */
    public async getOne(id: string): Promise<Product | undefined> {
        const db = this.OpenDB();
        if(db){
            const result =  await db<Product>("PRODUCTS").select('*').where('id',id).first();
            return result;
        }
        return undefined;
    }


    /**
     *
     */
    public async getAll(): Promise<IProduct[] | undefined> {
        const db = this.OpenDB();
        if(db){
            const result =  await db<Product>("PRODUCTS").select('*');
            return result;
        }
        return undefined;
       
    }


    /**
     *
     * @param product
     */
    public async add(product: IProduct): Promise<void> {
        const db = this.OpenDB();
        if(db){
            const transaction = await db.transaction();
            try{
                db<Product>("PRODUCTS").transacting(transaction).insert(product);
                transaction.commit();
            }catch(e){
                transaction.rollback();
            }
        }
        return Promise.resolve(undefined);
    }


    /**
     *
     * @param product
     */
    public async update(product: IProduct): Promise<void> {
        const db = this.OpenDB();
        if(db){
            const transaction = await db.transaction();
            try{
                db<Product>("PRODUCTS").transacting(transaction).where({id : product.id }).update(product);
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
                db<Product>("PRODUCTS").transacting(transaction).where({id:id}).delete();
                transaction.commit();
            }catch(e){
                transaction.rollback();
            }
        }
       
    }
}

export default AccountDao;