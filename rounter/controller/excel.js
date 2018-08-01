const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

module.exports = {
    parse: async (ctx, next) => {
        const workbook = XLSX.readFile(path.dirname(require.main.filename) + '/upload/test.xlsx', {});

        // 获取 Excel 中所有表名
        const sheetNames = workbook.SheetNames; // 返回 ['sheet1', 'sheet2'];

        console.log(sheetNames);
    },
    upload: async (ctx, next) => {
        await ctx.render('upload');
    },
    handleUpload: async (ctx, next) => {
        console.log('handle upload...');
        console.log(ctx.request.files.file);
        // console.log(ctx.request.body.files);

        const file = ctx.request.files.file;
        const reader = fs.createReadStream(file.path);	// 创建可读流
        const ext = file.name.split('.').pop();		// 获取上传文件扩展名
        const upStream = fs.createWriteStream('upload/' + file.name);		// 创建可写流
        reader.pipe(upStream);	// 可读流通过管道写入可写流

        await ctx.render('upload_result', {result: true});
    }
};