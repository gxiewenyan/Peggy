const costService = require('../service/cost');
const officeService = require('../service/office');
const constants = require('../constants');

module.exports = {
    dataInputPageHandler: async (ctx, next) => {
        let offices = await officeService.getAllOffices();
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

        let rows = await costService.getCostDataByOfficeYearMonth(office_id, year, month);

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
            await costService.updateCostByOfficeYearMonth(pgCost, office_id, year, month);
            let costId = await costService.getCostIdByYearMonth(year, month);

            await costService.updateLabourCostDetailsByCostId(pgLabourCostDetails, costId);
            await costService.updateAdminCostDetailsByCostId(pgAdminCostDetails, costId);
            await costService.updateVariableCostDetailsByCostId(pgVariableCostDetails, costId);

        } else {  // 记录不存在，新增
            let result = await costService.addCost(pgCost);
            let costId = result[0].insertId;
            // affectedRows

            pgLabourCostDetails.cost_id = costId;
            pgAdminCostDetails.cost_id = costId;
            pgVariableCostDetails.cost_id = costId;

            await costService.addLabourCostDetails(pgLabourCostDetails);
            await costService.addAdminCostDetails(pgAdminCostDetails);
            await costService.addVariableCostDetails(pgVariableCostDetails);

        }

        let inputResult = await costService.getAllCostDataByOfficeYearMonth(office_id, year, month);

        await ctx.render('data_input_result', inputResult[0]);
    },
    stakedBarByOfficeHandler: async (ctx, next) => {
        let offices = await officeService.getAllOffices();

        await ctx.render('stackedBar_by_office', offices);
    },
    stackedBarByOfficeInterface: async (ctx, next) => {
        let officeId = ctx.request.query.officeId,
            year = ctx.request.query.year;

        /*let rows17 = await costService.getCostDataByOfficeYear(officeId, 2017);
        let rows18 = await costService.getCostDataByOfficeYear(officeId, 2018);*/

        let rows17 = await costService.getCostDataAndConsumableByOfficeYear(officeId, 2017);
        let rows18 = await costService.getCostDataAndConsumableByOfficeYear(officeId, 2018);

        await ctx.send({
            status: "200",
            msg: 'success',
            data: {
                /*legend: constants.COST_TYPE_ARRAY,
                legend_en: constants.COST_TYPE_COL_NAME_ARRAY,*/
                legend: constants.COMPARISON_CHART_LEGEND,
                legend_en: constants.COMPARISON_CHART_LEGEND_EN,
                xAxis: constants.ALL_MONTHS,
                data17: rows17,
                data18: rows18
            }
        });
    },
    costListHandler: async (ctx, next) => {

        await ctx.render('cost_list');
    },
    costListDataInterface: async (ctx, next) => {
        let year = ctx.request.query.year,
            month = ctx.request.query.month;

        let rows = await costService.getCostDataByYearMonth(year, month);

        await ctx.send({
            status: '200',
            msg: 'success',
            data: {
                legend: constants.COST_TYPE_ARRAY,
                legend_en: constants.COST_TYPE_COL_NAME_ARRAY,
                data: rows
            }
        });
    },
    submitedDataHandler: async (ctx, next) => {
        let officeId = '-1',
            year = '-1',
            month = '-1';

        if(ctx.request && ctx.request.body){
            officeId = ctx.request.body.officeId || '-1';
            year = ctx.request.body.year || '-1';
            month = ctx.request.body.month || '-1';
            pageNum = ctx.request.body.pageNum || 1;
        }

        let start = (pageNum - 1) * constants.PAGE_SIZE;

        let offices = await officeService.getAllOffices();
        let rows = await costService.getCostDataByOfficeYearMonthPage(officeId, year, month, start);
        let rowCount = await costService.getCostDataRowCountByOfficeYearMonth(officeId, year, month);

        let pageArray = [];
        for(let i = 0; i < Math.ceil(rowCount/constants.PAGE_SIZE); i++){
            let clazz =  (i+1) == pageNum ? 'active' : 'inactive';
            pageArray.push({
                number: i + 1,
                clazz: clazz
            });
        }

        let renderData = {
            offices: offices,
            cost: rows,
            pages: pageArray,
            queryParams: {
                officeId: officeId,
                year: year,
                month: month
            }
        };
        await ctx.render('submitted_data', renderData);
    },
    costDataInterface: async (ctx, next) => {
        let officeId = ctx.request.query.officeId,
            year = ctx.request.query.year,
            month = ctx.request.query.month,
            pageNum = ctx.request.query.pageNum;

        let start = (pageNum - 1) * constants.PAGE_SIZE;

        let rows = await costService.getCostDataByOfficeYearMonthPage(officeId, year, month, start);
        let rowCount = await costService.getCostDataRowCountByOfficeYearMonth(officeId, year, month);

        await ctx.send({
            status: '200',
            msg: 'success',
            data: {
                data: rows,
                pager: {
                    pageNum: pageNum,
                    pageCount: Math.ceil(rowCount/constants.PAGE_SIZE)
                }
            }
        });
    },
    costDetailsHandler: async (ctx, next) => {
        let costId = ctx.params.costId;

        let costDetails = await costService.getCostDetailsByCostId(costId);

        await ctx.render('cost_details', costDetails[0]);
    }
};