import oracledb from "oracledb";
import knex, { Knex } from "knex";

class OracleDB {
  private password = "hr";
  private _connection !: Knex<any, unknown[]>;
  protected OpenDB(): Knex<any, unknown[]> {
    if (!this._connection) {
      this._connection = knex({
        client: "oracledb",
        connection: {
          user: "c##user",
          password: "user",
          connectString: "localhost:1522/orcl",
          requestTimeout: 100,
        },
      });
    }

    return this._connection ;  
  }

  protected async CloseDB(connection: oracledb.Connection) {
    await connection.close();
  }
}

export default OracleDB;
