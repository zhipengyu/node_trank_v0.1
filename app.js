const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const koaBody = require('koa-body');
const logger = require('koa-logger')
const cors=require('koa2-cors')
const path=require('path')


const rest= require ('./rest');
const controller=require('./contorller')
const index = require('./routes/index')
// const users = require('./routes/users')

// error handler
onerror(app)

// middlewares


app.use(koaBody({
    multipart: true,
    formidable: {
        maxFileSize: 123545213560
    }
}));
// app.use(bodyParser.json({limit :'2100000kb'})); 
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'html'
}))


app.use(cors({
    origin: function(ctx) {
        if (ctx.url === '/test') {
            return false;
        }
        return '*';
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 10,
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE','PUT','OPTIONS'],
    allowHeaders: ['Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild'],
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})



// bind .rest() for ctx:
app.use(rest.restify());
// add controllers:
app.use(controller())
// routes
app.use(index.routes(), index.allowedMethods())
// app.use(users.routes(), users.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
