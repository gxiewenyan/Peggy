const jwt = require('jsonwebtoken');
const constants = require('../constants');

module.exports = () => {
    return async (ctx, next) => {
        let url = ctx.request.url;

        let reg = /\/p\/\S*|\/js\/S*|\/css\/S*/;
        if (url == '/login' || url =='/' || url.match(reg)){
            await next();
        } else {
            // 规定token写在header 的 'autohrization'
            let token = ctx.request.headers["authorization"];
            // 解码
            let payload;
            try {
                payload = await jwt.verify(token, constants.SECRET);
            } catch (err) {
                ctx.body = {
                    status: constants.LOGIN_EXPIRE_STATUS_CODE,
                    msg:'登录过期，请重新登录'
                };
            }
            if(payload){
                let { time, timeout } = payload;
                let date = new Date().getTime();
                if (date - time <= timeout) {
                    // 未过期
                    await next();
                } else {
                    //过期
                    ctx.body = {
                        status: constants.LOGIN_EXPIRE_STATUS_CODE,
                        msg:'登录过期，请重新登录'
                    };
                }
            }

        }
    }
};