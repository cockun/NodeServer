import oracledb from "oracledb";
import knex, { Knex } from "knex";
class OracleDB {
  private password = "hr";

  protected OpenDB<T>(tableName: string): Knex.QueryBuilder<T> | null {
    try {
      const knex2 = knex({
        client: "oracledb",
        connection: {
          user: "c##user",
          password: "tiger",
          connectString:
            "(DESCRIPTION=(CONNECT_TIMEOUT=10)(RETRY_COUNT=3)(SOURCE_ROUTE=yes)(ADDRESS_LIST=(LOAD_BALANCE=on)(ADDRESS=(PROTOCOL=tcp)(HOST=your2.domain.com)(PORT=11529))(ADDRESS=(PROTOCOL=tcp)(HOST=your2.domain.com)(PORT=11529)))(ADDRESS_LIST=(FAILOVER=on)(LOAD_BALANCE=off)(ADDRESS=(PROTOCOL=tcp)(HOST=your3.domain.com)(port=1521))(ADDRESS=(PROTOCOL=tcp)(HOST=your4.domain.com)(port=1521)))(CONNECT_DATA=(SERVER=DEDICATED)(SERVICE_NAME=YOUR_SERVICE.your5.domain.com)))",
          requestTimeout: 100,
        },
      });

      return knex2<T>(tableName);
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
