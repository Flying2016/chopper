/**
 * Created by owen on 2017/8/5.
 */
const fs = require('fs');
const http = require("http");
const path = require('path');
const mkdirp = require('mkdirp');
const log4js = require('log4js');
const request = require("request");
const cheerio = require("cheerio");
const child_process = require('child_process');


log4js.configure({
    categories: {
        default: {
            appenders: ['spider', 'out'],
            level: 'info'
        }
    },
    appenders: {
        out: {type: 'stdout'},
        spider: {
            type: 'file',
            filename: './spider.log'
        }
    }
});

const logger = log4js.getLogger('spider');

class Spider {
    constructor(seedUrl, storePath = './images/') {
        this.seedUrl = seedUrl;
        this.storePath = storePath;
        this.urlPool = [];
        this.ruleMap = {};
        this.cp = null;
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
                logger.error(err)
            }
        });

        // 目标把这个作为解析进程或者爬行的子进程，进一步学习多进程通信
        this.cp = child_process.fork(`./lib/parse.js`);
        this.listen();
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
     * 可以做成一个进程，爬行进程
     * @param url
     */
    fetch(url) {
        //发送请求
        request(url, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                logger.info(`download ${url} is successful!`);
                this.parse(url, body);
                this.send(body)
            } else {
                logger.error(error);
            }
        });
    }

    /***
     * 将这个做成一个进程
     * @param url
     * @param html
     */
    parse(url, html) {
        logger.info('开始解析！');
        let $ = cheerio.load(html);
        let instance = this;


        try {
            $('a').each(function () {
                let href = $(this).attr('href');
                let suffix = href.split('/').pop();
                if (suffix && suffix.indexOf('.') !== -1) {
                    logger.info(`加入爬行队列 ${href}`);
                    instance.addUrl(href)
                }
            });
        } catch (e) {
            logger.error(`出错了： ${e}`);
        }

        try {
            $('img').each(function () {
                let src = $(this).attr('src');
                let filename = src.split('/').pop();
                logger.info(`加入下载文件： ${src}`);
                instance.download(src, instance.storePath, filename);
            });
        } catch (e) {
            logger.error(`出错了： ${e}`);
        }
    }

    /***
     * 储存图片转到下载中心
     * @param _path
     * @param _filename
     * @param data
     */
    store(_path, _filename, data) {
        fs.writeFile(`${_path}${_filename}`, data, "binary", function (err) {
            if (err) {
                logger.error(`store ${_filename} fail`);
            }
            logger.info(`store ${_filename} success`);
        });
    }

    /***
     * 一个下载方法可以作为工具类
     * 同时还应该补充许多别的共有方法
     * @param url
     * @param _path
     * @param filename
     */
    download(url, _path, filename) {
        logger.info(`开始下载 ${url}`);
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
            logger.error('download error', e);
        }
    }

    listen() {
        this.cp.on('message', (data) => {
            logger.info('主进程收到分析进程的url:', data);
            this.addUrl(data);
            this.fetch(this.urlPool.shift());

        });
    }

    send(message = {}) {
        this.cp.send(message);
    }


    run() {
        logger.info('start to crawl.....');
        this.fetch(this.urlPool.shift())
        setInterval(() => {
            if (this.urlPool.length !== 0) {
                this.fetch(this.urlPool.shift())
            }
        }, (60 * 1000 ) * 5)
    }

}


(new Spider('http://www.mzitu.com/'))
    .init()
    .run();


