import OracleDB from "@daos/OracleDb/OracleDB";
import { IAccount, Account } from "@entities/Account";
import { AccountInfo, IAccountInfo } from "@entities/AccountInfo";
import { Result } from "@entities/Result";
import { AccountReq, IAccountReq } from "src/request/AccountReq";
import { Helper } from "src/utils/Helper";

import { AccountRes, IAccountRes } from "../../response/AccountRes";
import AccountInfoDao from "./AccountInfoDao";

export interface IAccountDao {
  getByUser: (user: string) => Promise<Result<IAccount>>;
  getAll: () => Promise<Result<IAccount[]> | undefined>;
  add: (account: IAccountReq) => Promise<Result<string>>;
  update: (account: IAccountReq) => Promise<Result<IAccount>>;
  delete: (id: string) => Promise<void>;
}

class AccountDao extends OracleDB implements IAccountDao {
  public tableName = "ACCOUNTS";

  public async getByUser(user: string): Promise<Result<IAccount>> {
    const db = this.OpenDB();
    if (db) {
      const result = await db<Account>(this.tableName)
        .select("*")
        .where("USERNAME", user)
        .first();
      return new Result<IAccount>(result);
    }
    return new Result<IAccount>(null, "User không tồn tại");
  }

  public async filter(accountReq: IAccountReq): Promise<Result<IAccountReq[]>> {
    const db = this.OpenDB();

    if (!accountReq.PAGEINDEX) {
      accountReq.PAGEINDEX = 1;
    }
    if (!accountReq.PAGESIZE) {
      accountReq.PAGESIZE = 20;
    }

    if (db) {
      let tmp;

      if (accountReq.FULLNAME) {
        tmp = db<IAccountRes>("ACCOUNTINFO").select("*");
        tmp.where("FULLNAME", "like", `%${""}%`);
      } else {
        if (accountReq.USERNAME) {
          tmp = db<IAccountRes>(this.tableName).select("*");
          tmp.where("USERNAME", "like", `%@${accountReq.USERNAME}%`);
        }
        tmp = db<IAccountRes>("ACCOUNTINFO").select("*");
      }

      if (accountReq.ORDERBYNAME) {
        if (accountReq.ORDERBYASC != undefined) {
          tmp.orderBy([
            {
              column: accountReq.ORDERBYNAME,
              order: accountReq.ORDERBYASC ? "asc" : "desc",
            },
          ]);
        } else {
          tmp.orderBy([{ column: accountReq.ORDERBYNAME, order: "asc" }]);
        }
      }
      tmp
        .limit(accountReq.PAGESIZE)
        .offset((accountReq.PAGEINDEX - 1) * accountReq.PAGESIZE);

      if (accountReq.FULLNAME) {
        tmp.join("ACCOUNTS", { "ACCOUNTS.ID": "ACCOUNTID" });
      } else {
        tmp.join("ACCOUNTINFOS", { "ACCOUNTS.ID": "ACCOUNTID" });
      }
      const result = await tmp;
      const result2 = result.map((p) => {
        return new AccountRes(
          p.ID,
          p.USERNAME,
          p.FULLNAME,
          p.ADDRESS,
          p.PHONE,
          p.ROLE,
          p.POINTS,
          p.CREATEDATE
        );
      });

      return new Result<IAccountRes[]>(result2);
    }
    return new Result<IAccountRes[]>([], "");
  }

  public async getOneById(id: string): Promise<Result<IAccount> | undefined> {
    const db = this.OpenDB();
    if (db) {
      const result = await db<Account>(this.tableName)
        .select("*")
        .where("ID", id)
        .first();
      return new Result<IAccount>(result);
    }
    return undefined;
  }

  //login

  public async Login(accountReq: IAccountReq): Promise<Result<IAccountRes>> {
    const db = this.OpenDB();
    if (db) {
      const result = await db<IAccountRes>(this.tableName)
        .select("*")
        .where(accountReq)
        .join<IAccountRes>("ACCOUNTINFO", { "ACCOUNTINFO.ACCOUNTID": "ACCOUNTS.ID" })
        .first();
      
      if (result) {
        const accountRes = new AccountRes(
          result.ID,
          result.USERNAME,
          result.FULLNAME,
          result.ADDRESS,
          result.PHONE,
          result.ROLE,
          result.POINTS,
          result.CREATEDATE
        );
        return new Result<IAccountRes>(accountRes);
      }
      return new Result<IAccountRes>(null);
    
    }
    return new Result<IAccountRes>(null);
  }

  public async getAll(): Promise<Result<IAccount[]> | undefined> {
    const db = this.OpenDB();
    if (db) {
      const result = await db<IAccount>(this.tableName).select("*");

      return new Result<IAccount[]>(result);
    }
    return undefined;
  }

  public async add(accountReq: IAccountReq): Promise<Result<string>> {
    const db = this.OpenDB();
    let account: Account;
    if (accountReq.USERNAME && accountReq.PASSWORD) {
      account = new Account(accountReq.USERNAME, accountReq.PASSWORD);
      accountReq.ID = account.ID;
    } else {
      return new Result<string>(null, "Vui lòng nhập đủ thông tin");
    }
    const accountInfoDao = new AccountInfoDao();
    if (db) {
      const transaction = await db.transaction();
      try {
        await db<Account>(this.tableName)
          .transacting(transaction)
          .insert(Helper.upcaseKey(account));
        const result = await accountInfoDao.add(accountReq, transaction);
        if (result && result.data) {
          transaction.commit();
          return new Result<string>(account.ID);
        } else {
          transaction.rollback();
          return new Result<string>(null, result.err ? result.err : "Error");
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
      return new Result<IAccount>(null);
    }

    if (db) {
      const transaction = await db.transaction();
      try {
        const result = await db<IAccount>(this.tableName)
          .transacting(transaction)
          .where("ID", account.ID)
          .update(Helper.upcaseKey(account))
          .returning("*");
        transaction.commit();
        return new Result<IAccount>(result[1]);
      } catch (e) {
        transaction.rollback();
        return new Result<IAccount>(null);
      }
    }
    return new Result<IAccount>(null, "connect oracle err");
  }

  public async delete(id: string): Promise<void> {
    const db = this.OpenDB();

    if (db) {
      const transaction = await db.transaction();
      try {
        await db(this.tableName).where("ID", id).del();
        transaction.commit();
      } catch (e) {
        transaction.rollback();
      }
    }
  }
}

export default AccountDao;
