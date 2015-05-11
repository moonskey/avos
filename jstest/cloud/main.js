require("cloud/app.js");
var cheerio = require('cheerio');
var https = require('https');
var DetailInfo = AV.Object.extend("DetailInfo");

/**
 *breadtrip,done,with all running, image done, images partiallydone
 * @type {{starturl: string, eachitem: string, title: string, startdate: string, duration: string, author: string, pre_url: string, needpre: string, authorindetail: string, detailitem: string, date: string, detaildescription: string}}
 */
var rules_breadtrip = {
    //for test
    "starturl": "http://breadtrip.com/explore/",
    "testurl": "http://breadtrip.com/trips/2388187734/",
    //save
    "source": "breadtrip",
    //in list
    "eachitem": ".item.pr.fl",
    "pre_url": "http://breadtrip.com",
    "needpre": "1",
    //"title":".ellipsis_text",
    "title": "$(e).find('.ellipsis_text').text()",
    //"author":"",
    "author": "",
    //"startdate":".trip-startdate",
    "startdate": "$(e).find('.trip-startdate').text()",
    //"duration":".trip-duration",
    "duration": "$(e).find('.trip-duration').text()",
    //"brief":".ellipsis_text",
    "brief": "$(e).find('.ellipsis_text').text()",
    //"description":".ellipsis_text",
    "description": "$(e).find('.ellipsis_text').text()",
    "image":"$(e).find('img').attr('src')",
    //in detail
    "authorindetail": ".trip-user",
    "detailitem": ".trip-days",
    //"date":"span",
    "date": "$(e).find('span').first().text()",
    //"detaildescription":".text.photo-comment"
    "detaildescription": "$(e).find('.text.photo-comment').text()",
    "images":"$(e).find('.photo-ctn').find('a').attr('href')"
};

/**
 *qunar,done,with all running image done
 * @type {{starturl: string, eachitem: string, title: string, startdate: string, duration: string, description: string, author: string, pre_url: string, needpre: string, authorindetail: string, detailitem: string, date: string, detaildescription: string}}
 */
var rules_qunar = {
    "starturl": "http://travel.qunar.com/travelbook/list.htm?order=hot_heat",
    "testurl": "http://travel.qunar.com/youji/5305677",

    //save tag
    "source": "qunar",
    //in list
    "eachitem": ".list_item",
    "pre_url": "http://travel.qunar.com",
    "needpre": "1",
    //"title":".tit",
    "title": "$(e).find('.tit').text()",
    //"author":"",
    "author": "$(e).find('.user_name').text()",
    //"startdate":".date",
    "startdate": "$(e).find('.date').text().split(' ')[0]",
    //"duration":".days",
    "duration": "$(e).find('.days').text()",
    //"brief":""
    "brief": "$(e).find('.places').text()",
    //"description":".places",
    "description": "$(e).find('.places').text()",
    "image":"$(e).find('.pics').find('img').attr('src')",

    //in detail
    "authorindetail": ".trip-user",
    "detailitem": ".e_day",
    //".date":".time",
    "date": "$(e).find('.time').text()",
    //"detaildescription":".text"
    "detaildescription": "$(e).find('.text').text()",
    "images":"$(e).find('.imglst').find('img').attr('data-original')"
};

/**
 *daodao,done,with all running image fault???
 * @type {{starturl: string, testurl: string, class: string, eachitem: string, pre_url: string, needpre: string, title: string, startdate: string, duration: string, brief: string, description: string, author: string, authorindetail: string, detailitem: string, date: string, detaildescription: string}}
 */
var rules_daodao = {
    "starturl": "http://www.tripadvisor.cn/TourismBlog-g294217-Hong_Kong.html",
    "testurl": "http://www.tripadvisor.cn/TourismBlog-t1505.html",
    //save
    "source": "daodao",
    //in list
    "eachitem": ".stb-list li",
    "pre_url": "http://www.tripadvisor.cn",
    "needpre": "1",
    //"title":".title",
    "title": "$(e).find('.title').text()",
    //"startdate":".date",
    "startdate": "$(e).find('.info').text()",
    "startdaterg": "1",
    //"duration":".days",
    "duration": "",
    //"brief":".geo",
    "brief": "$(e).find('geo').text()",
    //"description":".places",
    "description": "$(e).find('.route').text()",
    "author": "$(e).find('.info').text().split('作者')[1] ",
    "image": "$(e).find('a').find('img').attr('src')",
    //in detail
    "authorindetail": ".trip-user",
    "detailitem": ".strategy-content",
    //".date":".time",
    "date": "$(e).find('.time').text()",
    //"detaildescription":".text"
    "detaildescription": "$(e).text()",
    "images": "$(e).find('img').attr('src')"
};

