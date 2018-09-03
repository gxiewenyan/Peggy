const pool = require('./pool');

module.exports = {
    getUserByUserName: async (userName) => {
        let [rows] = await pool.query('SELECT * FROM pg_users WHERE username = ?', userName);

        return rows;
    },
    updateUserLastLogin: async (userName) => {
        let result = pool.query('UPDATE pg_users SET last_login = ? WHERE username = ?', [new Date(), userName]);

        return result;
    }
};