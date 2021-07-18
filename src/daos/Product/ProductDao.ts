import OracleDB from "@daos/OracleDb/OracleDB";
import { IProduct, Product } from "@entities/Product";

import { Result } from "@entities/Result";
import { Helper } from "../../utils/Helper";
import { IProdctReq } from "src/request/ProductReq";
import { ICategory } from "../../entities/Categories";
import { IProductRes, ProductRes } from "../../response/ProductRes";
import CategoryDao from "../Categories.ts/CategoryDao";
import { Knex } from "knex";
import { ProductUpdateReq } from "../../request/ProductUpdateReq";

export interface IProductDao {
  getAll: () => Promise<Result<IProductRes[]> | undefined>;
  add: (product: IProdctReq) => Promise<Result<string>>;
  update: (product: IProdctReq) => Promise<Result<string>>;
  delete: (id: string) => Promise<Result<string>>;
}
const categoryDao = new CategoryDao();
class ProductDao extends OracleDB implements IProductDao {
  public tableName = "PRODUCTS";

  public async getById(id: string): Promise<Result<IProductRes>> {
    const db = this.OpenDB();
    if (db) {
      let productRes: ProductRes;
      const result = await db<Product>(this.tableName)
        .select("*")
        .where("ID", id)
        .first();
      if (result?.CATEGORYID) {
        const category = await db<ICategory>("CATEGORIES")
          .select("*")
          .where("ID", result.CATEGORYID)
          .first();
        if (category) {
          productRes = new ProductRes(result, category);
          return new Result<IProductRes>(productRes);
        }
      }

      return new Result<IProductRes>(null);
    }
    return new Result<IProductRes>(null, "Lỗi");
  }

  public async getManyByIds(ids: string[]): Promise<Result<IProduct[]>> {
    const db = this.OpenDB();
    if (db) {
      const result = await db<IProduct>(this.tableName)
        .select("*")
        .whereIn("ID", ids);

      return new Result<IProduct[]>(result);
    }
    return new Result<IProduct[]>(null, "Lỗi");
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
      const tmp = db<IProduct>(this.tableName);

      if (productReq.NAME) {
        tmp.whereRaw(`LOWER(NAME) LIKE ?`, [
          `%${productReq.NAME.toLowerCase()}%`,
        ]);
      }
      const countQuery = tmp.clone();
      const { COUNT } = (await countQuery.count("* AS COUNT").first()) as any;

      if (productReq.ORDERBYNAME) {
        if (productReq.ORDERBYASC != undefined) {
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

      const result = await tmp.select("*");
      const categoryIds = [...new Set(result.map((p) => p.CATEGORYID))];

      const categories = await categoryDao.getManyByIds(categoryIds);

      const productRes = result.map((p) => {
        const category = categories.data?.find((z) => z.ID === p.CATEGORYID);
        if (category) {
          return new ProductRes(p, category);
        } else {
          return new ProductRes(p, {} as ICategory);
        }
      });

      return new Result<IProductRes[]>(productRes, "", COUNT);
    }
    return new Result<IProductRes[]>([], "");
  }

  public async getAll(): Promise<Result<IProductRes[]>> {
    const db = this.OpenDB();
    if (db) {
      const result = await db<IProductRes>(this.tableName).select("*");

      return new Result<IProductRes[]>(result);
    }
    return new Result<IProductRes[]>([]);
  }

  public async add(productReq: IProdctReq): Promise<Result<string>> {
    const db = this.OpenDB();
    const product = new Product(productReq);

    if (db) {
      const transaction = await db.transaction();
      try {
        await db<Product>(this.tableName)
          .transacting(transaction)
          .insert(product);
        transaction.commit();
        return new Result<string>(product.ID);
      } catch (e) {
        transaction.rollback();
        return new Result<string>(null, e.message);
      }
    }
    return new Result<string>(null, "connect oracle err");
  }

  public async update(productReq: IProdctReq): Promise<Result<string>> {
    const db = this.OpenDB();
    if (!productReq.ID) {
      return new Result<string>(null);
    }
    const productUpdateReq = new ProductUpdateReq(productReq);
    if (db) {
      const transaction = await db.transaction();
      try {
        const result = await db<IProductRes>(this.tableName)
          .transacting(transaction)

          .where("ID", productReq.ID)
          .update(productUpdateReq);

        transaction.commit();
        if (result > 0) {
          return new Result<string>(productReq.ID);
        }
        return new Result<string>(null);
      } catch (e) {
        transaction.rollback();
        return new Result<string>(null);
      }
    }
    return new Result<string>(null, "connect oracle err");
  }

  public async changeSold(
    proudctId: string,
    sold: number,
    transaction: Knex.Transaction<any, any[]>
  ): Promise<Result<number>> {
    const db = this.OpenDB();
    if (!proudctId) {
      return new Result<number>(null);
    }
    if (db) {
      let soldNew = 0;
      try {
        const product = await this.getById(proudctId);
        if (product && product.data) {
          soldNew = product.data.SOLD + sold;
        } else {
          return new Result<number>(null, "productId không tồn tại");
        }

        const result = await db<number>(this.tableName)
          .transacting(transaction)
          .where("ID", proudctId)
          .update("SOLD", soldNew);

        return new Result<number>(result);
      } catch (e) {
        transaction.rollback();
        return new Result<number>(null);
      }
    }
    return new Result<number>(null, "connect oracle err");
  }

  public async delete(id: string): Promise<Result<string>> {
    const db = this.OpenDB();

    if (db) {
      try {
        await db(this.tableName).where("ID", id).del();

        return new Result<string>(id);
      } catch (e) {
        return new Result<string>(null, "Lỗi");
      }
    }
    return new Result<string>(null, "Lỗi");
  }
}

export default ProductDao;
