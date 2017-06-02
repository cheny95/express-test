var express = require('express');
var router = express.Router();
var Q = require('q');
var http = require('http');
var querystring = require('querystring');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express1111'});
});

router.get('/news', function (req, res) {
    var type = req.query.type ? req.query.type : '';
    var params = {
        key: '7194c10704cdc10c3b261317ccf80e20',
        type: type
    };
    //类型
    var newsType = {
        top: '头条',
        shehui: '社会',
        guonei: '国内',
        guoji: '国际',
        yule: '娱乐',
        tiyu: '体育',
        junshi: '军事',
        keji: '科技',
        caijing: '财经',
        shishang: '时尚'
    };
    getNews(params).then(function (data) {
        console.log('数据输出:' + data);
        var data = JSON.parse(data);
        res.render('news', {title: data.result.data[0].category + '新闻', data: data.result.data});
    });
});

function getNews(params) {
    var defer = Q.defer();
    var post_options = {
        host: 'v.juhe.cn',
        port: '80',
        path: '/toutiao/index',
        method: 'post',
        data: params,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    var post_data = querystring.stringify(params);
    var post_req = http.request(post_options, function (res) {
        res.setEncoding('utf8');
        var data = "";
        res.on('data', function (chunk) {
            data += chunk;
        });
        res.on('end', function () {
            defer.resolve(data);
        });
    });
    post_req.write(post_data);
    post_req.end();
    return defer.promise;
}

module.exports = router;
