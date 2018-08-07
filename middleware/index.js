const path = require('path');
const bodyParser = require('koa-bodyparser');
const staticFiles = require('koa-static');
const views = require('koa-views');
const returnJSON = require('./returnJSON');
const koaBody = require('koa-body');

module.exports = (app) => {
    // 指定 static 目录为静态资源目录，用来存放 js css /koa2/images 等
    app.use(staticFiles(path.resolve(__dirname, "../static")));

    app.use(views('views', {
        root: __dirname + '/views',
        extension: 'hbs',
        map: { hbs: 'handlebars' },
        options: {
            partials: {
                nav: './nav'
            }
        }
    }));

    app.use(koaBody({
        multipart: true,
        formidable: {
            maxFileSize: 200*1024*1024	// 设置上传文件大小最大限制，默认2M
        }
    }));

    app.use(bodyParser());
    app.use(returnJSON())
};