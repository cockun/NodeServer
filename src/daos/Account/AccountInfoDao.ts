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
  getAll: () => Promise<Result<IAccountInfo[]>>;
  add: (
    accountReq: IAccountReq,
    transaction: Knex.Transaction<any, any[]>
  ) => Promise<Result<number>>;
  update: (account: IAccountReq) => Promise<Result<string>>;

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

  public async getAll(): Promise<Result<IAccountInfo[]>> {
    const db = this.OpenDB();
    if (db) {
      const result = await db<IAccountInfo>(this.tableName).select("*");
      return new Result<IAccountInfo[]>(result);
    }
    return new Result<IAccountInfo[]>(null,"Truy vấn lỗi");
  }

  public async add(
    accountReq: IAccountReq,
    transaction: Knex.Transaction<any, any[]>
  ): Promise<Result<number>> {
    const db = this.OpenDB();
    const accountInfo = new AccountInfo(accountReq);
    if (db) {
      try {
        const roleDao = new RoleDao();
        const tmp = await roleDao.getOneByName(
          accountReq.ROLE ? accountReq.ROLE : "User"
        );
        if (tmp && tmp.data) {
          accountInfo.ROLEID = tmp.data.ROLENAME;
        } else {
          return new Result<number>(null, "get RoldId null");
        }

        const result = await db<AccountInfo>(this.tableName)
          .transacting(transaction)
          .insert(Helper.upcaseKey(accountInfo));
        return new Result<number>(result as unknown as number);
      } catch (e) {
        return new Result<number>(null, e.message);
      }
    }
    return new Result<number>(null, "connect oracle err");
  }

  public async update(account: IAccountReq): Promise<Result<any>> {
    const db = this.OpenDB();
    if (!account.ID) {
      return new Result<string>(null,"Thiếu thông tin");
    }

    if (db) {
      const transaction = await db.transaction();
      try {
         await db<Account>(this.tableName)
          .transacting(transaction)
          .where("ID", account.ID)
          .update(Helper.upcaseKey(account));
        transaction.commit();
        return new Result<any>({ID:account.ID});
      } catch (e) {
        transaction.rollback();
        return new Result<string>(null,e.message);
      }
    }
    return new Result<string>(null,"Lỗi connect oracle");
  }

  
}

export default AccountDao;
