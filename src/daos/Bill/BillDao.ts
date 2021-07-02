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
import { BillReq, IBillReq } from "src/request/BillReq";
import ProductDao from "../Product/ProductDao";
import { BillInfo } from "../../entities/Billinfo";
import BillInfoDao from "./BillInfoDao";
import { BillRes } from "../../response/BillRes";
import AccountInfoDao from "../Account/AccountInfoDao";
import { readSync } from "fs";

export interface IBillDao {
  getById: (id: string) => Promise<Result<IBill>>;
  getAll: () => Promise<Result<IBill[]> | undefined>;
  add: (bill: IBillReq) => Promise<Result<string>>;
  update: (bill: IBillReq) => Promise<Result<IBill>>;
  delete: (id: string) => Promise<void>;
  filter: (billReq: IBillReq) => Promise<Result<BillRes[]>>;
}
const billInfoDao = new BillInfoDao();
const productDao = new ProductDao();
const accountInfoDao = new AccountInfoDao();
class BillDao extends OracleDB implements IBillDao {
  public tableName = "BILLS";

  public async getById(id: string): Promise<Result<IBill>> {
    const db = this.OpenDB();
    if (db) {
      const result = await db<Bill>(this.tableName)
        .select("*")
        .where("ID", id)
        .first();
      return new Result<IBill>(result);
    }
    return new Result<IBill>(null);
  }

  // get bill with accountid

  public async getManyById(id: string): Promise<Result<IBill[]>> {
    const db = this.OpenDB();
    if (db) {
      const result = await db<IBill>(this.tableName)
        .select("*")
        .where("ACCOUNTID", id);
      return new Result<IBill[]>(result);
    }
    return new Result<IBill[]>(null, "Lỗi");
  }

  public async getAll(): Promise<Result<IBill[]>> {
    const db = this.OpenDB();
    if (db) {
      const result = await db<Bill>(this.tableName).select("*");

      return new Result<IBill[]>(result);
    }
    return new Result<IBill[]>([], "Connect Oracle Error");
  }

  public async filter(billReq: IBillReq): Promise<Result<BillRes[]>> {
    const db = this.OpenDB();

    if (!billReq.PAGEINDEX) {
      billReq.PAGEINDEX = 1;
    }
    if (!billReq.PAGESIZE) {
      billReq.PAGESIZE = 20;
    }

    if (db) {
      const tmp = db<BillRes>(this.tableName);

      if (billReq.ACCOUNTID) {
        tmp.where("ACCOUNTID", billReq.ACCOUNTID);
      }


      if(billReq.FULLNAME){
        tmp.whereRaw(`LOWER(FULLNAME) LIKE ?`, [
          `%${billReq.FULLNAME.toLowerCase()}%`,
        ]);
      }

      if (billReq.FROMDATE && billReq.TODATE) {
        tmp
          .where("DATEBUY", "<=", new Date(billReq.TODATE))
          .where("DATEBUY", ">=", new Date(billReq.FROMDATE));
      }
      const countQuery = tmp.clone();
      const { COUNT } = (await countQuery.count("* AS COUNT").first()) as any;
      if (billReq.ORDERBYNAME) {
        if (billReq.ORDERBYASC != undefined) {
          tmp.orderBy([
            {
              column: billReq.ORDERBYNAME,
              order: billReq.ORDERBYASC ? "asc" : "desc",
            },
          ]);
        } else {
          tmp.orderBy([{ column: billReq.ORDERBYNAME, order: "asc" }]);
        }
      }
      tmp
        .limit(billReq.PAGESIZE)
        .offset((billReq.PAGEINDEX - 1) * billReq.PAGESIZE);
      console.log(tmp.toQuery());
      let bill = await tmp.select("*");

      const billIds = bill.map((p) => p.ID);

      if (billIds.length > 0) {
        const billInfos = (await billInfoDao.getByIdBill(billIds)).data;
        bill = bill.map((p) => {
          return {
            ...p,
            BILLINFOS: billInfos?.filter(
              (billinfo) => billinfo.BILLID === p.ID
            ),
          } as BillRes;
        });
      }

      return new Result<BillRes[]>(bill, "", COUNT);
    }
    return new Result<BillRes[]>([], "");
  }

