require("cloud/app.js");
// Use AV.Cloud.define to define as many cloud functions as you want.
// For example:
var cheerio = require('cheerio');
var https = require('https');
/**
 * create new class according to different pages
 */
var BreadInfo = AV.Object.extend("BreadInfo");
var QunarInfo = AV.Object.extend("QunarInfo");
var DaoDaoInfo = AV.Object.extend("DaodaoInfo");

/**
 *breadtrip,done
 * @type {{starturl: string, eachitem: string, title: string, startdate: string, duration: string, author: string, pre_url: string, needpre: string, authorindetail: string, detailitem: string, date: string, detaildescription: string}}
 */
var rules_breadtrip = {
    //for test
    "starturl":"http://breadtrip.com/explore/",
    "testurl":"http://breadtrip.com/trips/2388187734/",
    //save
    "class":"new BreadInfo()",
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
 *qunar,done
 * @type {{starturl: string, eachitem: string, title: string, startdate: string, duration: string, description: string, author: string, pre_url: string, needpre: string, authorindetail: string, detailitem: string, date: string, detaildescription: string}}
 */
var rules_qunar = {
    "starturl":"http://travel.qunar.com/travelbook/list.htm?order=hot_heat",
    "testurl":"http://travel.qunar.com/youji/5305677",
    //save
    "class":"new QunarInfo()",
    //in list
    "eachitem":".list_item",
    "pre_url":"http://travel.qunar.com",
    "needpre":"1",
    //"title":".tit",
    "title":"$(e).find('.tit').text()",
    //"author":"",
    "author":".user_name",
    //"startdate":".date",
    "startdate":"$(e).find('.date').text()",
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
 *daodao,done
 * @type {{starturl: string, testurl: string, class: string, eachitem: string, pre_url: string, needpre: string, title: string, startdate: string, duration: string, brief: string, description: string, author: string, authorindetail: string, detailitem: string, date: string, detaildescription: string}}
 */
var rules_daodao = {
    "starturl":"http://www.daodao.com/TourismBlog-g294217-Hong_Kong.html",
    "testurl":"http://www.daodao.com/TourismBlog-t1505.html",
    //save
    "class":"new DaodaoInfo()",
    //in list
    "eachitem":"li",
    "pre_url":"http://www.daodao.com",
    "needpre":"1",
    //"title":".title",
    "title":"$(e).find('.title').text()",
    //"startdate":".date",
    "startdate":"$(e).find('.date').text()",
    //"duration":".days",
    "duration":"$(e).find('.days').text()",
    //"brief":".geo",
    "brief":"$(e).find('geo').text()",
    //"description":".places",
    "description":"$(e).find('.info').text()",
    "author":".user_name",

    //in detail
    "authorindetail":".trip-user",
    "detailitem":".strategy-content",
    //".date":".time",
    "date":"$(e).find('.time').text()",
    //"detaildescription":".text"
    "detaildescription":"$(e).find('.strategy-contents').text()"
};

/**
 * ctrip,done
 * .journal-item? .li
 * @type {{starturl: string, testurl: string, class: string, eachitem: string, pre_url: string, needpre: string, title: string, startdate: string, duration: string, brief: string, description: string, author: string, authorindetail: string, detailitem: string, date: string, detaildescription: string}}
 */
var rules_ctrip = {
    "starturl":"http://you.ctrip.com/travels/",
    "testurl":"http://you.ctrip.com/travels/wuhan145/2280770.html",
    //save
    "class":"new CtripInfo()",
    //in list
    "eachitem":".city",
    "pre_url":"http://you.ctrip.com",
    "needpre":"1",
    //"title":"h3",
    "title":"$(e).find('.cpt').text()",
    //"author":"",
    "author":"$(e).find('.author').find('a').eq(1).text()",
    //"startdate":".date",
    "startdate":"$(e).find('.fr').find('i').text()",
    //"duration":".days",
    "duration":"$(e).find('.days').text()",
    //"brief":".geo",
    "brief":"$(e).find('.item-short').text()",
    //"description":".places",
    "description":"$(e).text()",

    //in detail
    "authorindetail":".trip-user",
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
    "starturl":"http://place.qyer.com/",
    "testurl":"http://place.qyer.com/mguide/2742",
    //save
    "class":"qyer",
    //in list
    "eachitem":".piclist li",
    "pre_url":"http://www.qyer.com",
    "needpre":"0",
    //"title":".title",
    "title":"$(e).find('.title').find('span').text()",
    //"startdate":".date",
    "startdate":"$(e).find('.date').text()",
    //"duration":".days",
    "duration":"$(e).find('.day').text()",
    //"brief":".geo",
    "brief":"$(e).find('.fontYaHei').text()",
    //"description":".places",
    "description":"$(e).find('.fontYaHei').text()",
    "author":"$(e).find('.name').text()",

    //in detail
    "authorindetail":".trip-user",
    "detailitem":".mg-left",
    //".date":".time",
    "date":"$(e).find('.day_time').text()",
    //"detaildescription":".text"
    "detaildescription":"$(e).find('ul').text()"
};

/**
 * chanyou done
 * parse detail
 * @type {{starturl: string, testurl: string, class: string, eachitem: string, pre_url: string, needpre: string, title: string, startdate: string, duration: string, brief: string, description: string, author: string, authorindetail: string, detailitem: string, date: string, detaildescription: string}}
 */
var rules_chanyou = {
    "starturl":"http://chanyouji.com/trips/",
    "testurl":"http://chanyouji.com/trips/207033",
    //regax
    "regax":"1",
    //save
    "class":"chanyouji",
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
    "brief":"$(e).find('geo').text()",
    //"description":".places",
    "description":"$(e).find('.info').text()",
    "author":".user_name",

    //in detail
    "authorindetail":".trip-user",
    "detailitem":".trips-wraper",
    //".date":".time",
    "date":"$(e).find('.day-date').text().split(' ')[0]",
    //"detaildescription":".text"
    "detaildescription":"$(e).find('script')"
};

/**
 * 117go,done
 * day and item are in one level can not handle
 * @type {{starturl: string, testurl: string, class: string, eachitem: string, pre_url: string, needpre: string, title: string, startdate: string, duration: string, brief: string, description: string, author: string, authorindetail: string, detailitem: string, date: string, detaildescription: string}}
 */
var rules_117go = {
    "starturl":"http://www.117go.com",
    "testurl":"http://www.117go.com/tour/53856965",
    "regex":"2",
    //save
    "class":"117go",
    //in list
    "eachitem":".tours-item-wrapper-wrap",
    "pre_url":"http://www.117go.com",
    "needpre":"1",
    //"title":".title",
    "title":"$(e).find('.tours-item-title-content').text()",
    //"startdate":".date",
    "startdate":"$(e).find('.trip-date').text()",
    //"duration":".days",
    "duration":"$(e).find('.trip-date').text()",
    //"brief":".geo",
    "brief":"$(e).find('.tours-item-cities').text()",
    //"description":".places",
    "description":"$(e).find('.tours-item-cities').text()",
    "author":".user_name",
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
 * done
 *tuniu
 * @type {{starturl: string, testurl: string, class: string, eachitem: string, pre_url: string, needpre: string, title: string, startdate: string, duration: string, brief: string, description: string, author: string, authorindetail: string, detailitem: string, date: string, detaildescription: string}}
 */
var rules_tuniu = {
    "starturl":"http://trips.tuniu.com/",
    "testurl":"http://www.tuniu.com/trips/10011491",
    //save
    "class":"tuniu",
    //in list
    "eachitem":".hot-main-square",
    "pre_url":"http://trips.tuniu.com/",
    "needpre":"0",
    //"title":".title",
    "title":"$(e).find('.note-title').text()",
    //"startdate":".date",
    "startdate":"$(e).find('.reader-info').find('span').text()",
    //"duration":".days",
    "duration":"$(e).find('.trip-date').text().split('|')[1].split('天')[0]",
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
 * done
 *lvmama
 * @type {{starturl: string, testurl: string, class: string, eachitem: string, pre_url: string, needpre: string, title: string, startdate: string, duration: string, brief: string, description: string, author: string, authorindetail: string, detailitem: string, date: string, detaildescription: string}}
 */
var rules_lvmama = {
    "starturl":"http://www.lvmama.com/trip/",
    "testurl":"http://www.lvmama.com/trip/show/50043",
    //save
    "class":"lvmama",
    //in list
    "eachitem":"dl",
    "pre_url":"http://www.lvmama.com",
    "needpre":"0",
    //"title":".title",
    "title":"$(e).find('.title').text()",
    //"startdate":".date",
    "startdate":"$(e).find('.uploadInfo').text().split('|')[1]",
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
    //var rules = rules_qunar;
    var url = rules.starturl;
    console.log(rules);
    console.log(url);
    var res=[];
    /*AV.Cloud.httpRequest({})
        .then(function(httpResponse){
            var results = [];
            results.forEach(function(result){
                var query = new AV.Query(BreadInfo);
                query.equalTo("url", pageurl);
                query.first().then(function(exists){
                    return AV.Cloud.run("parsecontent1",{url:pageurl});
                }).then(function(){

                }).then(function(){

                },function(err){

                })
            })
        },function(err){

        })*/


    AV.Cloud.httpRequest({
        url: url,
        success: function(httpResponse) {
            var page = httpResponse.text;
            $=cheerio.load(page);
            $(rules.eachitem).each(function(i,e){
                //save outline info
                var ans={};
                var pageurl;
                if(rules.needpre==1)
                    pageurl = rules.pre_url + $(e).find('a').attr('href');
                else
                    pageurl =  $(e).find('a').attr('href');
                ans.type="tour";
                ans.url = pageurl;
                ans.title = eval(rules.title);
                ans.startdate = eval(rules.startdate);
                ans.duration = eval(rules.duration);
                ans.description = eval(rules.description);
                console.log(ans);
                /*ans.title=$(e).find(rules.title).text();
                 ans.startdate=$(e).find(rules.startdate).text();
                 ans.duration=$(e).find(rules.duration).text();
                 ans.description=$(e).find(rules.description).text();*/
                res.push[ans];
                //find url
                /*var query = new AV.Query(BreadInfo);
                query.equalTo("url", pageurl);
                //if find,do nothing
                query.find().then(function(results){
                },function(error){
                    //elee parsedetail
                    AV.Cloud.run("parsecontent1",{url:pageurl}, {
                        success: function (data) {
                            ans.tours = data;
                        },
                        error: function (err) {
                        }
                    }).then(function(){
                        saveInfo(ans);
                    })

                    AV.Cloud.run("parsecontent1",{url:pageurl})
                        .then(function(data){
                            ans.tours = data;
                            return saveInfo(ans);
                        },function(err) {
                            // parser failed
                        })
                        .then(function(){
                            // save completed
                        },function(err){
                            // save failed
                        })
                });*/
            });
        },
        error: function(httpResponse) {
            console.error('Request failed with response code ' + httpResponse.status);
        }
    }).then(function(){
        response.success(res);
        //console.log(res);
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
    var url = rules.testurl;
    var res=[];
    console.log(url);
    AV.Cloud.httpRequest({
        url: url,
        success: function(httpResponse) {
            var page = httpResponse.text;
            $=cheerio.load(page);

           // var str = /(?=parse)/;
            if(rules.regax==1){
                var tmp =  page.replace(/[.\S\s]*TripsCollection\(/,"").replace(/\,\{parse.+/,"");
                var arr = JSON.parse(tmp);
                var index = -1;
                var ans = {};
                for(var item in arr){
                    //console.log(arr[item].sid);
                    if(arr[item].weather==0){
                        index ++;
                        ans.index = index;
                        ans.date = arr[item].trip_date;
                        ans.description = "";
                        res.push(ans);
                        ans={};
                    }else{
                        res[index].description =  res[index].description + arr[item].description + "\n\r";
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
                    console.log(idstr);
                    $(e).parent().find(idstr).each(function (i, e) {
                        var idx = $(e).attr("data-feed");
                        var str = "[id=tFeed" + idx + "]";
                        var pt = $(e).parent().parent().find(str).find(".t-feed-words").text();
                        des = des + pt + "\n\r";
                    });
                    ans.description = des;
                    console.log(ans);
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
    var deatilInfo = new DeatilInfo();
    deatilInfo.set("type","tour");
    deatilInfo.set("url",ans.url);
    deatilInfo.set("title",ans.title);
    deatilInfo.set("stardate",ans.startdate);
    deatilInfo.set("duration",ans.duration);
    deatilInfo.set("description",ans.description);
    deatilInfo.set("tours",ans.tours);
    return deatilInfo.save();
}
/**
 *
 */
AV.Cloud.define("hello",function(request,response){
    var url = request.params.url;
     response.success("success");
});