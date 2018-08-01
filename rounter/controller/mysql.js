// const mysql = require('mysql2');
const mysql = require('mysql2/promise');

module.exports = {
    test: async (ctx, next) => {
        const connection = await mysql.createConnection({host:'localhost', user: 'root', password: '123456', database: 'peggy'});

        // const [rows, fields] = await connection.execute('SELECT * FROM pg_offices');


        let office = {
            name: '检测综合技术室',
            code: '00002'
        };
        const result = await connection.execute('INSERT INTO pg_offices (name,code) values ("检测综合技术室","00002")');
        console.log(result);

        await ctx.render('query');
    }
};