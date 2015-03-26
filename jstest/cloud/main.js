require("cloud/app.js");
// Use AV.Cloud.define to define as many cloud functions as you want.
// For example:
var cheerio = require('cheerio');
var https = require('https');
/**
 * create new class according to different pages
 */
var DetailInfo = AV.Object.extend("DetailInfo");

/**
 *breadtrip,done,with all running
 * @type {{starturl: string, eachitem: string, title: string, startdate: string, duration: string, author: string, pre_url: string, needpre: string, authorindetail: string, detailitem: string, date: string, detaildescription: string}}
 */
var rules_breadtrip = {
    //for test
    "starturl":"http://breadtrip.com/explore/",
    "testurl":"http://breadtrip.com/trips/2388187734/",
    //save
    "source":"breadtrip",
    //in list
    "eachitem":".info",
    "pre_url":"http://breadtrip.com",
    "needpre":"1",
    //"title":".ellipsis_text",
    "title":"$(e).find('.ellipsis_text').text()",
    //"author":"",
    "author":"",
    //"startdate":".trip-startdate",
    "startdate":"$(e).find('.trip-startdate').text()",
    //"duration":".trip-duration",
    "duration":"$(e).find('.trip-duration').text()",
    //"brief":".ellipsis_text",
    "brief":"$(e).find('.ellipsis_text').text()",
    //"description":".ellipsis_text",
    "description":"$(e).find('.ellipsis_text').text()",


    //in detail
    "authorindetail":".trip-user",
    "detailitem":".trip-days",
    //"date":"span",
    "date":"$(e).find('span').first().text()",
    //"detaildescription":".text.photo-comment"
    "detaildescription":"$(e).find('.text.photo-comment').text()"
};

/**
 *qunar,done,with all running
 * @type {{starturl: string, eachitem: string, title: string, startdate: string, duration: string, description: string, author: string, pre_url: string, needpre: string, authorindetail: string, detailitem: string, date: string, detaildescription: string}}
 */
var rules_qunar = {
    "starturl":"http://travel.qunar.com/travelbook/list.htm?order=hot_heat",
    "testurl":"http://travel.qunar.com/youji/5305677",

    //save tag
    "source":"qunar",
    //in list
    "eachitem":".list_item",
    "pre_url":"http://travel.qunar.com",
    "needpre":"1",
    //"title":".tit",
    "title":"$(e).find('.tit').text()",
    //"author":"",
    "author":"$(e).find('.user_name').text()",
    //"startdate":".date",
    "startdate":"$(e).find('.date').text().split(' ')[0]",
    //"duration":".days",
    "duration":"$(e).find('.days').text()",
    //"brief":""
    "brief":"$(e).find('.places').text()",
    //"description":".places",
    "description":"$(e).find('.places').text()",


    //in detail
    "authorindetail":".trip-user",
    "detailitem":".e_day",
    //".date":".time",
    "date":"$(e).find('.time').text()",
    //"detaildescription":".text"
    "detaildescription":"$(e).find('.text').text()"
};

/**
 *daodao,done,with all running
 * @type {{starturl: string, testurl: string, class: string, eachitem: string, pre_url: string, needpre: string, title: string, startdate: string, duration: string, brief: string, description: string, author: string, authorindetail: string, detailitem: string, date: string, detaildescription: string}}
 */
var rules_daodao = {
    "starturl":"http://www.daodao.com/TourismBlog-g294217-Hong_Kong.html",
    "testurl":"http://www.daodao.com/TourismBlog-t1505.html",
    //save
    "source":"daodao",
    //in list
    "eachitem":".stb-list li",
    "pre_url":"http://www.daodao.com",
    "needpre":"1",
    //"title":".title",
    "title":"$(e).find('.title').text()",
    //"startdate":".date",
    "startdate":"$(e).find('.info').text()",
    "startdaterg":"1",
    //"duration":".days",
    "duration":"",
    //"brief":".geo",
    "brief":"$(e).find('geo').text()",
    //"description":".places",
    "description":"$(e).find('.route').text()",
    "author":"$(e).find('.info').text().split('作者')[1] ",

    //in detail
    "authorindetail":".trip-user",
    "detailitem":".strategy-content",
    //".date":".time",
    "date":"$(e).find('.time').text()",
    //"detaildescription":".text"
    "detaildescription":"$(e).text()"
};

