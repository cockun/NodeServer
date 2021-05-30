import oracledb from "oracledb"
// hr schema password
var password = '<PASSWORD>' 
// checkConnection asycn function
async function getOracleDB() {
  let connection;
  try {
      connection = await oracledb.getConnection({
        user: "hr",
        password: password,
        connectString: "localhost:1521/orcl"  
    });
    return connection;
  } catch (err) {
    console.error(err.message);
    return null;
  } finally {
    if (connection) {
      try {
        // Always close connect
        await connection.close(); 
        console.log('close connection success');
      } catch (err) {
        console.error(err.message);
      }
    }
  }
}
export {getOracleDB} ;