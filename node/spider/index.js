/**
 * Created by owen on 2017/8/5.
 */
const fs = require('fs');
const request = require("request");
const cheerio = require("cheerio");
const mkdirp = require('mkdirp');
const path = require('path');
const http = require("http");
const child_process = require('child_process');
const numCpus = require('os').cpus().length;
const logger = require('./utils/log.js');

class Spider {
    constructor(seedUrl, storePath = './images/') {
        this.seedUrl = seedUrl;
        this.storePath = storePath;
        this.urlPool = [];
        this.ruleMap = {};
        this.parse = null;
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
                // logger.error(err)
            }
        });

        // this.parse = child_process.fork(`./lib/parse.js`);
        // this.listen();
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
                // logger.info(`download ${url} is successful!`);
                console.dir('parse')
                this.parse(url, body);
            } else {
                // logger.info(error);
            }
        });
    }

    /***
     * 将这个做成一个进程
     * @param url
     * @param html
     */
    parse(url, html) {
        // logger.info('开始解析！');
        let $ = cheerio.load(html);
        let instance = this;
        $('a').each(function () {
            let href = $(this).attr('href');
            if (href.split('/').pop().indexOf('.') !== -1) {
                // logger.info(`加入爬行队列 ${href}`);
                instance.addUrl(href)
            }
        });
        $('img').each(function () {
            let src = $(this).attr('src');
            let filename = src.split('/').pop();
            // logger.info(`加入下载文件： ${src}`);
            instance.download(src, instance.storePath, filename);
        });
    }

    store(_path, _filename, data) {
        fs.writeFile(`${_path}${_filename}`, data, "binary", function (err) {
            if (err) {
                // logger.error(`store ${_filename} fail`);
            }
            // logger.info(`store ${_filename} success`);
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
        // logger.info(`开始下载 ${url}`);
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

    listen() {
        this.parse.on('message', (data) => {
            console.log('PARENT got message:', data);
        });
    }

    send(message = {}) {
        this.parse.send(message);
    }


    run() {
        // logger.debug('pool is empty,so exit');
        while (this.urlPool.length) {
            this.fetch(this.urlPool.shift())
        }
        // logger.info('pool is empty,so exit');
    }

}


(new Spider('http://www.mzitu.com/zipai/'))
    .init()
    .run();