/**
 * ctrip,done ,with all running image fault
 * .journal-item? .li item will change?
 * @type {{starturl: string, testurl: string, class: string, eachitem: string, pre_url: string, needpre: string, title: string, startdate: string, duration: string, brief: string, description: string, author: string, authorindetail: string, detailitem: string, date: string, detaildescription: string}}
 */
var rules_ctrip = {
    "starturl": "http://you.ctrip.com/travels/",
    "testurl": "http://you.ctrip.com/travels/wuhan145/2280770.html",
    //save
    "source": "ctrip",
    //in list
    "eachitem": ".journal-item",
    "pre_url": "http://you.ctrip.com",
    "needpre": "2",
    //"title":"h3",
    "title": "$(e).find('.ellipsis').text()",
    //"author":"",.split('发')[0]
    "author": "$(e).find('.item-user').text().split('发')[0]",
    //"startdate":".date",.split(';')[1]
    "startdate": "$(e).find('.item-user').text()",
    //"duration":".days",
    "duration": "$(e).find('.tips_a').text().split('，')[0]",
    //"brief":".geo",
    "brief": "$(e).find('.item-short').text()",
    //"description":".places",
    "description": "$(e).find('.item-short').text()",
    "image":"$(e).find('img').attr('src')",

    //in detail
    "authorindetail": "$('.ctd_head_right a[id=authorDisplayName]').text()",
    "detailitem": ".ctd_content",
    //".date":".time",
    "date": "$(e).find('.time').text()",
    //"detaildescription":".text"
    "detaildescription": "$(e).find('p').text()",
    "images":"$(e).find('img').attr('data-original')"
};

/**
 *qyer,done  image done
 * description not ideal
 * @type {{starturl: string, testurl: string, class: string, eachitem: string, pre_url: string, needpre: string, title: string, startdate: string, duration: string, brief: string, description: string, author: string, authorindetail: string, detailitem: string, date: string, detaildescription: string}}
 */
var rules_qyer = {
    "starturl": "http://plan.qyer.com/search_0_0_186_0_0_0_1/",
    "testurl": "http://plan.qyer.com/trip/V2UJYVFgBzdTbFI2Cm8/",
    //save
    "source": "qyer",
    //in list
    "eachitem": ".list .items",
    "pre_url": "http://www.qyer.com",
    "needpre": "0",
    //"title":".title",
    "title": "$(e).find('.fontYaHei').find('dd').text()",
    //"startdate":".date",
    "startdate": "$(e).find('.fontYaHei').find('dt').text().split(' ')[0]",
    //"duration":".days",
    "duration": "$(e).find('.day').text()",
    //"brief":".geo",
    "brief": "$(e).find('.content').find('.plan').text()",
    //"description":".places",
    "description": "$(e).find('.content').find('.plan').text()",
    "author": "$(e).find('.name').text()",
    "image":"$(e).find('img').attr('src')",
    //in detail
    "authorindetail": ".trip-user",
    "detailitem": ".day_item",
    //".date":".time",
    "date": "$(e).find('.day_time').text()",
    //"detaildescription":".text"
    "detaildescription": "$(e).find('.note_row').find('p').text()",
    "images":"$(e).find('img').attr('src')"
};

/**
 * chanyou done,with all running image done, images not done
 * parse detail
 * @type {{starturl: string, testurl: string, class: string, eachitem: string, pre_url: string, needpre: string, title: string, startdate: string, duration: string, brief: string, description: string, author: string, authorindetail: string, detailitem: string, date: string, detaildescription: string}}
 */
