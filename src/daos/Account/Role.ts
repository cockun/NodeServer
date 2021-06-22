import OracleDB from "@daos/OracleDb/OracleDB";
import { Result } from "@entities/Result";
import { IRole, Role } from "@entities/Role";



import { Helper } from "src/utils/Helper";
export interface IRoleDao {
    getOneByName: (oleName: string) => Promise<Result<IRole>>;
 
}

class RoleDao extends OracleDB implements IRoleDao {
  public tableName = "ROLE";

  public async getOneByName(roleName: string): Promise<Result<IRole>> {
    const db = this.OpenDB();
    if (db) {
      const result = await db<IRole>(this.tableName)
        .select("*")
        .where("ROLENAME",roleName)
        .first();
      return new Result<IRole>(result) ;
    }
    return new Result<IRole>(null,"Connect err") ;
  }

  public async getOneById(id: string): Promise<Role | undefined> {
    const db = this.OpenDB();
    if (db) {
      const result = await db<Role>(this.tableName)
        .select("*")
        .where("ID", id)
        .first();
      return result;
    }
    return undefined;
  }

 
}

export default RoleDao;
