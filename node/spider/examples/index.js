/**
 * Created by owen on 2017/8/5.
 */
var fs = require('fs');
var request = require("request");
var cheerio = require("cheerio");
var mkdirp = require('mkdirp');
var path = require('path');
var http = require("http");
var log4js = require('log4js');
var async = require('async');
var cluster = require('cluster');
var numCPUs = require('os').cpus().length;


class Logger {
    constructor() {
        this.engine = console;
    }

    log(e) {
        this.engine.log(e)
    }

    dir(e) {
        this.engine.dir(e)
    }

    error(e) {
        this.engine.log(e)
    }
}

class Store {
    constructor() {

    }
}

class Spider {
    constructor(seedUrl, storePath = './images/') {
        this.seedUrl = seedUrl;
        this.storePath = storePath;
        this.urlPool = [];
        this.ruleMap = {};
        this.logger = (new Logger());
    }

    init() {
        this.urlPool.push(this.seedUrl);
        mkdirp(this.storePath, function (err) {
            if (err) {
                console.log(err);
            }
        });
        return this;
    }

    addUrl(url) {
        this.urlPool.push(url);
    }


    fetch(url) {
        //发送请求
        request(url, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                this.logger.log(`download ${url} is successful!`);
                this.parse(url, body);
            } else {
                this.logger.log(error);
            }
        });
    }

    parse(url, html) {
        this.logger.log('开始解析！');
        let $ = cheerio.load(html);
        let instance = this;
        $('a').each(function () {
            let href = $(this).attr('href');
            if (href.split('/').pop().indexOf('.') !== -1) {
                instance.logger.log(`加入url队列 ${href}`);
                instance.addUrl(href)
            }
        });
        $('img').each(function () {
            let src = $(this).attr('src');
            let filename = src.split('/').pop();
            instance.logger.log(`加入下载文件：图片队列 ${src}`);
            instance.download(src, instance.storePath, filename);
        });
    }

    download(url, _path, filename) {
        this.logger.log(`开始下载 ${url}`);
        http.get(url, (res) => {
            let imgData = "";
            res.setEncoding("binary")
                .on("data", (chunk) => {
                    imgData += chunk;
                })
                .on("end", () => {
                    fs.writeFile(`${this.storePath}${filename}`, imgData, "binary", function (err) {
                        if (err) {
                            console.log("down fail");
                        }
                        console.log("down success");
                    });
                });
        });
    }


    rules() {

    }

    register(ruleName, ruleFn) {
        if (!ruleName || !ruleFn) {
            this.logger.error('注册规则失败');
            throw "注册规则失败";
        }
        this.ruleMap[ruleName] = ruleFn;
        return this;
    }


    run() {
        while (this.urlPool.length) {
            this.fetch(this.urlPool.shift())
        }
        this.logger.log('pool is empty,so exit');
    }

}

//
// (new Spider('http://www.mzitu.com/zipai/'))
//     .init()
//     .run();

const child_process = require('child_process');
const x = child_process.fork(`${__dirname}/worker/parse.js`);

x.on('message', (m) => {
    console.log('PARENT got message:', m);
});

x.send({hello: 'world'});