/**
 * ctrip,done ,with all running
 * .journal-item? .li
 * @type {{starturl: string, testurl: string, class: string, eachitem: string, pre_url: string, needpre: string, title: string, startdate: string, duration: string, brief: string, description: string, author: string, authorindetail: string, detailitem: string, date: string, detaildescription: string}}
 */
var rules_ctrip = {
    "starturl":"http://you.ctrip.com/travels/",
    "testurl":"http://you.ctrip.com/travels/wuhan145/2280770.html",
    //save
    "source":"ctrip",
    //in list
    "eachitem":".journal-item",
    "pre_url":"http://you.ctrip.com",
    "needpre":"2",
    //"title":"h3",
    "title":"$(e).find('.ellipsis').text()",
    //"author":"",.split('发')[0]
    "author":"$(e).find('.item-user').text().split('发')[0]",
    //"startdate":".date",.split(';')[1]
    "startdate":"$(e).find('.item-user').text()",
    //"duration":".days",
    "duration":"$(e).find('.tips_a').text().split('，')[0]",
    //"brief":".geo",
    "brief":"$(e).find('.item-short').text()",
    //"description":".places",
    "description":"$(e).find('.item-short').text()",

    //in detail
    "authorindetail":"$('.ctd_head_right a[id=authorDisplayName]').text()",
    "detailitem":".ctd_content",
    //".date":".time",
    "date":"$(e).find('.time').text()",
    //"detaildescription":".text"
    "detaildescription":"$(e).find('p').text()"
};

/**
 *qyer,done
 * description not ideal
 * @type {{starturl: string, testurl: string, class: string, eachitem: string, pre_url: string, needpre: string, title: string, startdate: string, duration: string, brief: string, description: string, author: string, authorindetail: string, detailitem: string, date: string, detaildescription: string}}
 */
var rules_qyer = {
    "starturl":"http://plan.qyer.com/search_0_0_186_0_0_0_1/",
    "testurl":"http://plan.qyer.com/trip/V2UJYVFgBzdTbFI2Cm8/",
    //save
    "source":"qyer",
    //in list
    "eachitem":".list .items",
    "pre_url":"http://www.qyer.com",
    "needpre":"0",
    //"title":".title",
    "title":"$(e).find('.fontYaHei').find('dd').text()",
    //"startdate":".date",
    "startdate":"$(e).find('.fontYaHei').find('dt').text().split(' ')[0]",
    //"duration":".days",
    "duration":"$(e).find('.day').text()",
    //"brief":".geo",
    "brief":"$(e).find('.content').find('.plan').text()",
    //"description":".places",
    "description":"$(e).find('.content').find('.plan').text()",
    "author":"$(e).find('.name').text()",

    //in detail
    "authorindetail":".trip-user",
    "detailitem":".day_item",
    //".date":".time",
    "date":"$(e).find('.day_time').text()",
    //"detaildescription":".text"
    "detaildescription":"$(e).find('.note_row').find('p').text()"
};

/**
 * chanyou done,with all running
 * parse detail
 * @type {{starturl: string, testurl: string, class: string, eachitem: string, pre_url: string, needpre: string, title: string, startdate: string, duration: string, brief: string, description: string, author: string, authorindetail: string, detailitem: string, date: string, detaildescription: string}}
 */
var rules_chanyou = {
    "starturl":"http://chanyouji.com/trips/",
    "testurl":"http://chanyouji.com/trips/207033",
    //regax
    "regax":"1",
    //save
    "source":"chanyouji",
    //in list
    "eachitem":".trip-g",
    "pre_url":"http://chanyouji.com",
    "needpre":"1",
    //"title":".title",
    "title":"$(e).find('header').find('h1').text()",
    //"startdate":".date",
    "startdate":"$(e).find('.trip-date').text().split('|')[0]",
    //"duration":".days",
    "duration":"$(e).find('.trip-date').text().split('|')[1].split('天')[0]",
    //"brief":".geo",
    "brief":"$(e).find('header').find('h1').text()",
    //"description":".places",
    "description":"$(e).find('header').find('h1').text()",
    "author":"",

    //in detail
    "authorindetail":".trip-user",
    "detailitem":".trips-wraper",
    //".date":".time",
    "date":"$(e).find('.day-date').text().split(' ')[0]",
    //"detaildescription":".text"
    "detaildescription":"$(e).find('script')"
};

