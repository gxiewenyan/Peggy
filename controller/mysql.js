const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'peggy',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = {
    getAllOffices: async () => {
        let [rows] = await pool.query('SELECT * FROM pg_offices');

        return rows;
    },
    dataInputPageHandler: async (ctx, next) => {
        let offices = await module.exports.getAllOffices();
        await ctx.render('data_input', offices);
    },
    submitDataHandler: async (ctx, next) => {
        let {
            year,
            month,
            office_id,
            // 人工成本
            labour_cost_total,
            labour_cost_salary,
            labour_cost_social_security,
            labour_cost_commercial_insurance,
            labour_cost_allowance,
            labour_cost_training,
            labour_cost_trade_union,
            labour_cost_labor_protection,
            labour_cost_housing,
            labour_cost_tech_award,
            labour_cost_non_monetary,
            labour_cost_other,
            // 办公费
            admin_cost_total,
            admin_cost_phone,
            admin_cost_mobile,
            admin_cost_post,
            admin_cost_books,
            admin_cost_other,
            // 折旧费
            depreciation_cost_total,
            depreciation_cost,
            // 可变动成本
            variable_cost_total,
            variable_cost_trip,
            variable_cost_water_eletric,
            variable_cost_repair,
            variable_cost_consumable,
            variable_cost_rental,
            variable_cost_meeting,
            variable_cost_advertisement,
            variable_cost_greening,
            variable_cost_hospitality,
            variable_cost_decoration,
            variable_cost_sales_service,
            variable_cost_consultant,
            variable_cost_services,
            variable_cost_sampling,
            variable_cost_inspection,
            variable_cost_tax,
            variable_cost_cleaning,
            variable_cost_vehicle,
            variable_cost_other
        } = ctx.request.body;

        let [rows] = await pool.query('SELECT * FROM pg_cost WHERE year = ? AND month = ? AND office_id = ?', [year, month, office_id]);

        let pgCost = {
            office_id: office_id,
            total_cost: parseFloat(labour_cost_total) + parseFloat(admin_cost_total) + parseFloat(depreciation_cost_total) + parseFloat(variable_cost_total),
            labour_cost: labour_cost_total,
            administrative_cost: admin_cost_total,
            depreciation_cost: depreciation_cost_total,
            variable_cost: variable_cost_total,
            year: year,
            month: month
        };

        let pgLabourCostDetails = {
            salary: labour_cost_salary,
            social_security: labour_cost_social_security,
            commercial_insurance: labour_cost_commercial_insurance,
            allowance: labour_cost_allowance,
            training: labour_cost_training,
            trade_union: labour_cost_trade_union,
            labor_protection: labour_cost_labor_protection,
            housing: labour_cost_housing,
            tech_award: labour_cost_tech_award,
            non_monetary: labour_cost_non_monetary,
            other: labour_cost_other
        };

        let pgAdminCostDetails = {
            phone: admin_cost_phone,
            mobile: admin_cost_mobile,
            post: admin_cost_post,
            books: admin_cost_books,
            other: admin_cost_other
        };

        let pgVariableCostDetails = {
            trip: variable_cost_trip,
            water_eletric: variable_cost_water_eletric,
            repair: variable_cost_repair,
            consumable: variable_cost_consumable,
            rental: variable_cost_rental,
            meeting: variable_cost_meeting,
            advertisement: variable_cost_advertisement,
            greening: variable_cost_greening,
            hospitality: variable_cost_hospitality,
            decoration: variable_cost_decoration,
            sales_service: variable_cost_sales_service,
            consultant: variable_cost_consultant,
            services: variable_cost_services,
            sampling: variable_cost_sampling,
            inspection: variable_cost_inspection,
            tax: variable_cost_tax,
            cleaning: variable_cost_cleaning,
            vehicle: variable_cost_vehicle,
            other: variable_cost_other
        };

        if(rows.length > 0){  // 记录已存在，更新
            await pool.query('UPDATE pg_cost SET ? WHERE year = ? AND month = ?', [pgCost, year, month]);
            let result = await pool.query('SELECT id FROM pg_cost WHERE year = ? AND month = ?', [year, month]);
            let costId = result[0][0].id;

            await pool.query('UPDATE pg_labour_cost_details SET ? WHERE cost_id = ?', [pgLabourCostDetails, costId]);
            await pool.query('UPDATE pg_administrative_cost_details SET ? WHERE cost_id = ?', [pgAdminCostDetails, costId]);
            await pool.query('UPDATE pg_variable_cost_details SET ? WHERE cost_id = ?', [pgVariableCostDetails, costId]);

        } else {  // 记录不存在，新增
            let result = await pool.query('INSERT INTO pg_cost SET ?', pgCost);
            let costId = result[0].insertId;
            // affectedRows

            pgLabourCostDetails.cost_id = costId;
            pgAdminCostDetails.cost_id = costId;
            pgVariableCostDetails.cost_id = costId;

            await pool.query('INSERT INTO pg_labour_cost_details SET ?', pgLabourCostDetails);
            await pool.query('INSERT INTO pg_administrative_cost_details SET ?', pgAdminCostDetails);
            await pool.query('INSERT INTO pg_variable_cost_details SET ?', pgVariableCostDetails);


        }

        await ctx.render('data_input_result');
    },
    stakedBarByOfficeHandler: async (ctx, next) => {
        let offices = await module.exports.getAllOffices();

        await ctx.render('stackedBar_by_office', offices);
    },
    stackedBarByOfficeInterface: async (ctx, next) => {
        let officeId = ctx.request.query.officeId,
            year = ctx.request.query.year;

        // let queryOptions = {
        //     sql: 'SELECT * FROM pg_cost WHERE office_id = ? AND year = ? ORDER BY MONTH ASC',
        //     rowsAsArray: false
        // };
        let result = await pool.query('SELECT * FROM pg_cost WHERE office_id = ? AND year = ? ORDER BY MONTH ASC' , [officeId, year]);

        await ctx.send({
            status: "200",
            msg: 'success',
            data: {
                name: "Gary"
            }
        });
    },
    submitedDataHandler: async (ctx, next) => {
        let [rows] = await pool.query('SELECT a.year, a.month, b.name FROM pg_cost a, pg_offices b WHERE a.office_id = b.id;');

        await ctx.render('submitted_data', rows);
    }
};