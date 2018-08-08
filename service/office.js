const pool = require('./pool');

module.exports = {
    getAllOffices: async () => {
        let [rows] = await pool.query('SELECT * FROM pg_offices ORDER BY code ASC');

        return rows;
    }
};