/**
 * 117go,done,with all running
 *
 * @type {{starturl: string, testurl: string, class: string, eachitem: string, pre_url: string, needpre: string, title: string, startdate: string, duration: string, brief: string, description: string, author: string, authorindetail: string, detailitem: string, date: string, detaildescription: string}}
 */
var rules_117go = {
    "starturl":"http://www.117go.com",
    "testurl":"http://www.117go.com/tour/53856965",
    "regax":"2",
    //save
    "source":"117go",
    //in list
    "eachitem":".tours-item-wrapper-wrap",
    "pre_url":"http://www.117go.com",
    "needpre":"1",
    //"title":".title",
    "title":"$(e).find('.tours-item-title-content').text()",
    //"startdate":".date",
    "startdate":"$(e).find('.trip-date').text()",
    //"duration":".days",
    "duration": null,
    //"brief":".geo",
    "brief":"$(e).find('.tours-item-cities').text()",
    //"description":".places",
    "description":"$(e).find('.tours-item-cities').text()",
    "author":"",
    //
    "special_type":"2",
    //in detail
    "authorindetail":".t-feeds",
    "detailitem":".t-feeds",
    //".date":".time",
    "date":"$(e).find('.t-day-sp-date').text()",
    //"detaildescription":".text"
    "detaildescription":"$(e).find('.t-feed-words.paragraph').text()"
};

/**
 * done, with all running
 *tuniu
 * @type {{starturl: string, testurl: string, class: string, eachitem: string, pre_url: string, needpre: string, title: string, startdate: string, duration: string, brief: string, description: string, author: string, authorindetail: string, detailitem: string, date: string, detaildescription: string}}
 */
var rules_tuniu = {
    "starturl":"http://trips.tuniu.com/",
    "testurl":"http://www.tuniu.com/trips/10011491",
    //save
    "source":"tuniu",
    //in list
    "eachitem":".hot-main-square",
    "pre_url":"http://trips.tuniu.com/",
    "needpre":"0",
    //"title":".title",
    "title":"$(e).find('.note-title').text()",
    //"startdate":".date",
    "startdate":"$(e).find('.reader-info').find('span').text()",
    //"duration":".days",
    "duration":"",
    //"brief":".geo",
    "brief":"$(e).find('.tours-item-cities').text()",
    //"description":".places",
    "description":"$(e).find('.tours-item-cities').text()",
    "author":"$(e).find('.author').text()",

    //in detail
    "authorindetail":".t-feeds",
    "detailitem":".blog-main",
    //".date":".time",
    "date":"$(e).find('.t-day-sp-date').text()",
    //"detaildescription":".text"
    "detaildescription":"$(e).text()"
};

/**
 * done, with all running
 *lvmama
 * @type {{starturl: string, testurl: string, class: string, eachitem: string, pre_url: string, needpre: string, title: string, startdate: string, duration: string, brief: string, description: string, author: string, authorindetail: string, detailitem: string, date: string, detaildescription: string}}
 */
var rules_lvmama = {
    "starturl":"http://www.lvmama.com/trip/",
    "testurl":"http://www.lvmama.com/trip/show/50043",
    //save
    "source":"lvmama",
    //in list
    "eachitem":"dl",
    "pre_url":"http://www.lvmama.com",
    "needpre":"0",
    //"title":".title",
    "title":"$(e).find('.title').text()",
    //"startdate":".date",
    "startdate":"$(e).find('.uploadInfo').text().split('|')[1].split('发')[0]",
    //"duration":".days",
    "duration":"$(e).find('.uploadInfo').text().split('|')[2]",
    //"brief":".geo",
    "brief":"$(e).find('.tripTxt').text()",
    //"description":".places",
    "description":"$(e).find('.tripTxt').text()",
    "author":"$(e).find('.uploadInfo').text().split('|')[0]",

    //in detail
    "authorindetail":".t-feeds",
    "detailitem":".t_oneDay",
    //".date":".time",
    "date":"$(e).find('.t_dayTime').find('span').text()",
    //"detaildescription":".text"
    "detaildescription":"$(e).find('dd').text()"
};

/**
 * parselist
 * need rules,url
 */
