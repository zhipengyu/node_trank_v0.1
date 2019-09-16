const router = require('koa-router')()
const mysql=require('../lib/mysql');
const fs=require('fs');

router.get('/', async (ctx, next) => {
  await ctx.render('index');
});

router.get('/string', async (ctx, next) => {
  ctx.body = `var a=123123;console.log(a)`
});
router.get('/test',async (ctx,next)=>{
  await  ctx.render('dome');
});
 router.post('/write',async (ctx,next)=>{
   const file = ctx.request.files;
     console.log(file['file'].path)
   const reader=fs.createReadStream(file['file'].path);

   let filepaths='conterFile/'+ctx.request.body.ip+'/';
   let filePath=filepaths+ new Date().getTime()+'.html';
   if(!fs.existsSync(filepaths)){
       fs.mkdir(filepaths,(err)=>{
           if(err){
               throw new Error(err)
           }
       })

   };

   let upstrame=fs.createWriteStream(filePath);
       reader.pipe(upstrame)
     ctx.body={
         status:0,dast:'sdf'
     }
 })

router.post('/user/login',async (ctx,next)=>{
  var date=ctx.request.body;
  let _date=`SELECT password FROM user where name = '${date.name}'`;
  const bet = await mysql(_date);
  console.log(bet[0].password,date.password)
  if(bet[0].password===date.password){
    ctx.body={status:3,msg:'登入成功'}
  }else {
      ctx.body={status:0,msg:'账号密码错误'}
  }
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
});
module.exports = router
