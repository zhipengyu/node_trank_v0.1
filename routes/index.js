const router = require('koa-router')()
const mysql=require('../lib/mysql');
const fs=require('fs');
const send=require('koa-send');
const archiver=require('archiver');
const carrier=require('../public/static/carrier');


function newdate(num){
    if(num<10){
        return '0'+num;
    }else{
        return ''+num
    }
}

 router.post('/sdk-logs/sdk-offer-page-collect/upload',async (ctx,next)=>{
    const new_temp=ctx.request.body;
    const string=new_temp.content;
   let filepaths='/data/conterFile/'+new_temp.requestId+'/';
   let filePath=filepaths+new_temp.uploadTime+'.html';
   if(!fs.existsSync(filepaths)){
       fs.mkdir(filepaths,(err)=>{
           if(err){
               throw new Error(err)
           }
       });
   };
   let upstrame=fs.createWriteStream(filePath);
   upstrame.write(string);
   var myDate = new Date();
   var years=myDate.getFullYear();
   var mon=myDate.getMonth()+1;
   var day=myDate.getDate();
     var data=ctx.request.body;
     console.log(_date)
     var filePathend='https://kilo.pub/offerHtml'+filePath.replace('/data/conterFile','');
     let _date=`INSERT INTO sdk_offer_new_page_collect_${years}_${newdate(mon)}_${newdate(day)} (app_id,offer_id,request_id,url,upload_time,local_url,create_time) VALUES (${data.appId},${data.offerId} ,'${ data.requestId }','${data.url}' ,${data.uploadTime},'${filePathend}',NOW());`
     const bet = await mysql(_date);
     
     ctx.body={
         data: _date
     }
 })
// router.post('/writer',async (ctx,next)=>{
//     const string=ctx.request.body.file;
//     let filepaths='/data/conterFile/'+ctx.request.body.requestId+'/';
//     let filePath=filepaths+ new Date().getTime()+'.html';
//     if(!fs.existsSync(filepaths)){
//         fs.mkdir(filepaths,(err)=>{
//             if(err){
//                 throw new Error(err)
//             }
//         });
//     };
//     var data=ctx.request.body;
//     var filePathend='https://kilo.pub/offerHtml'+filePath.replace('conterFile','');
//     let _date=`INSERT INTO visiter (url,offerId,pv,cookieCount,filePath,appId,requestId) VALUES ('${data.url}' ,'${ data.offerId }','${data.pv}' ,'${data.cookieCount}','${filePathend}','${data.appId}','${data.requestId}');`
//     const bet = await mysql(_date);
//     let upstrame=fs.createWriteStream(filePath);
//     upstrame.write(string);
//     ctx.body={
//         data:bet
//     }
// })

router.post('/user/login',async (ctx,next)=>{
  var date=ctx.request.body;
    ctx.body={status:3,msg:'登入成功'}
})

// router.post('/loger',async (ctx,next)=>{
//     var resp=ctx.request.body;
//     for(var i=0;i<resp.length;i++){
//         var data=resp[i];
//         var mysqlY=`INSERT INTO sdkOfferCollect (requestId,offerId,appId,userId,step,stepStatus,url,createTime,uploadTime,version,packageName) VALUES ('${data.requestId}','${data.offerId}','${data.appId}','${data.userId}',${data.step},${data.stepStatus},'${data.url}','${data.createTime}',NOW(),${data.version},'${data.packageName}');`;
//         var bet= await mysql(mysqlY);
//     }
//     ctx.body={
//         data:bet
//     }
// });
// router.post('/log',async (ctx,next)=>{
//     var resp=ctx.request.body;
//     for(var i=0;i<resp.length;i++){
//         var data=resp[i];
//         var mysqlY=`INSERT INTO sdkOfferCollect (requestId,offerId,appId,userId,step,stepStatus,url,createTime,uploadTime,version,packageName,ua,brand,model,cpu) VALUES ('${data.requestId}','${data.offerId}','${data.appId}','${data.userId}',${data.step},${data.stepStatus},'${data.url}','${data.createTime}',NOW(),${data.version},'${data.packageName}','${data.ua}','${data.brand}','${data.model}','${data.cpu}');`;
//         var bet= await mysql(mysqlY);
//     }
//     ctx.body={
//         data:bet
//     }
// });
// router.post('/logs',async (ctx,next)=>{
//     var resp=ctx.request.body;
//     for(var i=0;i<resp.length;i++){
//         var data=resp[i];
//         var mysqlY=`INSERT INTO sdkOfferCollect (requestId,offerId,appId,userId,step,stepStatus,url,createTime,uploadTime,version,packageName,ua,brand,model,cpu) VALUES ('${data.requestId}','${data.offerId}','${data.appId}','${data.userId}',${data.step},${data.stepStatus},'${data.url}','${data.createTime}',NOW(),${data.version},'${data.packageName}','${data.ua}','${data.brand}','${data.model}','${data.cpu}');`;
//         var bet= await mysql(mysqlY);
//     }
//     ctx.body={
//         data:bet
//     }
// });
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
// router.get('/json', async (ctx, next) => {
//   ctx.body = {
//     title: 'koa2 json'
//   }
// });

// router.post('/api/permission/getIde',async(ctx, next)=>{
//     var data=ctx.request.body;
//     var imsi=carrier.seache(data.imsi);
//     if (!imsi) {
//         imsi.country='';
//         imsi.carrier='';
//     };
//     let _date=`INSERT INTO permissionCollect (userId,requestId,canNotify,networkType,phoneGetType,phone,imsi,carrier,country,recordType) VALUES ('${data.userId}','${data.requestId}',${data.canNotify},CONVERT('${data.networkType}',SIGNED),${data.phoneGetType},'${data.phone}','${data.imsi}','${imsi.carrier}','${imsi.country}','${data.recordType}');`
//     var bet= await mysql(_date);
//     ctx.body={
//         data:bet
//     }
// })
//根据imsi插入国家和ua
// router.post('/api/permissions/getIde',async(ctx, next)=>{
//     var data=ctx.request.body;
//     var imsi=carrier.seache(data.imsi);
//     if (!imsi) {
//         imsi.country='';
//         imsi.carrier='';
//     };
//     let _date=`INSERT INTO permissionCollects (userId,requestId,canNotify,networkType,phoneGetType,phone,imsi,carrier,country,recordType) VALUES ('${data.userId}','${data.requestId}',${data.canNotify},CONVERT('${data.networkType}',SIGNED),${data.phoneGetType},'${data.phone}','${data.imsi}','${imsi.carrier}','${imsi.country}','${data.recordType}');`
//     var bet= await mysql(_date);
//     ctx.body={
//         data:bet
//     }
// })
//根据国家查询运营商
// router.get('/api/permissions/getCarrier',async(ctx, next)=>{
//     var data=ctx.request.query;
//     var country=carrier.seacheCounty(data.country);
//     ctx.body=country;
// })
// router.post("/requestOtp",async (ctx,next)=>{
//     const ua=ctx.request.header['user-agent'];
//     const xrh=ctx.request.header['X-Requested-With'];
//   let _date=`INSERT INTO headerCollect (ua,xrequestwith) VALUES ('${ua}','${xrh}')`;
//   var bet= await mysql(_date);
//         if (ctx.request.header['X-Requested-With']) {
//             return false;
//         }
//         ctx.body={
//             transactionID:'123',
//             isSuccess:'True',
//             alert:'true',
//             bet:bet
//         };
// });
module.exports = router