  public async add(billReq: IBillReq): Promise<Result<string>> {
    try {
      if (!billReq.ACCOUNTID) {
        return new Result<string>(null, "Thiếu thông tin");
      }
      const db = this.OpenDB();
      const bill = new Bill(billReq);

      bill.BILLSTATUS = "Hoàn thành";

      if (!billReq.BILLINFOS) {
        return new Result<string>(null, "Lỗi thiếu thông tin");
      }
      const productIds = billReq.BILLINFOS.map((p) => p.PRODUCTID) ?? [];
      const products = (await productDao.getManyByIds(productIds)).data;
      if (!products) {
        return new Result<string>(null, "Mã sản phẩm lỗi");
      }
      let total = 0;
      const billInfos = billReq.BILLINFOS.map((p) => {
        const product = products.find((z) => z.ID === p.PRODUCTID);
        if (product) {
          return new BillInfo(
            bill.ID,
            p.PRODUCTID,
            product.NAME,
            p.QUANTITY,
            product.DISCOUNT
          );
        } else {
          return {} as BillInfo;
        }
      });
      billInfos.forEach((p) => {
        total = total + p.QUANTITY * p.PRICE;
      });
      bill.TOTAL = total;

      if (db) {
        const transaction = await db.transaction();
        await db<Bill>(this.tableName).transacting(transaction).insert(bill);

        const tmp = await billInfoDao.add(billInfos, transaction);

        //SOLD
        for (let i = 0; i < billInfos.length; ++i) {
          const tmp = await productDao.changeSold(
            billInfos[i].PRODUCTID,
            billInfos[i].QUANTITY,
            transaction
          );
          if (!tmp.data) {
            return new Result<string>(null, tmp.err ? tmp.err : "Lỗi");
          }
        }

        //Points

        const resultChangePoint = await accountInfoDao.changePoint(
          bill.ACCOUNTID,
          bill.TOTAL / 100,
          transaction
        );

        if (tmp && tmp.data && resultChangePoint) {
          transaction.commit();
          return new Result<string>(bill.ID);
        } else {
          transaction.rollback();
          return new Result<string>(null, tmp.err ? tmp.err : "Lỗi");
        }
      }
      return new Result<string>(null, "connect oracle err");
    } catch (e) {
      return new Result<string>(null, e.message);
    }
  }

  public async update(billReq: IBillReq): Promise<Result<IBill>> {
    const db = this.OpenDB();
    if (!billReq.ID) {
      return new Result<IBill>(null, "Bill không tồn tại");
    }
    if (!billReq.BILLSTATUS) {
      return new Result<IBill>(null);
    }

    if (db) {
      const transaction = await db.transaction();
      try {
        if (billReq.BILLSTATUS == "Hoàn thành") {
          const bill = await this.getById(billReq.ID);
          if (!bill || !bill.data) {
            return new Result<IBill>(null, "Bill không tồn tại");
          }
          const accountInfoDao = new AccountInfoDao();
          const resultChangePoint = await accountInfoDao.changePoint(
            bill.data.ACCOUNTID,
            bill.data.TOTAL / 100,
            transaction
          );
          if (!resultChangePoint.data) {
            return new Result<IBill>(
              null,
              resultChangePoint.err ? resultChangePoint.err : "Lỗi"
            );
          }
        }

        const result = await db<IBill>(this.tableName)
          .transacting(transaction)
          .where("ID", billReq.ID)
          .update("BILLSTATUS", billReq.BILLSTATUS)
          .returning("*");
        transaction.commit();
        return new Result<IBill>(result[1]);
      } catch (e) {
        transaction.rollback();
        return new Result<IBill>(null);
      }
    }
    return new Result<IBill>(null, "connect oracle err");
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

export default BillDao;