var rules_chanyou = {
    "starturl": "http://chanyouji.com/trips/",
    "testurl": "http://chanyouji.com/trips/207033",
    //regax
    "regax": "1",
    //save
    "source": "chanyouji",
    //in list
    "eachitem": ".trip-g",
    "pre_url": "http://chanyouji.com",
    "needpre": "1",
    //"title":".title",
    "title": "$(e).find('header').find('h1').text()",
    //"startdate":".date",
    "startdate": "$(e).find('.trip-date').text().split('|')[0]",
    //"duration":".days",
    "duration": "$(e).find('.trip-date').text().split('|')[1].split('天')[0]",
    //"brief":".geo",
    "brief": "$(e).find('header').find('h1').text()",
    //"description":".places",
    "description": "$(e).find('header').find('h1').text()",
    "author": "",
    "image":"$(e).find('img').attr('src')",

    //in detail
    "authorindetail": ".trip-user",
    "detailitem": ".trips-wraper",
    //".date":".time",
    "date": "$(e).find('.day-date').text().split(' ')[0]",
    //"detaildescription":".text"
    "detaildescription": "$(e).find('script')",
    "images":"$(e).find('img').attr('src')"
};

/**
 * 117go,done,with all running inmage fault???
 *
 * @type {{starturl: string, testurl: string, class: string, eachitem: string, pre_url: string, needpre: string, title: string, startdate: string, duration: string, brief: string, description: string, author: string, authorindetail: string, detailitem: string, date: string, detaildescription: string}}
 */
var rules_117go = {
    "starturl": "http://www.117go.com",
    "testurl": "http://www.117go.com/tour/53856965",
    "regax": "2",
    //save
    "source": "117go",
    //in list
    "eachitem": ".tours-item-wrapper-wrap",
    "pre_url": "http://www.117go.com",
    "needpre": "1",
    //"title":".title",
    "title": "$(e).find('.tours-item-title-content').text()",
    //"startdate":".date",
    "startdate": "$(e).find('.trip-date').text()",
    //"duration":".days",
    "duration": null,
    //"brief":".geo",
    "brief": "$(e).find('.tours-item-cities').text()",
    //"description":".places",
    "description": "$(e).find('.tours-item-cities').text()",
    "author": "",
    "image":"$(e).find('.tours-item-image').attr('src')",
    //
    "special_type": "2",
    //in detail
    "authorindetail": ".t-feeds",
    "detailitem": ".t-feeds",
    //".date":".time",
    "date": "$(e).find('.t-day-sp-date').text()",
    //"detaildescription":".text"
    "detaildescription": "$(e).find('.t-feed-words.paragraph').text()",
    "images":"$(e).find('img').attr('src')"
};

/**
 * done, with all running image done
 *tuniu
 * @type {{starturl: string, testurl: string, class: string, eachitem: string, pre_url: string, needpre: string, title: string, startdate: string, duration: string, brief: string, description: string, author: string, authorindetail: string, detailitem: string, date: string, detaildescription: string}}
 */
var rules_tuniu = {
    "starturl": "http://trips.tuniu.com/",
    "testurl": "http://www.tuniu.com/trips/10011491",
    //save
    "source": "tuniu",
    //in list
    "eachitem": ".hot-main-square",
    "pre_url": "http://trips.tuniu.com/",
    "needpre": "0",
    //"title":".title",
    "title": "$(e).find('.note-title').text()",
    //"startdate":".date",
    "startdate": "$(e).find('.reader-info').find('span').text()",
    //"duration":".days",
    "duration": "",
    //"brief":".geo",
    "brief": "$(e).find('.tours-item-cities').text()",
    //"description":".places",
    "description": "$(e).find('.tours-item-cities').text()",
    "author": "$(e).find('.author').text()",
    "image":"$(e).find('img').attr('src')",
    //in detail
    "authorindetail": ".t-feeds",
    "detailitem": ".blog-main",
    //".date":".time",
    "date": "$(e).find('.t-day-sp-date').text()",
    //"detaildescription":".text"
    "detaildescription": "$(e).text()",
    "images":"$(e).find('img').attr('src')"
};

/**
 * done, with all running
 *lvmama
 * @type {{starturl: string, testurl: string, class: string, eachitem: string, pre_url: string, needpre: string, title: string, startdate: string, duration: string, brief: string, description: string, author: string, authorindetail: string, detailitem: string, date: string, detaildescription: string}}
 */
