import oracledb from "oracledb";
import knex, { Knex } from "knex";

class OracleDB {
  private password = "hr";

  protected OpenDB(): Knex<any, unknown[]>  {
    const knex2 = knex({
      client: "oracledb",
      connection: {
        user: "c##user",
        password: "user",
        connectString:
          "localhost:1521/orcl",
        requestTimeout: 100,
      },
    });
    
    return knex2;
    
  }

  protected async CloseDB(connection: oracledb.Connection) {
    await connection.close();
  }
}

export default OracleDB;
