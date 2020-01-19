
const APIError = require('../rest').APIError;
const mysql=require('../lib/mysql');
const YAML=require('yamljs');
const fs=require('fs')
 var date=YAML.load('./mysql.yaml');
var c={};

function best() {
    var reg=[/^GET/gi,/^DELETE/gi,/^POST/gi,/^PUT/gi]
    for(let key in date) {
        c[key] = async (ctx, next) => {
            let _sql = date[key];
            var data = ctx.request.body;
           if(key.search(reg[0])>=0) {
               data = ctx.query;
           }
            if(!data&&ctx.params.offerId){
                data=ctx.params;
            };
            const _date = stringEs6(_sql, data);
            const bet = await mysql(_date);
            ctx.rest({
                data: bet
            });
        }
}}

function getUrl(url){
    var reg=/\:\w+/g;
    return reg.test(url)
}

function stringEs6(string,data){
    const reg=/\$\{([\S\s]+?)\}/gm;
    const reg1=/\@\{([\S\s]+?)\}/gm;
    let newString='';
    newString=string.replace(reg,function ($,$1) {
        try {
            return `\'${eval($1)}\'`;
        }catch (e) {
        }
    })
    newString=newString.replace(reg1,function ($,$1) {
        try {
            return `${eval($1)}`;
        }catch (e) {
        }
    })
    return newString;
}
best();
module.exports = c;

