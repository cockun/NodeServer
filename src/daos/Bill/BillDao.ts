import OracleDB from "@daos/OracleDb/OracleDB";
import { IProduct, Product } from "@entities/Product";
import { AccountInfo } from "@entities/AccountInfo";
import { Result } from "@entities/Result";
import { table } from "console";
import { AccountReq, IAccountReq } from "src/request/AccountReq";
import { Helper } from "src/utils/Helper";
import { IBill, Bill } from "@entities/Bills";
import { callbackify } from "util";
import { IProdctReq } from "src/request/ProductReq";
import { IBillReq } from "src/request/BillReq";

export interface IBillDao {
  getOne: (data: IBillReq) => Promise<Result<IBill> | undefined>;
  getAll: () => Promise<Result<IBill[]>  | undefined>;
  add: (bill: IBillReq) => Promise<Result<string>>;
  update: (bill: IBillReq) => Promise<Result<IBill>>;
  delete: (id: string) => Promise<void>;
}

class BillDao extends OracleDB implements IBillDao {
  public tableName = "BILLS";

  public async getOne(data: IBillReq): Promise<Result<IBill>  | undefined> {
    const db = this.OpenDB();
    if (db) {
      const result = await db<Bill>(this.tableName)
        .select("*")
        .where(Helper.upcaseKey(data))
        .first();
      return new Result<IBill> (result);
    }
    return undefined;
  }

  public async getOneById(id: string): Promise<Result<IBill> | undefined> {
    const db = this.OpenDB();
    if (db) {
      const result = await db<Bill>(this.tableName)
        .select("*")
        .where("ID", id)
        .first();
        return new Result<IBill> (result);
    }
    return undefined;
  }

  public async getAll(): Promise<Result<IBill[]>| undefined> {
    const db = this.OpenDB();
    if (db) {
      const result = await db<Bill>(this.tableName)
        .select("*")
      
        return new Result<IBill[]> (result);
    }
    return undefined;
  }

  public async  add(billReq: IBillReq): Promise<Result<string>> {
    const db = this.OpenDB();
    let bill = new Bill(billReq);
 
    if (db) {
      const transaction = await db.transaction();
      try {
        await db<Bill>(this.tableName)
          .transacting(transaction)
          .insert(Helper.upcaseKey(bill));
        
       
          transaction.commit();
        
          transaction.rollback();
          return new Result<string>(bill.ID);

      
        
      } catch (e) {
        transaction.rollback();
        return new Result<string>(null, e.message);
      }
    }
    return new Result<string>(null, "connect oracle err");
  }

  public async update(bill: IBillReq): Promise<Result<IBill>> {
    const db = this.OpenDB();
    if (!bill.ID) {
      return new Result<IBill>(null) ;
    }
    
    if (db) {
      const transaction = await db.transaction();
      try {
        let result =  await db<IBill>(this.tableName)
        .transacting(transaction)
          .where("ID", bill.ID)
          .update(Helper.upcaseKey(bill)).returning("*");
        transaction.commit();
        return new Result<IBill>(result[1]) ;
      } catch (e) {
        transaction.rollback();
        return new Result<IBill>(null) ;
      }
    }
    return new Result<IBill>(null, "connect oracle err");
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

export default BillDao;
