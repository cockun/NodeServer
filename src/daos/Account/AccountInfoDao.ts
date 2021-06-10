import OracleDB from "@daos/OracleDb/OracleDB";
import { IAccount, Account } from "@entities/Account";
import { AccountInfo, IAccountInfo } from "@entities/AccountInfo";
import { Result } from "@entities/Result";
import { IRole } from "@entities/Role";
import { Knex } from "knex";
import { AccountReq, IAccountReq } from "src/request/AccountReq";
import { Helper } from "src/utils/Helper";

import { callbackify } from "util";
import RoleDao from "./Role";

export interface IAccountInfoDao {
  getOne: (data: IAccountReq) => Promise<IAccountInfo | undefined>;
  getAll: () => Promise<IAccountInfo[] | undefined>;
  add: (accountReq: IAccountReq , transaction : Knex.Transaction<any, any[]>) => Promise<Result<IAccountInfo>>
  update: (account: IAccountReq) => Promise<void>;
  delete: (id: string) => Promise<void>;
}

class AccountDao extends OracleDB implements IAccountInfoDao {
  public tableName = "ACCOUNTINFO";

  public async getOne(data: IAccountReq): Promise<IAccountInfo | undefined> {
    const db = this.OpenDB();
    if (db) {
      const result = await db<IAccountInfo>(this.tableName)
        .select("*")
        .where(Helper.upcaseKey(data))
        .first();
      return result;
    }
    return undefined;
  }

  public async getOneById(id: string): Promise<IAccountInfo | undefined> {
    const db = this.OpenDB();
    if (db) {
      const result = await db<IAccountInfo>(this.tableName)
        .select("*")
        .where("ID", id)
        .first();
      return result;
    }
    return undefined;
  }

  public async getAll(): Promise<IAccountInfo[] | undefined> {
    const db = this.OpenDB();
    if (db) {
      const result = await db<IAccountInfo>(this.tableName)
        .select("*")
      return result;
    }
    return undefined;
  }

  public async add(accountReq: IAccountReq , transaction : Knex.Transaction<any, any[]>): Promise<Result<IAccountInfo>> {
    const db = this.OpenDB();
    let accountInfo= new AccountInfo(accountReq);
    if (db) {

      try {
         let roleDao = new RoleDao();
          let tmp =  await roleDao.getOneByName(accountReq.role?accountReq.role:"User");
          if(tmp && tmp.data){
            accountInfo.roleId = tmp.data.id;
          }else{
            return new Result<IAccountInfo>(null,"get RoldId null")
          }
         
        let result =  await db<AccountInfo>(this.tableName)
          .transacting(transaction)
          .insert(Helper.upcaseKey(accountInfo)).returning("*");
        return new Result<IAccountInfo>(result[1]);
      } catch (e) {
        
        return new Result<IAccountInfo>(null,e.message) ;
      }
    }
    return new Result<IAccountInfo>(null,"connect oracle err" );
  }

  public async update(account: IAccountReq): Promise<void> {
    const db = this.OpenDB();
    if (!account.id) {
      return;
    }
    
    if (db) {
      const transaction = await db.transaction();
      try {
        await db<Account>(this.tableName)
        .transacting(transaction)
          .where("ID", account.id)
          .update(Helper.upcaseKey(account))
        transaction.commit();
      } catch (e) {
        transaction.rollback();
      }
    }
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
