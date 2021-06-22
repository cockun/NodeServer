import OracleDB from "@daos/OracleDb/OracleDB";
import { IProduct, Product } from "@entities/Product";
import { AccountInfo } from "@entities/AccountInfo";
import { Result } from "@entities/Result";
import { table } from "console";
import { AccountReq, IAccountReq } from "src/request/AccountReq";
import { Helper } from "src/utils/Helper";

import { callbackify } from "util";
import { IProdctReq } from "src/request/ProductReq";


export interface IProductDao {
  getOne: (data: IAccountReq) => Promise<Result<IProduct> | undefined>;
  getAll: () => Promise<Result<IProduct[]>  | undefined>;
  add: (product: IAccountReq) => Promise<Result<string>>;
  update: (product: IAccountReq) => Promise<Result<IProduct>>;
  delete: (id: string) => Promise<void>;
}

class ProductDao extends OracleDB implements IProductDao {
  public tableName = "PRODUCTS";

  public async getOne(data: IAccountReq): Promise<Result<IProduct>  | undefined> {
    const db = this.OpenDB();
    if (db) {
      const result = await db<Product>(this.tableName)
        .select("*")
        .where(Helper.upcaseKey(data))
        .first();
      return new Result<IProduct> (result);
    }
    return undefined;
  }

  public async getOneById(id: string): Promise<Result<IProduct> | undefined> {
    const db = this.OpenDB();
    if (db) {
      const result = await db<Product>(this.tableName)
        .select("*")
        .where("ID", id)
        .first();
        return new Result<IProduct> (result);
    }
    return undefined;
  }

  public async getAll(): Promise<Result<IProduct[]>| undefined> {
    const db = this.OpenDB();
    if (db) {
      const result = await db<IProduct>(this.tableName)
        .select("*")
      
        return new Result<IProduct[]> (result);
    }
    return undefined;
  }

  public async  add(productReq: IProdctReq): Promise<Result<string>> {
    const db = this.OpenDB();
    let product = new Product(productReq);
 
    if (db) {
      const transaction = await db.transaction();
      try {
        await db<Product>(this.tableName)
          .transacting(transaction)
          .insert(Helper.upcaseKey(product));
        
       
          transaction.commit();
        
          transaction.rollback();
          return new Result<string>(product.ID);

      
        
      } catch (e) {
        transaction.rollback();
        return new Result<string>(null, e.message);
      }
    }
    return new Result<string>(null, "connect oracle err");
  }

  public async update(product: IAccountReq): Promise<Result<IProduct>> {
    const db = this.OpenDB();
    if (!product.ID) {
      return new Result<IProduct>(null) ;
    }
    
    if (db) {
      const transaction = await db.transaction();
      try {
        let result =  await db<IProduct>(this.tableName)
        .transacting(transaction)
          .where("ID", product.ID)
          .update(Helper.upcaseKey(product)).returning("*");
        transaction.commit();
        return new Result<IProduct>(result[1]) ;
      } catch (e) {
        transaction.rollback();
        return new Result<IProduct>(null) ;
      }
    }
    return new Result<IProduct>(null, "connect oracle err");
  }

  public async delete(id: string): Promise<void> {
    const db = this.OpenDB();

    if (db) {
      const transaction = await db.transaction();
      try {
        const ressult = await db(this.tableName)
          .where("ID", id)
          .del();
        transaction.commit();
      } catch (e) {
        transaction.rollback();
      }
    }
  }
}

export default ProductDao;
