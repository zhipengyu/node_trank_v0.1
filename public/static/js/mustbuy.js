(function($){
    "use strict";

    ['width','height'].forEach(function(dimension){

        var Dimension = dimension.replace(/./,function(m){
            return m[0].toUpperCase();
        });

        //outerWidth or outerHeight

        $.fn['outer' + Dimension] = function(margin) {
            var elem = this;

            if(elem) {


                // elem.width(); or  elem.height();
                var size = elem[dimension]();

                var sides = {
                    'width' : ['left', 'right'],
                    'height' : ['top', 'bottom']
                };

                sides[dimension].forEach(function(side){
                    if(margin) {
                        size += parseInt(elem.css('margin-'+side),10);
                    }
                });

                return size;
            } else {
                return null;
            }
        }


    });
})($);

$.fn.scrollTo =function(options){
    var defaults = {
        toT : 0,    //滚动目标位置
        durTime : 500,  //过渡动画时间
        delay : 30,     //定时器时间
        callback:null   //回调函数
    };
    var opts = $.extend(defaults,options),
        timer = null,
        _this = this,
        curTop = _this.scrollTop(),//滚动条当前的位置
        subTop = opts.toT - curTop,    //滚动条目标位置和当前位置的差值
        index = 0,
        dur = Math.round(opts.durTime / opts.delay),
        smoothScroll = function(t){
            index++;
            var per = Math.round(subTop/dur);
            if(index >= dur){
                _this.scrollTop(t);
                window.clearInterval(timer);
                if(opts.callback && typeof opts.callback == 'function'){
                    opts.callback();
                }
                return;
            }else{
                _this.scrollTop(curTop + index*per);
            }
        };
    timer = window.setInterval(function(){
        smoothScroll(opts.toT);
    }, opts.delay);
    return _this;
};

$(function() {

    if($('#tab').length > 0){

    var e = $("#tab").find("li"),
        t = $("#tab").offset().top,
        a = $(".float-tab-target"),
        r = $("#tab li a"),
        n = 0;

        $(window).scroll(function() {
            //> t ? $("#tab").addClass("main-tab-fixed") : $("#tab").removeClass("main-tab-fixed")

            var comment = $("#productComment").offset().top;
            var desc = $("#productDesc").offset().top;

            if((comment - $(window).scrollTop() < 150 )){

                $('.main-tab li a').removeClass('active');
                $('.main-tab li:nth-child(3) a').addClass('active');

            }else if((comment - $(window).scrollTop() < 350 )){

                $('.main-tab li a').removeClass('active');
                $('.main-tab li:nth-child(2) a').addClass('active');

            }else if($(window).scrollTop() >= comment)
            {
                $('.main-tab li a').removeClass('active');
                $('.main-tab li:nth-child(1) a').addClass('active');
            }
        });
    }

    $('#tab li a').on('click', function(){
        var e = $(this).parent().index(),
            t = 0;
        $(this).parents("#tab").hasClass("main-tab-fixed") ? (t = Math.ceil(a.eq(e).offset().top) - $("#tab").outerHeight(), 0 == e && (t += $("#tab").outerHeight())) : (t = Math.ceil(a.eq(e).offset().top) - 2 * $("#tab").outerHeight(), 0 == e && (t += $("#tab").outerHeight())),
        $('#tab li a').removeClass('active');
        $(this).addClass('active');
        $("html,body").scrollTo({ toT: t},800);
    });

    var doscroll = function(){
        var $parent = $('#pingjia #allpj');
        var $first = $parent.find('li:first');
        var height = $first.height();
        $first.animate({
            height: 0   //或者改成： marginTop: -height + 'px'
        }, 500, function() {// 动画结束后，把它插到最后，形成无缝
            $first.css('height', height).appendTo($parent);
            // $first.css('marginTop', 0).appendTo($parent);
        });
    };
    setInterval(function(){doscroll()}, 2000);

});
