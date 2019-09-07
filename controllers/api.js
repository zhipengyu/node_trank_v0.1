
const APIError = require('../rest').APIError;
const mysql=require('../lib/mysql');
const YAML=require('yamljs');
const fs=require('fs')
const date=YAML.parse(fs.readFileSync('./mysql.yaml').toString());
var c={};
function best() {
    // console.log(date)
    var reg=[/^GET/gi,/^DELETE/gi,/^POST/gi,/^PUT/gi]
    for(let key in date) {
        c[key] = async (ctx, next) => {
            let _sql = date[key];
            var data = ctx.request.body;
            if(ctx.params&&data!='undefined'){
                data=ctx.params;
            }
            const _date = stringEs6(_sql, data)
            console.log(_date)
            const bet = await mysql(_date);
            ctx.rest({
                data: bet
            });
            next();
        }
}}

function getUrl(url){
    var reg=/\:\w+/g;
    return reg.test(url)
}

function stringEs6(string,data){
    const reg=/\$\{(\S+?)\}/gm;
    let newString='';
    newString=string.replace(reg,function ($,$1) {
        try {
            // console.log($1)
            return `\'${eval($1)}\'`;
        }catch (e) {
        }

    })
    return newString;
}
best();
// const nsat={
//     'PUT /api/fala':async (ctx,next)=>{
//         // console.log(ctx.request.body);
//         let _sql=date
//         const _date = stringEs6(_sql, data);
//     }
// }
// console.log(best())

module.exports = c;

