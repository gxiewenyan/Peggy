const Koa = require('koa');
const app = new Koa();
const router = require('./rounter');
const middleware = require('./middleware');

middleware(app);

router(app);

app.listen(80, () => {
	console.log('server is running at http://localhost')
});