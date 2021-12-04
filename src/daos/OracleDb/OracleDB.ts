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
<<<<<<< HEAD
          host: "localhost",
          user: "thengansax",
          password: "1234",
          database: "blockchain",
=======
          host: 'localhost',
          user: "root",
          password: "123456aA",
          database: "Demo",
>>>>>>> c24739d289038a83a11c8eaf3173d1898d285426
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
