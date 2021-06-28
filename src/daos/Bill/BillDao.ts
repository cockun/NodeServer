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
import ProductDao from "../Product/ProductDao";
import { Billinfo } from "../../entities/Billinfo";
import BillInfoDao from "./BillInfoDao";
import { BillRes } from "../../response/BillRes";

export interface IBillDao {
  getOneById: (id: string) => Promise<Result<IBill>>;
  getAll: () => Promise<Result<IBill[]> | undefined>;
  add: (bill: IBillReq) => Promise<Result<string>>;
  update: (bill: IBillReq) => Promise<Result<IBill>>;
  delete: (id: string) => Promise<void>;
  filter: (billReq: IBillReq) => Promise<Result<BillRes[]>>;
}

class BillDao extends OracleDB implements IBillDao {
  public tableName = "BILLS";

  public async getOneById(id: string): Promise<Result<IBill>> {
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
      const tmp = db<BillRes>(this.tableName).select("*");

      if (billReq.ACCOUNTID) {
        tmp.where("ACCOUNTID", billReq.ACCOUNTID);
      }

      if (billReq.FROMDATE && billReq.TODATE) {
        tmp
          .where("DATEBUY", "<", billReq.TODATE)
          .where("DATEBUY", ">", billReq.FROMDATE);
      }

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
      const bill = await tmp;
      const billInfoDao = new BillInfoDao();
      if (bill) {
        bill.map(async (p) => {
          const tmp = (await billInfoDao.getByIdBill(p.ID)).data;
          if (tmp) {
            p.BILLINFOS = tmp;
          } else {
            p.BILLINFOS = [];
          }
        });
      }

      return new Result<BillRes[]>(bill);
    }
    return new Result<BillRes[]>([], "");
  }

  public async add(billReq: IBillReq): Promise<Result<string>> {
    try{
      const db = this.OpenDB();
      const bill = new Bill(billReq);
      const productDao = new ProductDao();
      if( !billReq.BILLINFOS){
        return new Result<string>(null, "Lỗi thiếu thông tin")
      }
      const productIds =
        billReq.BILLINFOS.map(p=>p.PRODUCTID)??[];
      const products = (await productDao.getManyByIds(productIds)).data;
      if(!products){
        return new Result<string>(null, "Mã sản phẩm lỗi")
      }
      const billInfos =  billReq.BILLINFOS.map(p=> {
        const product = products.find(z=> z.ID = p.PRODUCTID)
        if(product){
          return  new Billinfo(
            bill.ID,
            p.PRODUCTID,
            p.QUANTITY,
            product.DISCOUNT
          );
        }else{
          return  {} as Billinfo
        }
      })
      if (db) {
        const transaction = await db.transaction();

          await db<Bill>(this.tableName)
            .transacting(transaction)
            .insert(Helper.upcaseKey(bill));
  
          const billInfoDao = new BillInfoDao();
          const tmp = await billInfoDao.add(billInfos, transaction);
          if (tmp && tmp.data) {
            transaction.commit();
            return new Result<string>(bill.ID);
          } else {
            transaction.rollback();
            return new Result<string>(null, "Lỗi");
          }
       
      }
      return new Result<string>(null, "connect oracle err");
    }catch(e){
      return new Result<string>(null, e.message);
    }
   
  }

  public async update(bill: IAccountReq): Promise<Result<IBill>> {
    const db = this.OpenDB();
    if (!bill.ID) {
      return new Result<IBill>(null);
    }

    if (db) {
      const transaction = await db.transaction();
      try {
        const result = await db<IBill>(this.tableName)
          .transacting(transaction)
          .where("ID", bill.ID)
          .update(Helper.upcaseKey(bill))
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
