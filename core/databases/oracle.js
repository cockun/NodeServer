const oracledb = require('oracledb');
// hr schema password
var password = '<PASSWORD>' 
// checkConnection asycn function
async function getOracleDB() {
  try {
    connection = await oracledb.getConnection({
        user: "hr",
        password: password,
        connectString: "localhost:1521/xepdb1"
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
module.exports = {
    getOracleDB
}