var rules_lvmama = {
    "starturl": "http://www.lvmama.com/trip/",
    "testurl": "http://www.lvmama.com/trip/show/50043",
    //save
    "source": "lvmama",
    //in list
    "eachitem": "dl",
    "pre_url": "http://www.lvmama.com",
    "needpre": "0",
    //"title":".title",
    "title": "$(e).find('.title').text()",
    //"startdate":".date",
    "startdate": "$(e).find('.uploadInfo').text().split('|')[1].split('发')[0]",
    //"duration":".days",
    "duration": "$(e).find('.uploadInfo').text().split('|')[2]",
    //"brief":".geo",
    "brief": "$(e).find('.tripTxt').text()",
    //"description":".places",
    "description": "$(e).find('.tripTxt').text()",
    "author": "$(e).find('.uploadInfo').text().split('|')[0]",
    "image":"$(e).find('img').attr('src')",

    //in detail
    "authorindetail": ".t-feeds",
    "detailitem": ".t_oneDay",
    //".date":".time",
    "date": "$(e).find('.t_dayTime').find('span').text()",
    //"detaildescription":".text"
    "detaildescription": "$(e).find('dd').text()",
    "images":"$(e).find('img').attr('src')"
};

/**
 * parselist
 * need rules,url
 */
AV.Cloud.define("parselist", function (request, response) {
    var rules = eval(request.params.rules);
    //var url = rules.starturl;
    var url = request.params.url;
    //console.log(rules);
    //console.log(url);
    var res = [];
    AV.Cloud.httpRequest({
        url: url,
        success: function (httpResponse) {
            var page = httpResponse.text;
            $ = cheerio.load(page);
            $(rules.eachitem).each(function (i, e) {
                //save outline info
                var ans = {};
                var pageurl = null;
                ans.type = "tour";
                ans.title = eval(rules.title);
                ans.startdate = eval(rules.startdate);
                var duration = eval(rules.duration);
                if (duration == null) {
                    ans.duration = null;
                }
                else {
                    var dt = duration.match(/\d+/);
                    if (dt == null)
                        ans.duration = null;
                    else
                        ans.duration = dt[0];
                }

                if (rules.needpre == 2) {
                    pageurl = rules.pre_url + $(e).parent().find(rules.eachitem).eq(i).attr('href');
                    var startdate = eval(rules.startdate).match(/\d\d\d\d-\d\d-\d\d/);
                    ans.startdate = startdate[0];
                }
                if (rules.needpre == 1)
                    pageurl = rules.pre_url + $(e).find('a').attr('href');
                if (rules.needpre == 0)
                    pageurl = $(e).find('a').attr('href');
                if (rules.startdaterg == 1) {
                    var startdate = eval(rules.startdate).match(/\d\d\d\d-\d\d-\d\d/);
                    if (startdate != null)
                        ans.startdate = startdate[0];
                    else
                        ans.startdate = null;
                }
                ans.url = pageurl;
                ans.description = eval(rules.description);
                ans.author = eval(rules.author);
                ans.brief = eval(rules.brief);
                ans.tours = "";
                ans.source = rules.source;
                ans.image = eval(rules.image);
                res.push(ans);
            });
        },
        error: function (httpResponse) {
            console.error(url + 'Request failed with response code ' + httpResponse.status);
        }
    }).then(function () {
        response.success(res);
    });
});
/**
 * parsedetailpage
 * with given params:
 * url
 * and parse rules such as:
 * rules.date = .time
 * rules.description = .content
 * and so on
 */
