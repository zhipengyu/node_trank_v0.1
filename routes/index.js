const router = require('koa-router')()

router.get('/', async (ctx, next) => {
  await ctx.render('index');
})

router.get('/string', async (ctx, next) => {
  ctx.body = `var a=123123;console.log(a)`
  //   ctx.body=''
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

module.exports = router
