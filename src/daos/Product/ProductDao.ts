import OracleDB from "@daos/OracleDb/OracleDB";
import { IProduct, Product } from "@entities/Product";

import { Result } from "@entities/Result";
import { Helper } from "src/utils/Helper";
import { IProdctReq } from "src/request/ProductReq";
import { ICategory } from "../../entities/Categories";
import { IProductRes, ProductRes } from "../../response/ProductRes";
import CategoryDao from "../Categories.ts/CategoryDao";
import { isBuffer } from "util";

export interface IProductDao {
  getOne: (data: IProdctReq) => Promise<Result<IProductRes> | undefined>;
  getAll: () => Promise<Result<IProductRes[]> | undefined>;
  add: (product: IProdctReq) => Promise<Result<string>>;
  update: (product: IProdctReq) => Promise<Result<IProductRes>>;
  delete: (id: string) => Promise<void>;
}

class ProductDao extends OracleDB implements IProductDao {
  public tableName = "PRODUCTS";

  public async getOne(data: IProdctReq): Promise<Result<IProductRes>> {
    const db = this.OpenDB();
    if (db) {
      let productRes: ProductRes;
      const result = await db<Product>(this.tableName)
        .select("*")
        .where(Helper.upcaseKey(data))
        .first();
      if (result?.CATEGORYID) {
        const category = await db<ICategory>("CATEGORTES")
          .select("*")
          .where(result.CATEGORYID)
          .first();
        if (category) {
          productRes = new ProductRes(result, category);
          return new Result<IProductRes>(productRes);
        }
      }

      return new Result<IProductRes>(null, "Lỗi");
    }
    return new Result<IProductRes>(null, "Lỗi");
  }

  public async getById(id: string): Promise<Result<IProductRes>> {
    const db = this.OpenDB();
    if (db) {
      let productRes: ProductRes;
      const result = await db<Product>(this.tableName)
        .select("*")
        .where("ID", id)
        .first();
      if (result?.CATEGORYID) {
        const category = await db<ICategory>("CATEGORTES")
          .select("*")
          .where(result.CATEGORYID)
          .first();
        if (category) {
          productRes = new ProductRes(result, category);
          return new Result<IProductRes>(productRes);
        }
      }

      return new Result<IProductRes>(null, "Lỗi");
    }
    return new Result<IProductRes>(null, "Lỗi");
  }

  public async filter(
    productReq: IProdctReq
  ): Promise<Result<IProductRes[]> | undefined> {
    const db = this.OpenDB();

    if (!productReq.PAGEINDEX) {
      productReq.PAGEINDEX = 1;
    }
    if (!productReq.PAGESIZE) {
      productReq.PAGESIZE = 20;
    }

    if (db) {
      const tmp = db<IProduct>(this.tableName).select("*");

      if (productReq.NAME) {
        tmp.where("NAME", "like", `%@${productReq.NAME}%`);
      }

      if (productReq.ORDERBYNAME) {
        if (productReq.ORDERBYASC) {
          tmp.orderBy([
            {
              column: productReq.ORDERBYNAME,
              order: productReq.ORDERBYASC ? "asc" : "desc",
            },
          ]);
        } else {
          tmp.orderBy([{ column: productReq.ORDERBYNAME, order: "asc" }]);
        }
      }
      tmp
        .limit(productReq.PAGESIZE)
        .offset((productReq.PAGEINDEX - 1) * productReq.PAGESIZE);
      const result = await tmp;
      const categoryIds = [...new Set(result.map((p) => p.CATEGORYID))];
      const categoryDao = new CategoryDao();
      const categories = await categoryDao.getManyByIds(categoryIds);

      const productRes = result.map((p) => {
        const category = categories.data?.find((z) => z.ID === p.CATEGORYID);
        if (category) {
          return new ProductRes(p, category);
        } else {
          return new ProductRes(p, {} as ICategory);
        }
      });

      return new Result<IProductRes[]>(productRes);
    }
    return new Result<IProductRes[]>([], "");
  }

  public async getAll(): Promise<Result<IProductRes[]> | undefined> {
    const db = this.OpenDB();
    if (db) {
      const result = await db<IProductRes>(this.tableName).select("*");

      return new Result<IProductRes[]>(result);
    }
    return undefined;
  }

  public async add(productReq: IProdctReq): Promise<Result<string>> {
    const db = this.OpenDB();
    const product = new Product(productReq);

    if (db) {
      const transaction = await db.transaction();
      try {
        await db<Product>(this.tableName)
          .transacting(transaction)
          .insert(Helper.upcaseKey(product));
        transaction.commit();
        return new Result<string>(product.ID);
      } catch (e) {
        transaction.rollback();
        return new Result<string>(null, e.message);
      }
    }
    return new Result<string>(null, "connect oracle err");
  }

  public async update(product: IProdctReq): Promise<Result<IProductRes>> {
    const db = this.OpenDB();
    if (!product.ID) {
      return new Result<IProductRes>(null);
    }

    if (db) {
      const transaction = await db.transaction();
      try {
        const result = await db<IProductRes>(this.tableName)
          .transacting(transaction)
          .where("ID", product.ID)
          .update(Helper.upcaseKey(product))
          .returning("*");
        transaction.commit();
        return new Result<IProductRes>(result[1]);
      } catch (e) {
        transaction.rollback();
        return new Result<IProductRes>(null);
      }
    }
    return new Result<IProductRes>(null, "connect oracle err");
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

export default ProductDao;
