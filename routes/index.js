const router = require('koa-router')()
const mysql=require('../lib/mysql');
const fs=require('fs');
const send=require('koa-send');
const archiver=require('archiver');
const carrier=require('../public/static/carrier')

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
     const string=ctx.request.body.file;
   let filepaths='conterFile/'+ctx.request.body.requestId+'/';
   let filePath=filepaths+ new Date().getTime()+'.html';
   if(!fs.existsSync(filepaths)){
       fs.mkdir(filepaths,(err)=>{
           if(err){
               throw new Error(err)
           }
       });
   };
     var data=ctx.request.body;
     var filePathend='https://kilo.pub/offerHtml'+filePath.replace('conterFile','');
     let _date=`INSERT INTO visit (ip,url,offerId,pv,cookieCount,city,filePath,appId,requestId) VALUES ('${data.ip}','${data.url}' ,'${ data.offerId }','${data.pv}' ,'${data.cookieCount}','${data.city}','${filePathend}','${data.appId}','${data.requestId}');`
     const bet = await mysql(_date);
     let upstrame=fs.createWriteStream(filePath);
     upstrame.write(string);
     // reader.pipe(upstrame)
     ctx.body={
         data:bet
     }
 })
router.post('/writer',async (ctx,next)=>{
    const string=ctx.request.body.file;
    let filepaths='conterFile/'+ctx.request.body.requestId+'/';
    let filePath=filepaths+ new Date().getTime()+'.html';
    if(!fs.existsSync(filepaths)){
        fs.mkdir(filepaths,(err)=>{
            if(err){
                throw new Error(err)
            }
        });
    };
    var data=ctx.request.body;
    var filePathend='https://kilo.pub/offerHtml'+filePath.replace('conterFile','');
    let _date=`INSERT INTO visiter (url,offerId,pv,cookieCount,filePath,appId,requestId) VALUES ('${data.url}' ,'${ data.offerId }','${data.pv}' ,'${data.cookieCount}','${filePathend}','${data.appId}','${data.requestId}');`
    const bet = await mysql(_date);
    let upstrame=fs.createWriteStream(filePath);
    upstrame.write(string);
    ctx.body={
        data:bet
    }
})

router.post('/user/login',async (ctx,next)=>{
  var date=ctx.request.body;
  // let _date=`SELECT password FROM user where name = '${date.name}'`;
  // const bet = await mysql(_date);
    console.log(date)
    ctx.body={status:3,msg:'登入成功'}
  // if(bet[0].password===date.password){
  //   ctx.body={status:3,msg:'登入成功'}
  // }else {
  //     ctx.body={status:0,msg:'账号密码错误'}
  // }
})

