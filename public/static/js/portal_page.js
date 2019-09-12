!
    function(require, staticurl, pfileurl) {
        var init = function() {
            require.config({
                baseUrl: staticurl,
                urlArgs: "t=" + (new Date).getTime().toString().substring(0, 6),
                paths: {
                    componentsPath: pfileurl + "/files",
                    zepto: "res/skin/js/require.zepto.min",
                    swipe: "res/skin/js/swipe",
                    "lib/mustache": "res/skin/js/lib/mustache.min",
                    "utils/site": "res/pageui/js/kzEditor/utils/site",
                    wxsdk: "//res.wx.qq.com/open/js/jweixin-1.0.0",
                    kzsdk: "res/mobile/js/lib/kzjssdk"
                }
            });
            var portal_all = pfileurl + "/files/portal_basic.js";
            var main = function() {
                $("[data-component]").each(function() {
                    var that = this;
                    var _meta = $(this).data("component");
                    if (!_meta.ename) {
                        if (_meta.name == "traffic_exchange") {
                            _meta.ename = "traffic_exchange/" + _meta.name
                        } else if (_meta.name == "form") {
                            _meta.ename = "form/" + _meta.name
                        } else {
                            _meta.ename = "system_plugin/" + _meta.name
                        }
                    }
                    var split = _meta.ename.split("/");
                    var plugin_code = split[0];
                    var comp_name = split[1];
                    var version = "latest_version";
                    if (_meta.is_testing == "true") {
                        version = "test_version"
                    }
                    var comp = "componentsPath/" + plugin_code + "/" + version + "/components/" + comp_name + "/portal";
                    if (_meta.is_testing == "true") {
                        comp = pfileurl + "/files/" + plugin_code + "/" + version + "/components/" + comp_name + "/portal.js?v=" + (new Date).getTime().toString().substring(0, 8)
                    }
                    require([comp], function(portal) {
                        "use strict";
                        if (portal) {
                            portal.onAfterRender && portal.onAfterRender(that, window, document)
                        }
                    })
                });
                $("input, textarea").focus(function() {
                    $("[data-role='kz-page-bottom-float-layer']").css({
                        position: "absolute",
                        top: parseInt(document.body.clientHeight) + "px"
                    })
                }).blur(function() {
                    $("[data-role='kz-page-bottom-float-layer']").css({
                        position: "fixed",
                        top: "auto"
                    })
                })
            };
            require(["res/post/js/mobile-wx-share", portal_all], function(wx_share) {
                main();
                var is_weixin = /micromessenger/gi.test(window.navigator.userAgent),
                    s = SOHUZ.share,
                    page_type = SOHUZ.page.page_type,
                    scene_type_map = {
                        0: 5,
                        4: 4
                    };
                if (scene_type_map[page_type]) {
                    s.url = window.location.href;
                    s.scene_type = scene_type_map[page_type];
                    if (window.pageData) {
                        var d = window.pageData;
                        s.pic = d.screen;
                        s.desc = d.desc;
                        s.title = d.title
                    }
                    if (is_weixin) {
                        wx_share.init(s)
                    }
                }
            }, function() {
                main()
            })
        };
        if (require) {
            init()
        } else {
            console.log("未知原因造成require未加载，重新加载");
            delete window.require;
            delete window.requirejs;
            delete window.define;
            $.getScript = function(url, success, error) {
                var script = document.createElement("script"),
                    $script = $(script);
                script.src = url;
                $("head").append(script);
                $script.bind("load", success);
                $script.bind("error", error)
            };
            $.getScript(staticurl + "/res/skin/js/lib/require.js?v=" + (new Date).getTime(), function() {
                init()
            })
        }
    }(require, SOHUZ.CONF.url_res, SOHUZ.CONF.url_pfile ? SOHUZ.CONF.url_pfile : "http://eshop.eccang.com");