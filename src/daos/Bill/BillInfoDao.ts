import OracleDB from "@daos/OracleDb/OracleDB";
import { Result } from "@entities/Result";
import { IBillinfo, Billinfo } from "@entities/Billinfo";

export interface IBillInfoDao {
  getById: (id: string) => Promise<Result<IBillinfo>>;
  getByIdBill: (id: string) => Promise<Result<IBillinfo[]>>;

}

class BillInfoDao extends OracleDB implements IBillInfoDao {
  public tableName = "BILLINFO";

  public async getById(id: string): Promise<Result<IBillinfo>> {
    const db = this.OpenDB();
    if (db) {
      const result = await db<IBillinfo>(this.tableName)
        .select("*")
        .where("ID", id)
        .first();
      return new Result<IBillinfo>(result);
    }
    return new Result<IBillinfo>(null, "Connect err");
  }

  public async getByIdBill(id: string): Promise<Result<IBillinfo[]>> {
    const db = this.OpenDB();
    if (db) {
      const result = await db<IBillinfo>(this.tableName)
        .select("*")
        .where("ID", id);

      return new Result<IBillinfo[]>(result);
    }
    return new Result<IBillinfo[]>([], "Connect err");
  }

//   public async add(
//     accountReq: IAccountReq,
//     transaction: Knex.Transaction<any, any[]>
//   ): Promise<Result<number>> {
//     const db = this.OpenDB();
//     const accountInfo = new Billinfo(accountReq);
//     if (db) {
//       try {
//         const roleDao = new RoleDao();
//         const tmp = await roleDao.getOneByName(
//           accountReq.ROLE ? accountReq.ROLE : "User"
//         );
//         if (tmp && tmp.data) {
//           accountInfo.ROLEID = tmp.data.ROLENAME;
//         } else {
//           return new Result<number>(null, "get RoldId null");
//         }

//         const result = await db<Billinfo>(this.tableName)
//           .transacting(transaction)
//           .insert(accountInfo);
//         return new Result<number>(result as unknown as number);
//       } catch (e) {
//         return new Result<number>(null, e.message);
//       }
//     }
//     return new Result<number>(null, "connect oracle err");
//   }
}

export default BillInfoDao;