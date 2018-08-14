const constants = require('../constants');
const userService = require('../service/user');

module.exports = {
    loginHandler: async (ctx, next) => {

        await ctx.render('login');
    },
    loginInterface: async (ctx, next) => {
        let {userName, password} = ctx.request.body;

        let rows = await userService.getUserByUserName(userName);

        let status = '200',
            msg = '登录成功';
        if(rows.length <= 0){
            status = '401';
            msg = '用户不存在';
        }else if(rows[0].password != password){
            status = '400';
            msg = '密码错误';
        }

        await ctx.send({
            status: status,
            msg: msg,
            data: {}
        });
    }
};