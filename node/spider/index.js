/**
 * Created by owen on 2017/8/5.
 */
const fs = require('fs');
const request = require("request");
const cheerio = require("cheerio");
const mkdirp = require('mkdirp');
const path = require('path');
const http = require("http");
const log4js = require('log4js');
const async = require('async');
const cluster = require('cluster');
const numCpus = require('os').cpus().length;
const child_process = require('child_process');
const x = child_process.fork(`${__dirname}/worker/parse.js`);


class Spider {
    constructor(seedUrl, storePath = './images/') {
        this.seedUrl = seedUrl;
        this.storePath = storePath;
        this.urlPool = [];
        this.ruleMap = {};
    }

    /***
     * 可以初始化应用
     * 启动各个进程
     * @returns {Spider}
     */
    init() {
        this.urlPool.push(this.seedUrl);
        mkdirp(this.storePath, function (err) {
            if (err) {
                console.log(err);
            }
        });
        return this;
    }

    /***
     * scheduler ？添加url
     * @param url
     */
    addUrl(url) {
        this.urlPool.push(url);
    }


    /***
     * 可以做成一个进程
     * @param url
     */
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

    /***
     * 将这个做成一个进程
     * @param url
     * @param html
     */
    parse(url, html) {
        this.logger.log('开始解析！');
        let $ = cheerio.load(html);
        let instance = this;
        $('a').each(function () {
            let href = $(this).attr('href');
            if (href.split('/').pop().indexOf('.') !== -1) {
                instance.logger.log(`加入爬行队列 ${href}`);
                instance.addUrl(href)
            }
        });
        $('img').each(function () {
            let src = $(this).attr('src');
            let filename = src.split('/').pop();
            instance.logger.log(`加入下载文件： ${src}`);
            instance.download(src, instance.storePath, filename);
        });
    }

    store(_path, _filename, data) {
        fs.writeFile(`${_path}${_filename}`, data, "binary", function (err) {
            if (err) {
                console.log(`store ${_filename} fail`);
            }
            console.log(`store ${_filename} success`);
        });
    }

    /***
     * 一个下载方法可以作为工具类
     * 同时还应该补充许多
     * @param url
     * @param _path
     * @param filename
     */
    download(url, _path, filename) {
        this.logger.log(`开始下载 ${url}`);
        try {
            http.get(url, (res) => {
                let imgData = "";
                res.setEncoding("binary")
                    .on("data", (chunk) => {
                        imgData += chunk;
                    })
                    .on("end", () => {
                        this.store(this.storePath, filename, imgData)
                    });
            });

        } catch (e) {
            throw new Error(10, "download error")
        }
    }

    /***
     * 添加规则
     * @param ruleName
     * @param ruleFn
     * @returns {Spider}
     */
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


(new Spider('http://www.mzitu.com/zipai/'))
    .init()
    .run();


x.on('message', (data) => {
    console.log('PARENT got message:', data);
});

x.send({hello: 'world'});
