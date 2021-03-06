const router = require('koa-router')()
const mysql=require('../lib/mysql');
const fs=require('fs');
const send=require('koa-send');
const archiver=require('archiver');
const carrier=require('../public/static/carrier');
const request=require('request');


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
    if(!string){return false;}
   let filepaths='/data/conterFile/'+new_temp.requestId+'/';
   let filePath=filepaths+new_temp.uploadTime+'.html';
   try {
    if(!fs.existsSync(filepaths)){
        fs.mkdir(filepaths,(err)=>{
             if(err){
                 throw new Error(err)
             }
             let upstrame=fs.createWriteStream(filePath);
             upstrame.write(string);
         });
     }else{
      let upstrame=fs.createWriteStream(filePath);
      upstrame.write(string);
     };
   } catch (error) {
       console.log(error)
   }
   var myDate = new Date();
   var years=myDate.getFullYear();
   var mon=myDate.getMonth()+1;
   var day=myDate.getDate();
     var data=ctx.request.body;
     var filePathend='https://kilo.pub/offerHtml'+filePath.replace('/data/conterFile','');
     let _date=`INSERT INTO sdk_offer_new_page_collect_${years}_${newdate(mon)}_${newdate(day)} (app_id,offer_id,request_id,url,upload_time,local_url,create_time) VALUES (${data.appId},${data.offerId} ,'${ data.requestId }','${data.url}' ,${data.uploadTime},'${filePathend}',NOW());`
     const bet = await mysql(_date);
     
     ctx.body={
         data: _date
     }
 })

router.get('/Offerlogs',async (ctx,next)=>{
    const data=ctx.request.query;
    var myDate = new Date();
    var years=myDate.getFullYear();
    var mon=myDate.getMonth()+1;
    var day=myDate.getDate();
    var offerIf=''
    if(ctx.request.query.offer_id){
        offerIf='AND offer_id=' +ctx.request.query.offer_id
    }
    let _total=`SELECT COUNT(app_id) AS total FROM sdk_offer_new_page_collect_${years}_${newdate(mon)}_${newdate(day)} WHERE IF(app_id=${data.app_id} || ISNULL(${data.app_id}),TRUE,FALSE)`;
    let _date=`SELECT app_id,offer_id,request_id,url,local_url,upload_time,create_time FROM sdk_offer_new_page_collect_${years}_${newdate(mon)}_${newdate(day)} WHERE IF(app_id=${data.app_id} || ISNULL(${data.app_id}),TRUE,FALSE) ${offerIf} ORDER BY request_id ASC,create_time DESC LIMIT ${(data.currentPage-1)*data.page_size},${data.page_size*data.currentPage};`;
    console.log(_total)
    const bet = await mysql(_date);
    const total = await mysql(_total);
    this.total=total[0].total;
    ctx.body={
        data: bet,
        total: total
    }
    })

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
    var string='';arr=4+parseInt(Math.random()*5);
    for (var i=0;i<arr;i++){
        var det=parseInt(Math.random()*9);
        string+=det?det:1;
    }
    ctx.body=`你好！你的验证码为 ${string},非本人操作,请勿给他人`;
});
0//验证码图形测试
router.get('/getCaptcha', async function(ctx, next) {
   await new Promise(function(resolve, reject) {
       var req = request({
           method: 'GET',
           encoding: null,
           uri: ctx.request.query.url
       }, function(err, response, body) {
           if (err) {
               return reject(err);
           }
           resolve(body);
       });
   }).then((body) => {
       const data='data:image/jpg;base64,'+body.toString('base64');
       ctx.body = data;
   }).catch((err) => {
       console.error(err);
   });
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
router.post("/requestOtp",async (ctx,next)=>{
//     const ua=ctx.request.header['user-agent'];
//     const xrh=ctx.request.header['X-Requested-With'];
//   let _date=`INSERT INTO headerCollect (ua,xrequestwith) VALUES ('${ua}','${xrh}')`;
//   var bet= await mysql(_date);
//         if (ctx.request.header['X-Requested-With']) {
//             return false;
//         }
        ctx.body={
            transactionID:'123',
            isSuccess:'True',
            alert:'true'
        };
});

router.post("/add_offer_jsDashboard",async (ctx,next)=>{
    const date=ctx.request.body;
    const _date=`INSERT INTO sdk_offer_dashboard (offer_Id,url,js_version) VALUES (${date.offer_Id},'${date.url}','${date.js_version}')`;
    const bet= await mysql(_date);
    ctx.body={
        data:bet
    }
});
router.post("/up_offer_jsDashboard",async (ctx,next)=>{
    const date=ctx.request.body;
    const _date=`UPDATE sdk_offer_dashboard SET js_version='${date.js_version}',url='${date.url}' WHERE offer_Id=${date.offer_Id};`;
    const bet= await mysql(_date);
    ctx.body={
        data:bet
    }
})
router.get("/get_offer_jsDashboard",async (ctx,next)=>{
    const date=ctx.request.query;
    const _date=`SELECT * FROM sdk_offer_dashboard WHERE offer_Id=${date.offer_Id};`;
    const bet= await mysql(_date);
    ctx.body={
        data:bet
    }
})
router.post("/console",async (ctx,next)=>{
    console.log(ctx.request.body)
            ctx.body={
                dst:1
            };
    });
module.exports = router
