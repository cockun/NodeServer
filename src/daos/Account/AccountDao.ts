import OracleDB from "@daos/OracleDb/OracleDB";
import { IAccount, Account } from "@entities/Account";
import { AccountInfo } from "@entities/AccountInfo";
import { Result } from "@entities/Result";
import { table } from "console";
import { AccountReq, IAccountReq } from "src/request/AccountReq";
import { Helper } from "src/utils/Helper";

import { callbackify } from "util";
import AccountInfoDao from "./AccountInfoDao";

export interface IAccountDao {
  getOne: (data: IAccountReq) => Promise<Result<IAccount> | undefined>;
  getAll: () => Promise<Result<IAccount[]>  | undefined>;
  add: (account: IAccountReq) => Promise<Result<string>>;
  update: (account: IAccountReq) => Promise<Result<IAccount>>;
  delete: (id: string) => Promise<void>;
}

class AccountDao extends OracleDB implements IAccountDao {
  public tableName = "ACCOUNTS";

  public async getOne(data: IAccountReq): Promise<Result<IAccount>  | undefined> {
    const db = this.OpenDB();
    if (db) {
      const result = await db<Account>(this.tableName)
        .select("*")
        .where(Helper.upcaseKey(data))
        .first();
      return new Result<IAccount> (result);
    }
    return undefined;
  }

  // public async filter(
  //   productReq: IProdctReq
  // ): Promise<Result<IProductRes[]> | undefined> {
  //   const db = this.OpenDB();

  //   if (!productReq.PAGEINDEX) {
  //     productReq.PAGEINDEX = 1;
  //   }
  //   if (!productReq.PAGESIZE) {
  //     productReq.PAGESIZE = 20;
  //   }

  //   if (db) {
  //     const tmp = db<IProduct>(this.tableName).select("*");

  //     if (productReq.NAME) {
  //       tmp.where("NAME", "like", `%@${productReq.NAME}%`);
  //     }

  //     if (productReq.ORDERBYNAME) {
  //       if (productReq.ORDERBYASC) {
  //         tmp.orderBy([
  //           {
  //             column: productReq.ORDERBYNAME,
  //             order: productReq.ORDERBYASC ? "asc" : "desc",
  //           },
  //         ]);
  //       } else {
  //         tmp.orderBy([{ column: productReq.ORDERBYNAME, order: "asc" }]);
  //       }
  //     }
  //     tmp
  //       .limit(productReq.PAGESIZE)
  //       .offset((productReq.PAGEINDEX - 1) * productReq.PAGESIZE);
  //     const result = await tmp;
  //     const categoryIds = [...new Set(result.map((p) => p.CATEGORYID))];
  //     const categoryDao = new CategoryDao();
  //     const categories = await categoryDao.getManyByIds(categoryIds);

  //     const productRes = result.map((p) => {
  //       const category = categories.data?.find((z) => z.ID === p.CATEGORYID);
  //       if (category) {
  //         return new ProductRes(p, category);
  //       } else {
  //         return new ProductRes(p, {} as ICategory);
  //       }
  //     });

  //     return new Result<IProductRes[]>(productRes);
  //   }
  //   return new Result<IProductRes[]>([], "");
  // }



  public async getOneById(id: string): Promise<Result<IAccount> | undefined> {
    const db = this.OpenDB();
    if (db) {
      const result = await db<Account>(this.tableName)
        .select("*")
        .where("ID", id)
        .first();
        return new Result<IAccount> (result);
    }
    return undefined;
  }

  public async getAll(): Promise<Result<IAccount[]>| undefined> {
    const db = this.OpenDB();
    if (db) {
      const result = await db<IAccount>(this.tableName)
        .select("*")
      
        return new Result<IAccount[]> (result);
    }
    return undefined;
  }

  public async  add(accountReq: IAccountReq): Promise<Result<string>> {
    const db = this.OpenDB();
    let account: Account;
    if (accountReq.USERNAME && accountReq.PASSWORD) {
      account = new Account(accountReq.USERNAME, accountReq.PASSWORD);
      accountReq.ID = account.ID;
    } else {
      return new Result<string>( null, "Vui lòng nhập đủ thông tin");
    }
    const accountInfoDao = new AccountInfoDao()
    if (db) {
      const transaction = await db.transaction();
      try {
        await db<Account>(this.tableName)
          .transacting(transaction)
          .insert(Helper.upcaseKey(account));
        const result = await accountInfoDao.add(accountReq,transaction);  
        if(result && result.data){
          transaction.commit();
          return new Result<string>(account.ID);
        }else{
          transaction.rollback();
          return new Result<string>(null,result.err?result.err:"Error");
        }

      
        
      } catch (e) {
        transaction.rollback();
        return new Result<string>(null, e.message);
      }
    }
    return new Result<string>(null, "connect oracle err");
  }

  public async update(account: IAccountReq): Promise<Result<IAccount>> {
    const db = this.OpenDB();
    if (!account.ID) {
      return new Result<IAccount>(null) ;
    }
    
    if (db) {
      const transaction = await db.transaction();
      try {
        const result =  await db<IAccount>(this.tableName)
        .transacting(transaction)
          .where("ID", account.ID)
          .update(Helper.upcaseKey(account)).returning("*");
        transaction.commit();
        return new Result<IAccount>(result[1]) ;
      } catch (e) {
        transaction.rollback();
        return new Result<IAccount>(null) ;
      }
    }
    return new Result<IAccount>(null, "connect oracle err");
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

export default AccountDao;
