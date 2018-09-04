const constants = require('../constants');
const userService = require('../service/user');
const jwt = require('jsonwebtoken');
const logUtil = require('../util/logger');

module.exports = {
    loginHandler: async (ctx, next) => {
        logUtil.loggerTrace('[loginHandler]，进入登录页面');
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

            logUtil.loggerTrace('[loginInterface]，登录失败，用户（' + userName + '）不存在');
        }else if(rows[0].password != password){
            status = '400';
            msg = '密码错误';

            logUtil.loggerTrace('[loginInterface]，登录失败，密码错误');
        }else{
            // 更新最近登录时间
            await userService.updateUserLastLogin(userName);

            let payload = {
                userNumber: rows[0].userNumber,
                time: new Date().getTime(),
                timeout: 60 * 30 * 1000 // 30分钟
            };
            token = jwt.sign(payload, constants.SECRET);

            logUtil.loggerTrace('[loginInterface]，（' + userName + '）登录成功');
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