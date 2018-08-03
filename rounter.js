const router = require('koa-router')();
const HomeController = require('./controller/home');
const ExcelController = require('./controller/excel');
const MysqlController = require('./controller/mysql');

module.exports = (app) => {
    router.get('/', HomeController.index);

    router.get('/home', HomeController.home);

    router.get('/home/:id/:name', HomeController.homeParams);

    router.get('/user', HomeController.login);

    router.get('/hbs', HomeController.hbs);

    router.post('/user/register', HomeController.register);

    router.get('/json', HomeController.json);

    // -----------------------------------------------------------------------------
    // -----------------------------------------------------------------------------

    router.get('/xls', ExcelController.parse);

    router.get('/upload', ExcelController.upload);

    router.post('/upload', ExcelController.uploadHandler);

    router.get('/query', MysqlController.test);

    app.use(router.routes())
        .use(router.allowedMethods())
};