AV.Cloud.define("parselist",function(request,response){
    var rules = eval(request.params.rules);
    //var url = rules.starturl;
    var url = request.params.url;
    //console.log(rules);
    //console.log(url);
    var res=[];
    AV.Cloud.httpRequest({
        url: url,
        success: function(httpResponse) {
            var page = httpResponse.text;
            $=cheerio.load(page);
            $(rules.eachitem).each(function(i,e) {
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
                else{
                    var dt = duration.match(/\d+/);
                    if(dt==null)
                        ans.duration = null;
                    else
                        ans.duration = dt[0];
                }

                if (rules.needpre == 2) {
                    pageurl = rules.pre_url + $(e).parent().find(rules.eachitem).eq(i).attr('href');
                    var startdate = eval(rules.startdate).match(/\d\d\d\d-\d\d-\d\d/);
                    ans.startdate = startdate[0];
                }
                if(rules.needpre==1)
                    pageurl = rules.pre_url + $(e).find('a').attr('href');
                if(rules.needpre==0)
                    pageurl =  $(e).find('a').attr('href');
                if(rules.startdaterg==1){
                    var startdate = eval(rules.startdate).match(/\d\d\d\d-\d\d-\d\d/);
                    if(startdate!=null)
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
                res.push(ans);
            });
        },
        error: function(httpResponse) {
            console.error('Request failed with response code ' + httpResponse.status);
        }
    }).then(function(){
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
AV.Cloud.define("parsedetailpage", function(request,response) {
    var rules = eval(request.params.rules);
    //var rules = rules_qunar;
    var url = request.params.url;
    var res=[];
    console.log(url);
    AV.Cloud.httpRequest({
        url: url,
        headers: {
            'User-Agent':'Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US; rv:1.9.1.6) Gecko/20091201 Firefox/3.5.6'
        },
        success: function(httpResponse) {
            console.log(url);
            var page = httpResponse.text;
            $=cheerio.load(page);

           // var str = /(?=parse)/;
            if(rules.regax==1){
                var tmp =  page.replace(/[.\S\s]*TripsCollection\(/,"").replace(/\,\{parse.+/,"");
                if(tmp==null)
                    response.success(null);
                var arr = JSON.parse(tmp);
                var index = -1;
                var ans = {};
                for(var item in arr){
                    //console.log(arr[item].sid);
                    if(arr[item].trip_date==null){
                        res[index].description =  res[index].description + arr[item].description + "\n\r";
                    }else{
                        index ++;
                        ans.index = index;
                        ans.date = arr[item].trip_date;
                        ans.description = "";
                        res.push(ans);
                        ans={};
                    }
                }
            }
            if(rules.regax==2) {
                $(".t-day-spliter").each(function (i, e) {
                    var ans = {};
                    var idstr = "a[data-day=" + (i + 1) + "]";
                    ans.index = i;
                    ans.date = $(e).find(".t-day-sp-date").text();
                    var des = "";
                    //console.log(idstr);
                    $(e).parent().find(idstr).each(function (i, e) {
                        var idx = $(e).attr("data-feed");
                        var str = "[id=tFeed" + idx + "]";
                        var pt = $(e).parent().parent().find(str).find(".t-feed-words").text();
                        des = des + pt + "\n\r";
                    });
                    ans.description = des;
                    //console.log(ans);
                    res.push(ans);
                });
            }
            else{
                $(rules.detailitem).each(function(i,e){
                    var ans={};
                    ans.index = i;
                    //ans.date = $(e).find(rules.date).first().text();
                    ans.date = eval(rules.date);
                    ans.description = eval(rules.detaildescription);
                    //console.log(ans);
                    res.push(ans);
                });
            }
        },
        error: function(httpResponse) {
            console.log(url);
            console.error('Request failed with response code ' + httpResponse.status);
        }
    }).then(function(){
        response.success(res);
    });
});
/**
 *
 * @param ans
 */
var saveInfo = function(ans){
    var detailInfo = new DetailInfo();
    detailInfo.set("source",ans.source);
    detailInfo.set("type","tour");
    detailInfo.set("url",ans.url);
    detailInfo.set("title",ans.title);
    detailInfo.set("authorName",ans.author);
    detailInfo.set("startDate",ans.startdate);
    detailInfo.set("duration",ans.duration);
    detailInfo.set("brief",ans.brief);
    detailInfo.set("description",ans.description);
    detailInfo.set("tours",ans.tours);
    return detailInfo.save();
}
/**
 *
 */
AV.Cloud.define("hello",function(request,response){
    var url = request.params.url;
     response.success("success");
});
//deal with breadtrip
AV.Cloud.define("breadtrip",function(request,response){
    rules = "rules_breadtrip";
    for(var i=0;i<472;i++){
        var starturl = "http://breadtrip.com/explore/new_hot/grid/?page="+i;
        //console.log("starturl: " + starturl);
        AV.Cloud.run("parselist",{"rules":"rules_breadtrip","url":starturl})
            .then(function(items) {
                items.forEach(function (item) {
                    var query = new AV.Query(DetailInfo);
                    query.equalTo("url", item.url);
                    //if find,do nothing
                    query.find().then(function (result) {
                        if(result.length==0){
                            return AV.Promise.as("Continue");
                        }else{
                            return AV.Promise.error(item.url + " have been parsed");
                        }
                    }, function (err) {
                        console.log("query error");
                    }).then(function () {
                        AV.Cloud.run("parsedetailpage", {"rules": rules, "url": item.url})
                            .then(function (ans) {////???????
                                item.tours = ans;
                                saveInfo(item);
                            }
                        )
                    },function(err){
                        console.log("have been parsed");
                    });
                });
            },function(err) {
                console.log("parselist err");
            });

    }
    response.success("success");
});

//chanyouji get all start pages
AV.Cloud.define("pagelist_chanyouji",function(request,response){
    var url = "http://chanyouji.com/trips";
    var res = [];
    AV.Cloud.httpRequest({
        url: url,
        success: function(httpResponse) {
            var page = httpResponse.text;
            $=cheerio.load(page);
            $(".content-side li").each(function(i,e){
                //save basic info
                var ans = "http://chanyouji.com"+ $(e).find("a").attr("href");
                res.push(ans);
            });
        },
        error: function(httpResponse) {
            console.error('Request failed with response code ' + httpResponse.status);
        }
    }).then(function(){
        response.success(res);
    });
});

/**
 * chanyouji,dealwith chanyouji
 **/

AV.Cloud.define("chanyouji",function(request,response){
    AV.Cloud.run("pagelist_chanyouji")
        .then(function(res){
            res.forEach(function(surl){
                var stop = 1;
                AV.Cloud.httpRequest({
                    url: surl,
                    success: function(httpResponse) {
                        var page = httpResponse.text;
                        $=cheerio.load(page);
                        var tmp = $(".last a").attr("href");
                        if(tmp!=null)
                            stop = tmp.replace(/.*page=/,"").replace(/&.*/,"");
                        for(var i=1;i<=stop;i++){
                            var starturl;
                            starturl = surl + "&page=" + i;
                            //console.log(starturl);
                            AV.Cloud.run("parselist",{"rules":"rules_chanyou","url":starturl})
                                .then(function(items) {
                                    //console.log(res);
                                    items.forEach(function (item) {
                                        //console.log(item.url);
                                        var query = new AV.Query(DetailInfo);
                                        query.equalTo("url", item.url);
                                        //if find,do nothing
                                        query.find().then(function (result) {
                                            if(result.length==0){
                                                return AV.Promise.as("Continue");
                                            }else{
                                                return AV.Promise.error(item.url + " have been parsed");
                                            }
                                        }, function (err) {
                                            console.log("query error");
                                        }).then(function () {
                                            AV.Cloud.run("parsedetailpage", {"rules":"rules_chanyou", "url": item.url})
                                                .then(function (ans) {
                                                    item.tours = ans;
                                                    saveInfo(item);
                                                }
                                            )
                                        },function(err){
                                            console.log("have been parsed");
                                        });
                                    });
                                },function(err) {
                                    console.log("parselist err");
                                });
                        }
                    },
                    error: function(httpResponse) {
                        console.error('Request failed with response code ' + httpResponse.status);
                    }
                }).then(function(){
                    response.success(res);
                });

            })
        });
    response.success("done");
});
//deal with qunar
AV.Cloud.define("qunar",function(requset,response){
    AV.Cloud.httpRequest({
        url: "http://travel.qunar.com/travelbook/list.htm?page=1&order=hot_heat",
        success: function (httpResponse) {
            var page = httpResponse.text;
            $ = cheerio.load(page);
            var tmp = $("[data-beacon=click_result_page]").last().text();
            for (var i = 1; i <= tmp; i++) {
                var starturl = "http://travel.qunar.com/travelbook/list.htm?page=" + i + "&order=hot_heat";
                //console.log(starturl);
                AV.Cloud.run("parselist", {"rules": "rules_qunar", "url": starturl})
                    .then(function (items) {
                        items.forEach(function (item) {
                            //console.log(item.url);
                            var query = new AV.Query(DetailInfo);
                            query.equalTo("url", item.url);
                            query.find().then(function (result) {
                                if(result.length==0){
                                    return AV.Promise.as("Continue");
                                }else{
                                    return AV.Promise.error(item.url + " have been parsed");
                                }
                            }, function (err) {
                                console.log("query error");
                            }).then(function () {
                                AV.Cloud.run("parsedetailpage", {"rules": "rules_qunar", "url": item.url})
                                    .then(function (ans) {
                                        item.tours = ans;
                                        saveInfo(item);
                                    }
                                )
                            }, function (err) {
                                console.log(err);
                            });
                        });
                    }, function (err) {
                        console.log("parselist err");
                    });
            }
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
AV.Cloud.define("117go",function(request,response){
    var rules = "rules_117go";
    for(var i=1;i<626;i++){
        var starturl = "http://www.117go.com/data/index/featuredTours?p="+i;
        AV.Cloud.run("parselist",{"rules":rules,"url":starturl})
            .then(function(items) {
                //console.log(res);
                items.forEach(function (item) {
                    //console.log(item.url);
                    var query = new AV.Query(DetailInfo);
                    query.equalTo("url", item.url);
                    //if find,do nothing
                    query.find().then(function (result) {
                        if(result.length==0){
                            return AV.Promise.as("Continue");
                        }else{
                            return AV.Promise.error(item.url + " have been parsed");
                        }
                    }, function (err) {
                        console.log(err+" query failed");
                    }).then(function () {
                        AV.Cloud.run("parsedetailpage", {"rules": rules, "url": item.url})
                            .then(function (ans) {////???????
                                item.tours = ans;
                                saveInfo(item);
                            }
                        )
                    },function(err){
                        console.log("err");
                    });
                });
            },function(err) {
                console.log("parselist err");
            });
    }
    response.success("success");
})
/**
 * tuniu pagelist
 */
AV.Cloud.define("pagelist_tuniu",function(request,response){
    var url = "http://trips.tuniu.com/";
    var res = [];
    AV.Cloud.httpRequest({
        url: url,
        success: function(httpResponse) {
            var page = httpResponse.text;
            $=cheerio.load(page);
            $(".sub_item li").each(function(i,e){
                //save basic info
                var ans = "http://trips.tuniu.com"+ $(e).find("a").attr("href");
                res.push(ans);
            });
        },
        error: function(httpResponse) {
            console.error('Request failed with response code ' + httpResponse.status);
        }
    }).then(function(){
        response.success(res);
    });
});
/**
 *deal with tuniu
 **/
AV.Cloud.define("tuniu",function(requset,response){
    var rules = "rules_tuniu";
    AV.Cloud.run("pagelist_tuniu")
        .then(function(res){
            res.forEach(function(surl){
                var stop = 1;
                AV.Cloud.httpRequest({
                    url: surl,
                    success: function (httpResponse) {
                        var page = httpResponse.text;
                        $ = cheerio.load(page);
                        var tmp = $(".pages a").last().attr("href");
                        var stop = tmp.split("/")[4];
                        for (var i = 1; i <= stop; i++) {
                            var starturl = surl.match(/http:\/\/trips.tuniu.com\/travelthread\/0\/\d+/)[0]+"/"+i+"/0";
                            console.log("starturl = " + starturl);
                            AV.Cloud.run("parselist", {"rules": rules, "url": starturl})
                                .then(function (items) {
                                    //console.log(res);
                                    items.forEach(function (item) {
                                        //console.log(item.url);
                                        var query = new AV.Query(DetailInfo);
                                        query.equalTo("url", item.url);
                                        query.find().then(function (result) {
                                            if(result.length==0){
                                                return AV.Promise.as("Continue");
                                            }else{
                                                return AV.Promise.error(item.url + " have been parsed");
                                            }
                                        }, function (err) {
                                            console.log("query error");
                                        }).then(function () {
                                            AV.Cloud.run("parsedetailpage", {"rules": rules, "url": item.url})
                                                .then(function (ans) {
                                                    item.tours = ans;
                                                    saveInfo(item);
                                                }
                                            )
                                        }, function (err) {
                                            console.log(err);
                                        });
                                    });
                                }, function (err) {
                                    console.log("parselist err");
                                });
                        }
                    },
                    error: function (httpResponse) {
                        console.error('Request failed with response code ' + httpResponse.status);
                    }
                });
            })
        });
    response.success("done");

});
/**
 *deal with lvmama
 **/
AV.Cloud.define("lvmama",function(requset,response){
    var rules = "rules_lvmama";
    AV.Cloud.httpRequest({
        url: "http://www.lvmama.com/trip/",
        success: function (httpResponse) {
            var page = httpResponse.text;
            $ = cheerio.load(page);
            var tmp = $(".wy_state_page a").length;
            var stop =  $(".wy_state_page a").eq(tmp-2).text();
            //console.log(stop);
            for (var i = 1; i <= stop; i++) {
                var starturl = "http://www.lvmama.com/trip/home/ajaxGetTrip?page="+i;
                AV.Cloud.run("parselist", {"rules": rules, "url": starturl})
                    .then(function (items) {
                        //console.log(res);
                        items.forEach(function (item) {
                            //console.log(item.url);
                            var query = new AV.Query(DetailInfo);
                            query.equalTo("url", item.url);
                            query.find().then(function (result) {
                                if(result.length==0){
                                    return AV.Promise.as("Continue");
                                }else{
                                    return AV.Promise.error(item.url + " have been parsed");
                                }
                            }, function (err) {
                                console.log("query error");
                            }).then(function () {
                                AV.Cloud.run("parsedetailpage", {"rules": rules, "url": item.url})
                                    .then(function (ans) {
                                        item.tours = ans;
                                        saveInfo(item);
                                    }
                                )
                            }, function (err) {
                                console.log(err);
                            });
                        });
                    }, function (err) {
                        console.log("parselist err");
                    });
            }
        },
        error: function (httpResponse) {
            console.error('Request failed with response code ' + httpResponse.status);
        }
    });
    response.success("done");

});
/**
 *deal with daodao
 **/
AV.Cloud.define("daodao",function(requset,response){
    var rules = "rules_daodao";
    AV.Cloud.httpRequest({
        url: "http://www.daodao.com/TourismBlog-g293915-Thailand.html",
        success: function (httpResponse) {
            var page = httpResponse.text;
            $ = cheerio.load(page);
            $(".stb-tabs li").each(function(i,e){
                var starturl = "http://www.daodao.com" + $(e).find("a").attr("href");
                AV.Cloud.run("parselist", {"rules": rules, "url": starturl})
                    .then(function (items) {
                        //console.log(res);
                        items.forEach(function (item) {
                            console.log(item.url);
                            var durl = item.url;
                            var query = new AV.Query(DetailInfo);
                            query.equalTo("url", durl);
                            query.find().then(function (result) {
                                if(result.length==0){
                                    console.log("continue");
                                    return AV.Promise.as("Continue");
                                }else{
                                    return AV.Promise.error(item.url + " have been parsed");
                                }
                            }, function (err) {
                                console.log("query error");
                            }).then(function () {
                                console.log("parsedetailpage");
                                AV.Cloud.run("parsedetailpage", {"rules": rules, "url": durl})
                                    .then(function (ans) {
                                        item.tours = ans;
                                        saveInfo(item);
                                    }
                                )
                            }, function (err) {
                                console.log(err);
                            });
                        });
                    }, function (err) {
                        console.log("parselist err");
                    });
            });
        },
        error: function (httpResponse) {
            console.error('Request failed with response code ' + httpResponse.status);
        }
    });
    response.success("done");

});
/**
 *deal with ctrip
 **/
//ctrip get all start pages
AV.Cloud.define("pagelist_ctrip",function(request,response){
    var url = "http://you.ctrip.com/travels";
    var res = [];
    AV.Cloud.httpRequest({
        url: url,
        success: function(httpResponse) {
            var page = httpResponse.text;
            $=cheerio.load(page);
            $(".despop_box dd").each(function(i,e){
                //save basic info
                var ans = "http://you.ctrip.com"+ $(e).find("a").attr("href");
                res.push(ans);
            });
        },
        error: function(httpResponse) {
            console.error('Request failed with response code ' + httpResponse.status);
        }
    }).then(function(){
        response.success(res);
    });
});

/**
 * ctrip,dealwith ctrip
 **/

AV.Cloud.define("ctrip",function(request,response){
    var rules = "rules_ctrip";
    AV.Cloud.run("pagelist_ctrip")
        .then(function(res){
            res.forEach(function(surl){
                var stop = 1;
                AV.Cloud.httpRequest({
                    url: surl,
                    success: function(httpResponse) {
                        var page = httpResponse.text;
                        $=cheerio.load(page);
                        var tmp = $(".pager_v1 span .numpage").text();
                        if(tmp!=null)
                            stop = tmp;

                        for(var i=1;i<=stop;i++){
                            var starturl = surl.replace(".html","")+"/t3-p"+i+".html";
                            //console.log(starturl);
                            AV.Cloud.run("parselist",{"rules":rules,"url":starturl})
                                .then(function(items) {
                                    items.forEach(function (item) {
                                        var query = new AV.Query(DetailInfo);
                                        query.equalTo("url", item.url);
                                        //if find,do nothing
                                        query.find().then(function (result) {
                                            if(result.length==0){
                                                return AV.Promise.as("Continue");
                                            }else{
                                                return AV.Promise.error(item.url + " have been parsed");
                                            }
                                        }, function (err) {
                                            console.log("query error");
                                        }).then(function () {
                                            AV.Cloud.run("parsedetailpage", {"rules":rules, "url": item.url})
                                                .then(function (ans) {
                                                    item.tours = ans;
                                                    saveInfo(item);
                                                }
                                            )
                                        },function(err){
                                            console.log("have been parsed");
                                        });
                                    });
                                },function(err) {
                                    //console.log("parselist err");
                                });
                        }
                    },
                    error: function(httpResponse) {
                        console.error('Request failed with response code ' + httpResponse.status);
                    }
                }).then(function(){
                    response.success(res);
                });

            })
        }) ;
    response.success("done");
});
/**
 *deal with qyer
 **/
//ctrip get all start pages
AV.Cloud.define("pagelist_qyer",function(request,response){
    var url = "http://plan.qyer.com/";
    var res = [];
    AV.Cloud.httpRequest({
        url: url,
        success: function(httpResponse) {
            var page = httpResponse.text;
            $=cheerio.load(page);
            $(".tabMain li").each(function(i,e){
                //save basic info
                var ans = $(e).find("a").attr("href");
                res.push(ans);
                //console.log(res);
            });
        },
        error: function(httpResponse) {
            console.error('Request failed with response code ' + httpResponse.status);
        }
    }).then(function(){
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
            res.forEach(function(surl){
                var stop = 1;
                AV.Cloud.httpRequest({
                    url: surl,
                    success: function(httpResponse) {
                        var page = httpResponse.text;
                        $=cheerio.load(page);
                        var tmp = $("[data-bn-ipg=pages-4]").attr("data-page");
                        if(tmp!=null)
                            stop = tmp;
                        //console.log(stop);
                        for(var i=1;i<=stop;i++){
                            var starturl = surl.replace(/_1\//,"")+"_"+i+"/";

                            //console.log(starturl);
                            AV.Cloud.run("parselist",{"rules":rules,"url":starturl})
                                .then(function(items) {
                                    items.forEach(function (item) {
                                        var query = new AV.Query(DetailInfo);
                                        query.equalTo("url", item.url);
                                        //if find,do nothing
                                        query.find().then(function (result) {
                                            if(result.length==0){
                                                return AV.Promise.as("Continue");
                                            }else{
                                                return AV.Promise.error(item.url + " have been parsed");
                                            }
                                        }, function (err) {
                                            console.log("query error");
                                        }).then(function () {
                                            AV.Cloud.run("parsedetailpage", {"rules":rules, "url": item.url})
                                                .then(function (ans) {
                                                    item.tours = ans;
                                                    saveInfo(item);
                                                }
                                            )
                                        },function(err){
                                            console.log("have been parsed");
                                        });
                                    });
                                },function(err) {
                                    console.log("parselist err");
                                });
                        }
                    },
                    error: function(httpResponse) {
                        console.error('Request failed with response code ' + httpResponse.status);
                    }
                }).then(function(){
                    response.success(res);
                });

            })
        });
    response.success("done");
});
