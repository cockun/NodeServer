import oracledb from "oracledb";
import knex, { Knex } from "knex";
class OracleDB {
  private password = "hr";

  protected OpenDB(): Knex<any, unknown[]> | null {
    try {
      const knex2 = knex({
        client: "oracledb",
        connection: {
          user: "web",
          password: "coc",
          connectString:
            "localhost:1521/orcl",
          requestTimeout: 100,
        },
      });

      return knex2;
    } catch (err) {
      console.error(err.message);
      return null;
    }
  }

  protected async CloseDB(connection: oracledb.Connection) {
    await connection.close();
  }
}

export default OracleDB;
