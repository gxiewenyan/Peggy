const pool = require('./pool');

module.exports = {
    getUserByUserName: async (userName) => {
        let [rows] = await pool.query('SELECT * FROM pg_users WHERE username = ?', userName);

        return rows;
    }
};