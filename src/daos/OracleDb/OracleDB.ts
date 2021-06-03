import oracledb from "oracledb";

class OracleDB {
  private password = "hr";

  protected async OpenDB(): Promise<oracledb.Connection | null> {
    try {
      let connection = await oracledb.getConnection({
        user: "hr",
        password: this.password,
        connectString: "localhost:1521/orcl",
      });
      return connection;
    } catch (err) {
      console.error(err.message);
      return null;
    }
  }

  protected async CloseDB(connection: oracledb.Connection) {
         await connection.close();
  }




}
