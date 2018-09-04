const pool = require('./pool');
const logUtil = require('../util/logger');

module.exports = {
    getUserByUserName: async (userName) => {
        let sqlStatement = 'SELECT * FROM pg_users WHERE username = ?';
        let [rows] = await pool.query(sqlStatement, userName);

        logUtil.sqlTrace('getUserByUserName', sqlStatement, [userName]);

        return rows;
    },
    updateUserLastLogin: async (userName) => {
        let queryStatemet = 'UPDATE pg_users SET last_login = ? WHERE username = ?';
        let queryParams = [new Date(), userName]; 
        let result = pool.query(queryStatemet, queryParams);

        logUtil.sqlTrace('updateUserLastLogin', queryStatemet, queryParams);

        return result;
    }
};