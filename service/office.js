const pool = require('./pool');

module.exports = {
    getAllOffices: async () => {
        let [rows] = await pool.query('SELECT * FROM pg_offices');

        return rows;
    }
};