import OracleDB from "@daos/OracleDb/OracleDB";
import { Result } from "@entities/Result";
import { IBillInfo, BillInfo } from "@entities/Billinfo";
import { Knex } from "knex";

export interface IBillInfoDao {
  getById: (id: string) => Promise<Result<IBillInfo>>;
  getByIdBill: (ids: string[]) => Promise<Result<IBillInfo[]>>;
  add: (
    billInfos: BillInfo[],
    transaction: Knex.Transaction<any, any[]>
  ) => Promise<Result<number>>;
}

class BillInfoDao extends OracleDB implements IBillInfoDao {
  public tableName = "BILLINFO";

  public async getById(id: string): Promise<Result<IBillInfo>> {
    const db = this.OpenDB();
    if (db) {
      const result = await db<IBillInfo>(this.tableName)
        .select("*")
        .where("ID", id)
        .first();
      return new Result<IBillInfo>(result);
    }
    return new Result<IBillInfo>(null, "Connect err");
  }

  public async getByIdBill(ids: string[]): Promise<Result<IBillInfo[]>> {
    const db = this.OpenDB();
    if (db) {
      const result = await db<IBillInfo>(this.tableName)
        .select("*")
        .whereIn("BILLID", ids);

      return new Result<IBillInfo[]>(result);
    }
    return new Result<IBillInfo[]>([], "Connect err");
  }

  public async add(
    billInfos: BillInfo[],
    transaction: Knex.Transaction<any, any[]>
  ): Promise<Result<number>> {
    const db = this.OpenDB();
    if (db) {
      try {
       
        const result = await db<BillInfo>(this.tableName)
          .transacting(transaction)
          .insert(billInfos);
        return new Result<number>(result as unknown as number);
      } catch (e) {
        return new Result<number>(null, e.message);
      }
    }
    return new Result<number>(null, "connect oracle err");
  }
}

export default BillInfoDao;