router.post('/loger',async (ctx,next)=>{
    var resp=ctx.request.body;
    for(var i=0;i<resp.length;i++){
        var data=resp[i];
        var mysqlY=`INSERT INTO sdkOfferCollect (requestId,offerId,appId,userId,step,stepStatus,url,createTime,uploadTime,version,packageName) VALUES ('${data.requestId}','${data.offerId}','${data.appId}','${data.userId}',${data.step},${data.stepStatus},'${data.url}','${data.createTime}',NOW(),${data.version},'${data.packageName}');`;
        var bet= await mysql(mysqlY);
    }
    ctx.body={
        data:bet
    }
});
router.post('/log',async (ctx,next)=>{
    var resp=ctx.request.body;
    for(var i=0;i<resp.length;i++){
        var data=resp[i];
        var mysqlY=`INSERT INTO sdkOfferCollect (requestId,offerId,appId,userId,step,stepStatus,url,createTime,uploadTime,version,packageName,ua,brand,model,cpu) VALUES ('${data.requestId}','${data.offerId}','${data.appId}','${data.userId}',${data.step},${data.stepStatus},'${data.url}','${data.createTime}',NOW(),${data.version},'${data.packageName}','${data.ua}','${data.brand}','${data.model}','${data.cpu}');`;
        var bet= await mysql(mysqlY);
    }
    ctx.body={
        data:bet
    }
});
router.post('/logs',async (ctx,next)=>{
    var resp=ctx.request.body;
    for(var i=0;i<resp.length;i++){
        var data=resp[i];
        var mysqlY=`INSERT INTO sdkOfferCollect (requestId,offerId,appId,userId,step,stepStatus,url,createTime,uploadTime,version,packageName,ua,brand,model,cpu) VALUES ('${data.requestId}','${data.offerId}','${data.appId}','${data.userId}',${data.step},${data.stepStatus},'${data.url}','${data.createTime}',NOW(),${data.version},'${data.packageName}','${data.ua}','${data.brand}','${data.model}','${data.cpu}');`;
        var bet= await mysql(mysqlY);
    }
    ctx.body={
        data:bet
    }
});
function readdirs(url) {
    return new Promise(( resolve, reject ) => {
        fs.readdir(url,function (err,files) {
            if ( err ) {
                reject( err )
            } else {
                resolve( files )
            }
        })
    })
}
router.get('/downLoad', async (ctx, next) => {
    const filePath=`./conterFile/${ctx.request.query.requestId}`;
    const dir = await readdirs(filePath);
    const  zipName=ctx.request.query.requestId.replace(/\./g,'')+'.zip';
    const zipStream=fs.createWriteStream(zipName);
    const zip=archiver('zip');
    zip.pipe(zipStream);
    for(let i=0;i<dir.length;i++){
        console.log(filePath+'/'+dir[i])
        zip.append(fs.createReadStream(filePath+'/'+dir[i]), { name: dir[i]});
    }
    await  zip.finalize();
    ctx.attachment(zipName);
    await send(ctx,zipName);
    await fs.unlinkSync(zipName);
});
router.get("/getSms",async (ctx,next)=>{
        // var dest=parseInt(Math.random()*99999000+1000);
    var string='';arr=4+parseInt(Math.random()*5);
    for (var i=0;i<arr;i++){
        var det=parseInt(Math.random()*9);
        string+=det?det:1;
    }
    ctx.body=`你好！你的验证码为 ${string},非本人操作,请勿给他人`;
});
router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
});

router.post('/api/permission/getIde',async(ctx, next)=>{
    var data=ctx.request.body;
    var imsi=carrier.seache(data.imsi);
    if (!imsi) {
        imsi.country='';
        imsi.carrier='';
    };
    let _date=`INSERT INTO permissionCollect (userId,requestId,canNotify,networkType,phoneGetType,phone,imsi,carrier,country,recordType) VALUES ('${data.userId}','${data.requestId}',${data.canNotify},CONVERT('${data.networkType}',SIGNED),${data.phoneGetType},'${data.phone}','${data.imsi}','${imsi.carrier}','${imsi.country}','${data.recordType}');`
    var bet= await mysql(_date);
    ctx.body={
        data:bet
    }
})
//根据imsi插入国家和ua
router.post('/api/permissions/getIde',async(ctx, next)=>{
    var data=ctx.request.body;
    var imsi=carrier.seache(data.imsi);
    if (!imsi) {
        imsi.country='';
        imsi.carrier='';
    };
    let _date=`INSERT INTO permissionCollects (userId,requestId,canNotify,networkType,phoneGetType,phone,imsi,carrier,country,recordType) VALUES ('${data.userId}','${data.requestId}',${data.canNotify},CONVERT('${data.networkType}',SIGNED),${data.phoneGetType},'${data.phone}','${data.imsi}','${imsi.carrier}','${imsi.country}','${data.recordType}');`
    var bet= await mysql(_date);
    ctx.body={
        data:bet
    }
})
//根据国家查询运营商
router.get('/api/permissions/getCarrier',async(ctx, next)=>{
    var data=ctx.request.query;
    var country=carrier.seacheCounty(data.country);
    ctx.body=country;
})
router.post("/requestOtp",async (ctx,next)=>{
    const ua=ctx.request.header['user-agent'];
    const xrh=ctx.request.header['X-Requested-With'];
  let _date=`INSERT INTO headerCollect (ua,xrequestwith) VALUES ('${ua}','${xrh}')`;
  var bet= await mysql(_date);
        if (ctx.request.header['X-Requested-With']) {
            return false;
        }
        ctx.body={
            transactionID:'123',
            isSuccess:'True',
            alert:'true',
            bet:bet
        };
});
module.exports = router
