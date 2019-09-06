// const products = require('../model/products');

const APIError = require('../rest').APIError;
const mysql=require('../lib/mysql');
const YAML=require('yamljs');
const fs=require('fs')
const date=YAML.parse(fs.readFileSync('./mysql.yaml').toString());

function best() {
    var c={},reg=[/^GET/gi,/^DELETE/gi,/^POST/gi,/^PUT/gi]
    for(let key in date){
        if(reg[0].test(key)){
            c[key] = async (ctx, next) => {
                let _sql = date[key];
                const data = ctx.request.body;
                const _date = stringEs6(_sql, data)
                const bet = await mysql(_date);
                ctx.rest({
                    data: bet
                });
            }
        }
        if(reg[1].test(key)){
            c[key] = async (ctx, next) => {
            let _sql = date[key];
            const data =ctx.params;
            const _date = stringEs6(_sql, data)
            console.log(data,_date)
            const bet = await mysql(_date);
            if (bet) {
                ctx.rest(p);
            } else {
                throw new APIError('400', 'product not found by id.');
            }
        }
        }
        if(reg[2].test(key)){
            c[key] = async (ctx, next) => {
                let _sql = date[key];
                const data = ctx.params||ctx.request.body;
                const _date = stringEs6(_sql, data)
                const bet = await mysql(_date);
                ctx.rest({
                    data: bet
                });
            }
        }
        if(reg[3].test(key)){
            c[key] = async (ctx, next) => {
                let _sql = date[key];
                const data = ctx.request.body;
                // console.log(data)
                const _date = stringEs6(_sql, data);
                console.log(_date)
                const bet = await mysql(_date);
                ctx.rest({
                    data:bet
                })
            }
        }
    }

    return c
}

function getUrl(url){
    var reg=/\:\w+/g;
    return reg.test(url)
}

function stringEs6(string,data){
    const reg=/\$\{(\S+?)\}/gm;
    let newString='';
    newString=string.replace(reg,function ($,$1) {
        try {
            console.log($1)
            return `\'${eval($1)}\'`;
        }catch (e) {
        }

    })
    return newString;
}

const nsat={
    'PUT /api/fala':async (ctx,next)=>{
        console.log(ctx.request.body);
        let _sql=date
        const _date = stringEs6(_sql, data);
    }
}

module.exports = best()