AV.Cloud.define("parsedetailpage", function (request, response) {
    var rules = eval(request.params.rules);
    //var rules = rules_qunar;
    var url = request.params.url;
    var res = [];
    AV.Cloud.httpRequest({
        url: url,
        success: function (httpResponse) {
            var page = httpResponse.text;
            $ = cheerio.load(page);
            // var str = /(?=parse)/;
            if (rules.regax == 1) {
                var tmp = page.replace(/[.\S\s]*TripsCollection\(/, "").replace(/\,\{parse.+/, "");
                if (tmp == null)
                    response.success(null);
                var arr = JSON.parse(tmp);
                var index = -1;
                var ans = {};
                for (var item in arr) {
                    if (arr[item].trip_date == null) {
                        res[index].description = res[index].description + arr[item].description + "\n\r";
                    } else {
                        index++;
                        ans.index = index;
                        ans.date = arr[item].trip_date;
                        ans.description = "";
                        res.push(ans);
                        ans = {};
                    }
                }
            }
            if (rules.regax == 2) {
                $(".t-day-spliter").each(function (i, e) {
                    var ans = {};
                    var idstr = "a[data-day=" + (i + 1) + "]";
                    ans.index = i;
                    ans.date = $(e).find(".t-day-sp-date").text();
                    var des = "";
                    $(e).parent().find(idstr).each(function (i, e) {
                        var idx = $(e).attr("data-feed");
                        var str = "[id=tFeed" + idx + "]";
                        var pt = $(e).parent().parent().find(str).find(".t-feed-words").text();
                        des = des + pt + "\n\r";
                    });
                    ans.description = des;
                    res.push(ans);
                });
            }
            else {
                $(rules.detailitem).each(function (i, e) {
                    var ans = {};
                    ans.index = i;
                    //ans.date = $(e).find(rules.date).first().text();
                    ans.date = eval(rules.date);
                    ans.description = eval(rules.detaildescription);
                    ans.images = eval(rules.images);
                    res.push(ans);
                });
            }
        },
        error: function (httpResponse) {
            console.error(url + 'Request failed with response code ' + httpResponse.status);
        }
    }).then(function () {
        response.success(res);
    });
});
/**
 *
 * @param ans
 */
var saveInfo = function (ans) {
    var detailInfo = new DetailInfo();
    detailInfo.set("source", ans.source);
    detailInfo.set("type", "tour");
    detailInfo.set("url", ans.url);
    detailInfo.set("title", ans.title);
    detailInfo.set("authorName", ans.author);
    detailInfo.set("startDate", ans.startdate);
    detailInfo.set("duration", ans.duration);
    detailInfo.set("brief", ans.brief);
    detailInfo.set("description", ans.description);
    detailInfo.set("tours", ans.tours);
    detailInfo.set("image",ans.image);
    return detailInfo.save();
}
/**
 *
 */
AV.Cloud.define("hello", function (request, response) {
    response.success("success");
});
//deal with list of list, the outer loop
var doList = function (cur,stop,unchanged,rules) {
    var promise = new AV.Promise();
    setTimeout(function(){
        var surl = unchanged[cur];
        console.log(surl);
        var stop = 1;
        AV.Cloud.httpRequest({
            url: surl,
            success: function (httpResponse) {
                var page = httpResponse.text;
                $ = cheerio.load(page);
                if(rules == "rules_ctrip"){
                    var tmp = $(".pager_v1 span .numpage").text();
                    if (tmp != null)
                        stop = tmp;
                }
                if(rules == "rules_daodao"){
                    stop = 1;
                }
                if(rules == "rules_tuniu"){
                    var tmp = $(".pages a").last().attr("href");
                    if(tmp!=null)
                        var stop = tmp.split("/")[4];
                }
                if(rules == "rules_chanyou"){
                    var tmp = $(".last a").attr("href");
                    if (tmp != null)
                        stop = tmp.replace(/.*page=/, "").replace(/&.*/, "");
                }
                if(rules == "rules_qyer"){
                    var tmp = $("[data-bn-ipg=pages-4]").attr("data-page");
                    if(tmp!=null)
                        stop = tmp;
                }
                doLoop(1,stop+1,surl,rules);
            },
            error: function (httpResponse) {
                console.error('Request failed with response code ' + httpResponse.status);
            }
        });
        promise.resolve('done');
        if(cur<stop){
            cur++;
            doList(cur,stop,unchanged,rules);
        }else{
            console.log('all done')
        }
    }, 2000*stop);
    return promise;
}


AV.Cloud.define("breadtrip", function (request, response) {
    var rules = "rules_breadtrip";
    var uc = "http://breadtrip.com/explore/new_hot/grid/?page=";
    doLoop(0,472,uc,rules);
    response.success("success");
});

var doLoop = function(cur,stop,unchanged,rules){
    var promise = new AV.Promise();
    setTimeout(function(){
        var starturl = unchanged;
        if(rules == "rules_breadtrip")
            starturl = unchanged + cur;
        if(rules == "rules_qyer")
           starturl = unchanged.replace(/_1\//,"")+"_"+cur+"/";
        if(rules == "rules_chanyou")
            starturl = unchanged + "&page=" + cur;
        if(rules == "rules_qunar")
            starturl = "http://travel.qunar.com/travelbook/list.htm?page=" + cur + "&order=hot_heat";
        if(rules == "rules_117go")
            starturl = unchanged + cur;
        if(rules == "rules_tuniu")
            starturl = unchanged.match(/http:\/\/trips.tuniu.com\/travelthread\/0\/\d+/)[0] + "/" + cur + "/0";
        if(rules == "rules_lvmama")
            starturl = "http://www.lvmama.com/trip/home/ajaxGetTrip?page=" + cur;
        if(rules == "rules_daodao")
            starturl = unchanged;
        if(rules == "rules_ctrip")
            starturl = unchanged.replace(".html", "") + "/t3-p" + cur + ".html";
        console.log(starturl);
        AV.Cloud.run("parselist", {"rules": rules, "url": starturl})
            .then(function (items) {
                items.forEach(function (item) {
                    var query = new AV.Query(DetailInfo);
                    query.equalTo("url", item.url);
                    //if find,do nothing
                    query.find().then(function (result) {
                        if (result.length == 0) {
                            console.log(item.url + "being parsed");
                            return AV.Promise.as("Continue");
                        } else {
                            return AV.Promise.error(item.url + " have been parsed");
                        }
                    }, function (err) {
                        console.log(item.url + "query error");
                        return AV.Promise.as("Create new class");
                    }).then(function () {
                        AV.Cloud.run("parsedetailpage", {"rules": rules, "url": item.url})
                            .then(function (ans) {
                                item.tours = ans;
                                saveInfo(item);
                            })
                    }, function (err) {
                        console.log(err);
                    });
                });
         }, function (err) {
                console.log("parselist err");
         });
        promise.resolve('done');
        if(cur<stop){
            cur++;
            doLoop(cur,stop,unchanged,rules);
        }else{
            console.log('all done')
        }
    }, 2000);
    return promise;
}

/**
*deal with qyer
**/
AV.Cloud.define("pagelist_qyer", function (request, response) {
    var url = "http://plan.qyer.com/";
    var res = [];
    AV.Cloud.httpRequest({
        url: url,
        success: function (httpResponse) {
            var page = httpResponse.text;
            $ = cheerio.load(page);
            $(".tabMain li").each(function (i, e) {
                //save basic info
                var ans = $(e).find("a").attr("href");
                res.push(ans);
                //console.log(res);
            });
        },
        error: function (httpResponse) {
            console.error('Request failed with response code ' + httpResponse.status);
        }
    }).then(function () {
        response.success(res);
    });
});
/**
 * qyer,dealwith qyer
 **/
AV.Cloud.define("qyer",function(request,response){
    var rules = "rules_qyer";
    AV.Cloud.run("pagelist_qyer")
        .then(function(res){
            doList(0,res.length,res,rules);
        });
    response.success("done");
 });

//chanyouji get all start pages
AV.Cloud.define("pagelist_chanyouji", function (request, response) {
    var url = "http://chanyouji.com/trips";
    var res = [];
    AV.Cloud.httpRequest({
        url: url,
        success: function (httpResponse) {
            var page = httpResponse.text;
            $ = cheerio.load(page);
            $(".content-side li").each(function (i, e) {
                //save basic info
                var ans = "http://chanyouji.com" + $(e).find("a").attr("href");
                res.push(ans);
            });
        },
        error: function (httpResponse) {
            console.error('Request failed with response code ' + httpResponse.status);
        }
    }).then(function () {
        response.success(res);
    });
});
/**
 * chanyouji,dealwith chanyouji
 **/
AV.Cloud.define("chanyouji", function (request, response) {
    var rules = "rules_chanyou";
    AV.Cloud.run("pagelist_chanyouji")
        .then(function (res) {
            doList(0,res.length,res,rules);
        });
    response.success("done");
});

/**
 * deal with qunar
 */
AV.Cloud.define("qunar", function (requset, response) {
    var rules = "rules_qunar";
    AV.Cloud.httpRequest({
        url: "http://travel.qunar.com/travelbook/list.htm?page=1&order=hot_heat",
        success: function (httpResponse) {
            var page = httpResponse.text;
            $ = cheerio.load(page);
            var tmp = $("[data-beacon=click_result_page]").last().text();
            var uc = starturl = "http://travel.qunar.com/travelbook/list.htm?page=1&order=hot_heat";
            doLoop(1,tmp+1,uc,rules);
        },
        error: function (httpResponse) {
            console.error('Request failed with response code ' + httpResponse.status);
        }
    });
    response.success("done");
});

/**
 * deal with 117go
 **/
AV.Cloud.define("117go", function (request, response) {
    var rules = "rules_117go";
    var unchanged = "http://www.117go.com/data/index/featuredTours?p=";
    doLoop(1,626,unchanged,rules);
    response.success("success");
});

/**
 * tuniu pagelist
 */
AV.Cloud.define("pagelist_tuniu", function (request, response) {
    var url = "http://trips.tuniu.com/";
    var res = [];
    AV.Cloud.httpRequest({
        url: url,
        success: function (httpResponse) {
            var page = httpResponse.text;
            $ = cheerio.load(page);
            $(".sub_item li").each(function (i, e) {
                //save basic info
                var ans = "http://trips.tuniu.com" + $(e).find("a").attr("href");
                res.push(ans);
            });
        },
        error: function (httpResponse) {
            console.error('Request failed with response code ' + httpResponse.status);
        }
    }).then(function () {
        response.success(res);
    });
});
/**
 *deal with tuniu
 **/
AV.Cloud.define("tuniu", function (requset, response) {
    var rules = "rules_tuniu";
    AV.Cloud.run("pagelist_tuniu")
        .then(function (res) {
            doList(0,res.length,res,rules);
        });
    response.success("done");

});

/**
 *deal with lvmama
 **/
AV.Cloud.define("lvmama", function (requset, response) {
    var rules = "rules_lvmama";
    AV.Cloud.httpRequest({
        url: "http://www.lvmama.com/trip/",
        success: function (httpResponse) {
            var page = httpResponse.text;
            $ = cheerio.load(page);
            var tmp = $(".wy_state_page a").length;
            var stop = $(".wy_state_page a").eq(tmp - 2).text();
            //console.log(stop);
            var uc = "http://www.lvmama.com/trip/home/ajaxGetTrip?page=";
            doLoop(1,stop+1,uc,rules);
        },
        error: function (httpResponse) {
            console.error("www.lvmama " + 'Request failed with response code ' + httpResponse.status);
        }
    });
    response.success("done");

});

/**deal with daodao*/
AV.Cloud.define("pagelist_daodao",function(request,response){
    var url= "http://www.tripadvisor.cn/TourismBlog-g293915-Thailand.html";
    var res = [];
    AV.Cloud.httpRequest({
        url: url,
        success: function (httpResponse) {
            var page = httpResponse.text;
            $ = cheerio.load(page);
            $(".stb-tabs li").each(function (i, e) {
                var ans = "http://www.tripadvisor.cn" + $(e).find("a").attr("href");
                res.push(ans);
            });
        },
        error: function (httpResponse) {
            console.error('Request failed with response code ' + httpResponse.status);
        }
    }).then(function () {
        response.success(res);
    });
})
/**
 *deal with daodao
 **/
AV.Cloud.define("daodao", function (requset, response) {
    var rules = "rules_daodao";
    AV.Cloud.run("pagelist_daodao")
        .then(function (res) {
            doList(0,res.length,res,rules);
        });
    response.success("done");
});

/**
 *deal with ctrip
 **/
AV.Cloud.define("pagelist_ctrip", function (request, response) {
    var url = "http://you.ctrip.com/travels";
    var res = [];
    AV.Cloud.httpRequest({
        url: url,
        success: function (httpResponse) {
            var page = httpResponse.text;
            $ = cheerio.load(page);
            $(".despop_box dd").each(function (i, e) {
                //save basic info
                var ans = "http://you.ctrip.com" + $(e).find("a").attr("href");
                res.push(ans);
            });
        },
        error: function (httpResponse) {
            console.error('Request failed with response code ' + httpResponse.status);
        }
    }).then(function () {
        response.success(res);
    });
});
/**
 * ctrip,dealwith ctrip
 **/
AV.Cloud.define("ctrip", function (request, response) {
    var rules = "rules_ctrip";
    AV.Cloud.run("pagelist_ctrip")
        .then(function (res) {
            doList(0,res.length,res,rules);
        });
    response.success("done");
});