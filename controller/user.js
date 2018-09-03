const constants = require('../constants');
const userService = require('../service/user');
const jwt = require('jsonwebtoken');

module.exports = {
    loginHandler: async (ctx, next) => {

        await ctx.render('login');
    },
    loginInterface: async (ctx, next) => {
        let {userName, password} = ctx.request.body;

        let rows = await userService.getUserByUserName(userName);

        let status = '200',
            msg = '登录成功',
            token = '';
        if(rows.length <= 0){
            status = '401';
            msg = '用户不存在';
        }else if(rows[0].password != password){
            status = '400';
            msg = '密码错误';
        }else{
            // 更新最近登录时间
            await userService.updateUserLastLogin(userName);

            let payload = {
                userNumber: rows[0].userNumber,
                time: new Date().getTime(),
                timeout: 60 * 30 * 1000 // 30分钟
            };
            token = jwt.sign(payload, constants.SECRET);
        }

        await ctx.send({
            status: status,
            msg: msg,
            data: {
                token: token
            }
        });
    }
};