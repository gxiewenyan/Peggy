const pool = require('./pool');

module.exports = {
    getCostDataByOfficeYear: async (officeId, year) => {
        let [rows] = await pool.query('SELECT * FROM pg_cost WHERE office_id = ? AND year = ? ORDER BY MONTH ASC' , [officeId, year]);

        return rows;
    },
    getCostDataByOfficeYearMonth: async (officeId, year, month) =>{
        let [rows] = await pool.query('SELECT * FROM pg_cost WHERE year = ? AND month = ? AND office_id = ?', [year, month, officeId]);

        return rows;
    },
    getCostDetailsByCostId: async (costId) => {
        let sql = 'select ' +
            'a.id, ' +
            'a.year,a.month,' +
            'a.labour_cost, ' +
            'a.administrative_cost, ' +
            'a.depreciation_cost, ' +
            'a.variable_cost, ' +
            'b.salary, ' +
            'b.social_security, ' +
            'b.commercial_insurance, ' +
            'b.allowance, ' +
            'b.training, ' +
            'b.trade_union, ' +
            'b.labor_protection,' +
            'b.housing, ' +
            'b.tech_award, ' +
            'b.non_monetary, ' +
            'b.other AS labour_other, ' +
            'c.phone, ' +
            'c.mobile, ' +
            'c.post, ' +
            'c.books, ' +
            'c.other AS admin_other, ' +
            'd.trip, ' +
            'd.water_eletric, ' +
            'd.repair, ' +
            'd.consumable, ' +
            'd.rental, ' +
            'd.meeting, ' +
            'd.advertisement, ' +
            'd.greening, ' +
            'd.hospitality, ' +
            'd.decoration, ' +
            'd.sales_service, ' +
            'd.consultant, ' +
            'd.services, ' +
            'd.sampling, ' +
            'd.inspection, ' +
            'd.tax, ' +
            'd.cleaning, ' +
            'd.vehicle, ' +
            'd.other AS variable_other, ' +
            'e.name ' +
            'FROM pg_cost a, pg_labour_cost_details b, pg_administrative_cost_details c, pg_variable_cost_details d, pg_offices e ' +
            'WHERE a.id = b.cost_id AND a.id = c.cost_id AND a.id = d.cost_id AND a.office_id = e.id ' +
            'AND a.id = ?';
        let [rows] = await pool.query(sql, costId);

        return rows;
    },
    getAllCostDataByOfficeYearMonth: async (officeId, year, month) => {
        let sql = 'select ' +
            'a.id, ' +
            'a.year,a.month,' +
            'a.labour_cost, ' +
            'a.administrative_cost, ' +
            'a.depreciation_cost, ' +
            'a.variable_cost, ' +
            'b.salary, ' +
            'b.social_security, ' +
            'b.commercial_insurance, ' +
            'b.allowance, ' +
            'b.training, ' +
            'b.trade_union, ' +
            'b.labor_protection,' +
            'b.housing, ' +
            'b.tech_award, ' +
            'b.non_monetary, ' +
            'b.other AS labour_other, ' +
            'c.phone, ' +
            'c.mobile, ' +
            'c.post, ' +
            'c.books, ' +
            'c.other AS admin_other, ' +
            'd.trip, ' +
            'd.water_eletric, ' +
            'd.repair, ' +
            'd.consumable, ' +
            'd.rental, ' +
            'd.meeting, ' +
            'd.advertisement, ' +
            'd.greening, ' +
            'd.hospitality, ' +
            'd.decoration, ' +
            'd.sales_service, ' +
            'd.consultant, ' +
            'd.services, ' +
            'd.sampling, ' +
            'd.inspection, ' +
            'd.tax, ' +
            'd.cleaning, ' +
            'd.vehicle, ' +
            'd.other AS variable_other, ' +
            'e.name ' +
            'FROM pg_cost a, pg_labour_cost_details b, pg_administrative_cost_details c, pg_variable_cost_details d, pg_offices e ' +
            'WHERE a.id = b.cost_id AND a.id = c.cost_id AND a.id = d.cost_id AND a.office_id = e.id ' +
            'AND a.office_id = ? AND a.year = ? AND a.month = ?';
        let [rows] = await pool.query(sql, [officeId, year, month]);

        return rows;
    },
    getAllCostData: async () => {
        let [rows] = await pool.query('SELECT a.id, a.year, a.month, a.labour_cost, a.administrative_cost, a.depreciation_cost, a.variable_cost, b.name FROM pg_cost a, pg_offices b WHERE a.office_id = b.id ORDER BY a.year ASC, a.month ASC;');

        return rows;
    },
    addCost: async (cost) => {
        let result = await pool.query('INSERT INTO pg_cost SET ?', cost);

        return result;
    },
    addLabourCostDetails: async (labourCostDetails) => {
        let result = pool.query('INSERT INTO pg_labour_cost_details SET ?', labourCostDetails);

        return result;
    },
    addAdminCostDetails: async (adminCostDetails) => {
        let result = pool.query('INSERT INTO pg_administrative_cost_details SET ?', adminCostDetails);

        return result;
    },
    addVariableCostDetails: async (variableCostDetails) => {
        let result = pool.query('INSERT INTO pg_variable_cost_details SET ?', variableCostDetails);

        return result;
    },
    updateCostByYearMonth: async (cost, year, month) => {
        let result = pool.query('UPDATE pg_cost SET ? WHERE year = ? AND month = ?', [cost, year, month]);

        return result;
    },
    getCostIdByYearMonth: async (year, month) => {
        let result = await pool.query('SELECT id FROM pg_cost WHERE year = ? AND month = ?', [year, month]);
        let costId = result[0][0].id;

        return costId;
    },
    updateLabourCostDetailsByCostId: async (labourCostDetails, costId) => {
        let result = await pool.query('UPDATE pg_labour_cost_details SET ? WHERE cost_id = ?', [labourCostDetails, costId]);

        return result;
    },
    updateAdminCostDetailsByCostId: async (adminCostDetails, costId) => {
        let result = await pool.query('UPDATE pg_administrative_cost_details SET ? WHERE cost_id = ?', [adminCostDetails, costId]);

        return result;
    },
    updateVariableCostDetailsByCostId: async (variableCostDetail, costId) => {
        let result = await pool.query('UPDATE pg_variable_cost_details SET ? WHERE cost_id = ?', [variableCostDetail, costId]);

        return result;
    }
};