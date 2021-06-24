import OracleDB from "@daos/OracleDb/OracleDB";
import { ICategory, Category } from "@entities/Categories";

import { Result } from "@entities/Result";
import { Helper } from "src/utils/Helper";
import { ICategoryReq } from "../../request/CategoryReq";

export interface ICategoryDao {
  getById: (id:string) => Promise<Result<ICategory>| undefined>;
  getAll: () => Promise<Result<ICategory[]> | undefined>;
  getManyByIds: (data: string[]) => Promise<Result<ICategory[]>>;
  add: (category: ICategoryReq) => Promise<Result<string>>;
  update: (category: ICategoryReq) => Promise<Result<ICategory>>;
  delete: (id: string) => Promise<void>;
}

class CategoryDao extends OracleDB implements ICategoryDao {
  public tableName = "CATEGORIES";

  public async getById(id: string): Promise<Result<ICategory> | undefined> {
    const db = this.OpenDB();
    if (db) {
      const result = await db<Category>(this.tableName)
        .select("*")
        .where("ID", id)
        .first();
      return new Result<ICategory>(result);
    }
    return undefined;
  }

  public async filler(
    categoryReq: ICategoryReq
  ): Promise<Result<ICategory[]> | undefined> {
    const db = this.OpenDB();
    if (!categoryReq.PAGEINDEX || !categoryReq.PAGESIZE) {
      categoryReq.PAGEINDEX = 1;
      categoryReq.PAGESIZE = 20;
    }
    if (db) {
      const result = await db<ICategory>(this.tableName)
        .select("*")
        .where(categoryReq)
        .orderBy([{ column: "DISCOUNT" }])
        .limit(categoryReq.PAGESIZE)
        .offset((categoryReq.PAGEINDEX - 1) * categoryReq.PAGESIZE);

      return new Result<ICategory[]>(result);
    }
    return undefined;
  }

  public async getAll(): Promise<Result<ICategory[]> | undefined> {
    const db = this.OpenDB();
    if (db) {
      const result = await db<ICategory>(this.tableName).select("*");

      return new Result<ICategory[]>(result);
    }
    return undefined;
  }
  public async getManyByIds(data: string[]): Promise<Result<ICategory[]>> {
    const db = this.OpenDB();
    if (db) {
      const result = await db<ICategory>(this.tableName).select("*").whereIn('ID',data);

      return new Result<ICategory[]>(result);
    }
    return   new Result<ICategory[]>(null,"Lỗi");
  }

  public async add(categoryReq: ICategoryReq): Promise<Result<string>> {
    const db = this.OpenDB();
    let category;
    if(categoryReq.CATEGORYNAME){
        category = new Category(categoryReq.CATEGORYNAME);
    }else{
        return new Result<string>(null, 'Thiếu thông tin');
    }
   

    if (db) {
      const transaction = await db.transaction();
      try {
        await db<Category>(this.tableName)
          .transacting(transaction)
          .insert(Helper.upcaseKey(category));
        transaction.commit();
        transaction.rollback();
        return new Result<string>(category.ID);
      } catch (e) {
        transaction.rollback();
        return new Result<string>(null, e.message);
      }
    }
    return new Result<string>(null, "connect oracle err");
  }

  public async update(category: ICategoryReq): Promise<Result<ICategory>> {
    const db = this.OpenDB();
    if (!category.ID) {
      return new Result<ICategory>(null);
    }

    if (db) {
      const transaction = await db.transaction();
      try {
        const result = await db<ICategory>(this.tableName)
          .transacting(transaction)
          .where("ID", category.ID)
          .update(Helper.upcaseKey(category))
          .returning("*");
        transaction.commit();
        return new Result<ICategory>(result[1]);
      } catch (e) {
        transaction.rollback();
        return new Result<ICategory>(null);
      }
    }
    return new Result<ICategory>(null, "connect oracle err");
  }

  public async delete(id: string): Promise<void> {
    const db = this.OpenDB();

    if (db) {
      const transaction = await db.transaction();
      try {
        const ressult = await db(this.tableName).where("ID", id).del();
        transaction.commit();
      } catch (e) {
        transaction.rollback();
      }
    }
  }
}

export default CategoryDao;
