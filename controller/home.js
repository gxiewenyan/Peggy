const HomeService = require('../service/home');

module.exports = {
    index: async(ctx, next) => {
        await ctx.render('home');
    },
    home: async(ctx, next) => {
        console.log(ctx.request.query)
        console.log(ctx.request.querystring)
        ctx.response.body = '<h1>HOME page</h1>'
    },
    homeParams: async(ctx, next) => {
        console.log(ctx.params);
        ctx.response.body = '<h1>HOME page /:id/:name</h1>'
    },
    hbs: async(ctx, next) => {
        console.log(ctx.params);
        await ctx.render('home', {name: 'Gary'});
    },
    json: async(ctx, next) => {
        console.log(ctx.params);
        await ctx.send({
            status: "200",
            msg: 'success',
            data: {
                name: "Gary"
            }
        });
    },
    login: async(ctx, next) => {
        ctx.response.body ='<form action="/user/register" method="post"><input name="name" type="text" placeholder="请输入用户名：ikcamp"/> <br/><input name="password" type="text" placeholder="请输入密码：123456"/><br/><button>GoGoGo</button></form>';
    },
    register: async(ctx, next) => {
        let {
            name,
            password
        } = ctx.request.body;
        let data = await HomeService.register(name, password)
        ctx.response.body = data
    }
}