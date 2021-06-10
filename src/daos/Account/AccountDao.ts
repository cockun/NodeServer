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

  public async add(accountReq: IAccountReq): Promise<Result<string>> {
    const db = this.OpenDB();
    let account: Account;
    if (accountReq.username && accountReq.password) {
      account = new Account(accountReq.username, accountReq.password);
      accountReq.id = account.id;
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
        let result = await accountInfoDao.add(accountReq,transaction);  
        if(result && result.data){
          console.log(1)
          transaction.commit();
        }else{
          transaction.rollback();
          return new Result<string>(null,result.err?result.err:"Error");
        }
       
        return new Result<string>(account.id);
      } catch (e) {
        transaction.rollback();
        return new Result<string>(null, e.message);
      }
    }
    return new Result<string>(null, "connect oracle err");
  }

  public async update(account: IAccountReq): Promise<Result<IAccount>> {
    const db = this.OpenDB();
    if (!account.id) {
      return new Result<IAccount>(null) ;
    }
    
    if (db) {
      const transaction = await db.transaction();
      try {
        let result =  await db<IAccount>(this.tableName)
        .transacting(transaction)
          .where("ID", account.id)
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
