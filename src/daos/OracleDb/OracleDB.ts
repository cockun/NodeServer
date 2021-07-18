import oracledb from "oracledb";
import knex, { Knex } from "knex";

class OracleDB {
  private password = "hr";
  private _connection!: Knex<any, unknown[]>;
  protected OpenDB(): Knex<any, unknown[]> {
    if (!this._connection) {
      this._connection = knex({
        client: "mysql",
        connection: {
          host: process.env.db ?? "127.0.0.1",
          user: "root",
          password: "123456aA",
          database: "Demo",
          requestTimeout: 100,
        },
      });
    }

    return this._connection;
  }

  protected async CloseDB(connection: oracledb.Connection) {
    await connection.close();
  }
}

export default OracleDB;
