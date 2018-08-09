const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');
// const mysql = require('mysql2/promise');
// const constants = require('../constants');
const costService = require('../service/cost');


module.exports = {
    parse: async (ctx, next) => {
        const workbook = XLSX.readFile('./upload/2017import.xlsx', {});
        // const workbook = XLSX.readFile('./upload/test.xlsx', {});

        // 获取 Excel 中所有表名
        const sheetNames = workbook.SheetNames; // 返回 ['sheet1', 'sheet2'];

        let officesNames = ['技术服务','管理部','检测综合技术室','质管部','科研中心','信息中心','业务受理室','快检室','新项目研发室','检测办','报告室（综合业务）','样品室','抽样室','理化室','气相室','微生物室','液相室','光谱室','氨基酸室','分子室'];
        let officeIdMapping = [{
            "name": "技术服务",
            "id": 1
        }, {
            "name": "管理部",
            "id": 2
        }, {
            "name": "检测综合技术室",
            "id": 3
        }, {
            "name": "质管部",
            "id": 4
        }, {
            "name": "科研中心",
            "id": 5
        }, {
            "name": "信息中心",
            "id": 6
        }, {
            "name": "业务受理室",
            "id": 7
        }, {
            "name": "快检室",
            "id": 8
        }, {
            "name": "新项目研发室",
            "id": 9
        }, {
            "name": "检测办",
            "id": 10
        }, {
            "name": "报告室（综合业务）",
            "id": 11
        }, {
            "name": "样品室",
            "id": 12
        }, {
            "name": "抽样室",
            "id": 13
        }, {
            "name": "理化室",
            "id": 14
        }, {
            "name": "气相室",
            "id": 15
        }, {
            "name": "微生物室",
            "id": 16
        }, {
            "name": "液相室",
            "id": 17
        }, {
            "name": "光谱室",
            "id": 18
        }, {
            "name": "氨基酸室",
            "id": 19
        }, {
            "name": "分子室",
            "id": 20
        }];

        let cols = ['B','C','D','E','F','G','H','I','J','K','L',"M",'N','O','P','Q','R','S','T','U'];

        sheetNames.forEach((sheetName) => {
            let splitedSheetName = sheetName.split('.');
            let year = splitedSheetName[0],
                month = splitedSheetName[1];

            cols.forEach(async (col) => {
                let address_of_cell = col + '1';

                /* Get worksheet */
                let worksheet = workbook.Sheets[sheetName];

                /* Find desired cell */
                let officeCell = worksheet[address_of_cell];

                /* Get the value */
                let officeCellValue = officeCell.v;

                let officeId = officeIdMapping[officesNames.indexOf(officeCellValue)].id;

                let labourCost = worksheet[col + '2'].v,
                    adminCost = worksheet[col + '14'].v,
                    depreciationCost = worksheet[col + '20'].v,
                    variableCost = worksheet[col + '21'].v;

                let pgCost = {
                    office_id: officeId,
                    total_cost: parseFloat(labourCost) + parseFloat(adminCost) + parseFloat(depreciationCost) + parseFloat(variableCost),
                    labour_cost: labourCost,
                    administrative_cost: adminCost,
                    depreciation_cost: depreciationCost,
                    variable_cost: variableCost,
                    year: year,
                    month: month
                };

                let salary = worksheet[col + '3'].v,
                    socialSecurity = worksheet[col + '4'].v,
                    commericalInsurance = worksheet[col + '5'].v,
                    allowanace = worksheet[col + '6'].v,
                    traning = worksheet[col + '7'].v,
                    tradeUnion = worksheet[col + '8'].v,
                    laborProtection = worksheet[col + '9'].v,
                    housing = worksheet[col + '10'].v,
                    techAward = worksheet[col + '11'].v,
                    nonMonetary = worksheet[col + '12'].v,
                    labourOther = worksheet[col + '13'].v;

                let pgLabourCostDetails = {
                    salary: salary,
                    social_security: socialSecurity,
                    commercial_insurance: commericalInsurance,
                    allowance: allowanace,
                    training: traning,
                    trade_union: tradeUnion,
                    labor_protection: laborProtection,
                    housing: housing,
                    tech_award: techAward,
                    non_monetary: nonMonetary,
                    other: labourOther
                };

                let pgAdminCostDetails = {
                    phone: worksheet[col + '15'].v,
                    mobile: worksheet[col + '16'].v,
                    post: worksheet[col + '17'].v,
                    books: worksheet[col + '18'].v,
                    other: worksheet[col + '19'].v
                };

                let pgVariableCostDetails = {
                    trip: worksheet[col + '22'].v,
                    water_eletric: worksheet[col + '23'].v,
                    repair: worksheet[col + '24'].v,
                    consumable: worksheet[col + '25'].v,
                    rental: worksheet[col + '26'].v,
                    meeting: worksheet[col + '27'].v,
                    advertisement: worksheet[col + '28'].v,
                    greening: worksheet[col + '29'].v,
                    hospitality: worksheet[col + '30'].v,
                    decoration: worksheet[col + '31'].v,
                    sales_service: worksheet[col + '32'].v,
                    consultant: worksheet[col + '33'].v,
                    services: worksheet[col + '34'].v,
                    sampling: worksheet[col + '35'].v,
                    inspection: worksheet[col + '36'].v,
                    tax: worksheet[col + '37'].v,
                    cleaning: worksheet[col + '38'].v,
                    vehicle: worksheet[col + '39'].v,
                    other: worksheet[col + '40'].v
                };

                let result = await costService.addCost(pgCost);
                let costId = result[0].insertId;
                // affectedRows

                pgLabourCostDetails.cost_id = costId;
                pgAdminCostDetails.cost_id = costId;
                pgVariableCostDetails.cost_id = costId;

                await costService.addLabourCostDetails(pgLabourCostDetails);
                await costService.addAdminCostDetails(pgAdminCostDetails);
                await costService.addVariableCostDetails(pgVariableCostDetails);
            });
        });




        ctx.body = 'ok';
    },
    upload: async (ctx, next) => {
        await ctx.render('upload');
    },
    uploadHandler: async (ctx, next) => {
        console.log('handle upload...');

        const file = ctx.request.files.file;
        const reader = fs.createReadStream(file.path);	// 创建可读流
        const upStream = fs.createWriteStream('upload/' + file.name);		// 创建可写流
        reader.pipe(upStream);	// 可读流通过管道写入可写流

        // await ctx.render('upload_result', {result: true});
        await module.exports.uploadResultHandler(ctx, next, file.name);
    },
    uploadResultHandler: async (ctx, next, fileName) => {
        const workbook = XLSX.readFile('./upload/' + fileName, {});

        // 获取 Excel 中所有表名
        const sheetNames = workbook.SheetNames; // 返回 ['sheet1', 'sheet2'];
        console.log('sheetNames =====> ' + sheetNames);

        let sheetHtml = XLSX.utils.sheet_to_html(workbook.Sheets[sheetNames[0]]);
        console.log(sheetHtml);

        let contentData = [];
        let reg = /<table>[\S|\s]*<\/table>/ig;

        for(let i = 0, length = sheetNames.length; i < length; i++){
            let sheetContentHtml = XLSX.utils.sheet_to_html(workbook.Sheets[sheetNames[i]]).match(reg);
            contentData.push({
                sheetName: sheetNames[i],
                sheetContent: sheetContentHtml
            });
        }

        await ctx.render('upload_result', {data: contentData});
    },
    save: async (ctx, next) => {
        // 检查记录是否已存在
        /*let [costID] = pool.query('SELECT id FROM py_cost WHERE year = ? AND month = ?', [year, month]);

        if(costID.length > 0){  // 记录已存在，更新记录

        }else{  // 记录不存在，新增

        }*/
    }
};