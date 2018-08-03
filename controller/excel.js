const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');
const mysql = require('mysql2/promise');
const constants = require('../constants');

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
    parse: async (ctx, next) => {
        const workbook = XLSX.readFile('./upload/2017检测小组费用汇总.xlsx', {});
        // const workbook = XLSX.readFile('./upload/test.xlsx', {});

        // 获取 Excel 中所有表名
        const sheetNames = workbook.SheetNames; // 返回 ['sheet1', 'sheet2'];

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

        console.log('--0--' + contentData.length);

        await ctx.render('upload_result', {data: contentData});
    },
    upload: async (ctx, next) => {
        await ctx.render('upload');
    },
    uploadHandler: async (ctx, next) => {
        console.log('handle upload...');
        console.log(ctx.request.files.file);
        // console.log(ctx.request.body.files);

        const file = ctx.request.files.file;
        const reader = fs.createReadStream(file.path);	// 创建可读流
        const upStream = fs.createWriteStream('upload/' + file.name);		// 创建可写流
        reader.pipe(upStream).on('finish', () => {
            const workbook = XLSX.readFile(path.dirname(require.main.filename) + '/upload/' + file.name, {});
            const sheetNames = workbook.SheetNames; // 返回 ['201801', '201802', ...]

        });	// 可读流通过管道写入可写流


        await ctx.render('upload_result', {result: true});
    },
    save: async (ctx, next) => {
        // 检查记录是否已存在
        /*let [costID] = pool.query('SELECT id FROM py_cost WHERE year = ? AND month = ?', [year, month]);

        if(costID.length > 0){  // 记录已存在，更新记录

        }else{  // 记录不存在，新增

        }*/
    }
};