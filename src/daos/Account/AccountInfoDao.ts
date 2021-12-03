import OracleDB from "@daos/OracleDb/OracleDB";
import { IAccount, Account } from "@entities/Account";
import { AccountInfo, IAccountInfo } from "@entities/AccountInfo";
import { Result } from "@entities/Result";
import { Knex } from "knex";
import { AccountReq, IAccountReq } from "src/request/AccountReq";
import { Helper } from "../../utils/Helper";
import RoleDao from "./Role";

export interface IAccountInfoDao {

  getAll: () => Promise<Result<IAccountInfo[]>>;
  add: (
    accountReq: IAccountReq,
    transaction: Knex.Transaction<any, any[]>
  ) => Promise<Result<number>>;
  update: (account: IAccountReq) => Promise<Result<string>>;
}

class AccountDao extends OracleDB implements IAccountInfoDao {
  public tableName = "ACCOUNTINFO";


  public async getById(id: string): Promise<Result<IAccountInfo>> {
    const db = this.OpenDB();
    if (db) {
      const result = await db<IAccountInfo>(this.tableName)
        .select("*")
        .where("ID", id)
        .first();
      return new Result<IAccountInfo>(result);
    }
    return new Result<IAccountInfo>(null);
  }


  public async getByIdAccount(id: string): Promise<Result<IAccountInfo>> {
    const db = this.OpenDB();
    if (db) {
      const result = await db<IAccountInfo>(this.tableName)
        .select("*")
        .where("ACCOUNTID", id)
        .first();
      return new Result<IAccountInfo>(result);
    }
    return new Result<IAccountInfo>(null);
  }

  public async getAll(): Promise<Result<IAccountInfo[]>> {
    const db = this.OpenDB();
    if (db) {
      const result = await db<IAccountInfo>(this.tableName).select("*");
      return new Result<IAccountInfo[]>(result);
    }
    return new Result<IAccountInfo[]>(null, "Truy vấn lỗi");
  }

  public async add(
    accountReq: IAccountReq,
    transaction: Knex.Transaction<any, any[]>
  ): Promise<Result<number>> {
    const db = this.OpenDB();
    const accountInfo = new AccountInfo(accountReq);
    if (db) {
      try {
        const result = await db<AccountInfo>(this.tableName)
          .transacting(transaction)
          .insert(accountInfo);
        return new Result<number>(result as unknown as number);
      } catch (e: any) {
        return new Result<number>(null, e.message);
      }
    }
    return new Result<number>(null, "connect oracle err");
  }

  public async update(account: IAccountReq): Promise<Result<any>> {
    const db = this.OpenDB();
    if (!account.ID) {
      return new Result<string>(null, "Thiếu thông tin");
    }

    if (db) {
      const transaction = await db.transaction();
      try {
        await db<Account>(this.tableName)
          .transacting(transaction)
          .where("ACCOUNTID", account.ID)
          .update(account);
        transaction.commit();
        return new Result<any>({ ID: account.ID });
      } catch (e: any) {
        transaction.rollback();
        return new Result<string>(null, e.message);
      }
    }
    return new Result<string>(null, "Lỗi connect oracle");
  }

  public async changePoint(
    accountId: string,
    point: number,
    transaction: Knex.Transaction<any, any[]>
  ): Promise<Result<number>> {
    const db = this.OpenDB();
    if (!accountId) {
      return new Result<number>(null);
    }
    const accountInfo = await this.getByIdAccount(accountId);
    let pointNew = 0;
    if (accountInfo && accountInfo.data) {
      pointNew = accountInfo.data?.POINTS + point;
    } else {
      return new Result<number>(null, accountInfo.err ? accountInfo.err : "Lỗi")
    }
    if (db) {
      try {
        const result = await db<IAccountInfo>(this.tableName)
          .transacting(transaction)
          .where("ACCOUNTID", accountId)
          .update({ "POINTS": pointNew })

        return new Result<number>(result);
      } catch (e) {
        transaction.rollback();
        return new Result<number>(null);
      }
    }
    return new Result<number>(null, "connect oracle err");
  }
}

export default AccountDao;
