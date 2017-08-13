/**
 * Created by owen-carter on 17/8/9.
 */
const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');
const readline = require('readline');
const uri = require('url');
const logger = require('../utils/log');


class Spider {
    constructor(seedUrl) {
        // 首页地址
        this.seedUrl = seedUrl;
        this.filename = './url.csv';
        // 限制页面条数
        this.pageNumberLimit = 6;
        // 分页页面地址池
        this.pageUrlList = [];
        // 视频页页面地址池
        this.videoPageUrlList = [];
        // 有效代理地址池
        this.validProxyUrlPool = [];
    }

    /***
     *
     * @returns {Spider}
     */
    init() {
        this.createFile(this.filename);
        this.loadProxy(this.run.bind(this));
        return this;
    }


    /***
     * 去除前后空格，方便存储
     * @param str
     * @returns {*}
     */
    static chMop(str) {
        if (str) {
            return str.replace(/(^\s*)|(\s*$)/g, "")
        }
        return '';
    }

    /***
     * 加载代理
     * @param runCallBack
     */
    loadProxy(runCallBack) {
        let lineReader = readline.createInterface({
            input: fs.createReadStream('./ip.txt'),
            output: process.stdout
        });
        lineReader.on('line', (line) => {
            logger.info(`load a ip: ${line}`);
            this.validProxyUrlPool.push(line)
        });
        lineReader.on('close', () => {
            runCallBack()
        })
    }


    /***
     * 创建文件，如果不存在
     * @param filename
     */
    createFile(filename) {
        fs.exists(filename, (exists) => {
            if (exists) {
                return;
            }
            fs.appendFile(filename, '', 'utf8', (err) => {
                if (err) throw err;
                logger.info(`${filename}does not exist,create ${filename} success!`);
            });

        });
    }


    /***
     * 获取随机代理从代理池中
     * @returns {{host: *, port: *}}
     */
    getRandomProxy() {
        let magicNumber = Math.floor(Math.random() * this.validProxyUrlPool.length + 1) - 1;
        let url = this.validProxyUrlPool[magicNumber];
        let urlObject = uri.parse(url);
        logger.info(`get a proxy ${urlObject['hostname']}:${urlObject['port']}...`);
        return {
            host: urlObject['hostname'],
            port: urlObject['port'],
        }
    }

    /***
     * 公共的get方法，有一个回掉参数，需要注意，应该做一下回掉函数的有效性判断
     * @param url {string}
     * @param cb {function}
     */
    fetch(url, cb) {
        let proxy = this.getRandomProxy();
        let opt = {
            host: proxy['host'],
            port: proxy['port'],
            method: 'get',
            url: url
        };
        if (!url) {
            logger.error('url is null');
            return;
        }
        logger.info(`start to fetch ${url}...`);
        request(opt, function (err, res, body) {
            if (err) {
                console.log(err)
            } else {
                logger.info(`got the page ${url}...`);
                cb(body)
            }
        });
    }

    /***
     * 解析应用的首页地址，目的是为了得到起始地址
     * @param html {string}
     * @returns {*|jQuery}
     */
    parseIndex(html) {
        logger.info('start parse the index page....');
        // logger.info(html);
        let $ = cheerio.load(html);
        let href = $('#navcontainer li:nth-child(3) a').attr('href');
        logger.info(`index page href is ${href}`);
        return href;
    }

    /***
     * 根据起始地址，制作目标地址池
     * @param startUrl
     * @returns {Array}
     */
    makePageUrlList(startUrl) {
        let href, j;
        logger.info('start make the page url list....');
        for (j = 1; j < this.pageNumberLimit; j++) {
            href = startUrl + '&page=' + j;
            this.pageUrlList.push(href)
        }
        for (let i = 0; i < this.pageUrlList.length; i++) {
            logger.info(`page url nth:${i} is ${this.pageUrlList[i]}`);
        }
        return this.pageUrlList;
    }

    /***
     * 解析当前页面中所有的视频页面地址
     * @param html
     */
    parsePage(html) {
        // logger.info(html);
        let $ = cheerio.load(html);
        let href;
        let feedUrl;
        logger.info('start parse the page....');
        $('#videobox .listchannel>div>a').each((index, element) => {
            href = $(element).attr('href');
            logger.info(`parsed a href : ${href}`);
            this.videoPageUrlList.push(href)
        });
        feedUrl = this.pageUrlList.pop();
        if (this.pageUrlList.length) {
            this.fetch(feedUrl, this.parsePage.bind(this))
        } else {
            this.fetch(this.videoPageUrlList.pop(), this.parseVideo.bind(this))
        }
    }


    /***
     * 解析页面视频地址
     * @param html
     */
    parseVideo(html) {
        let $, name, src;
        $ = cheerio.load(html)
        name = $('#viewvideo-title').text();
        src = $('#vid source').attr('src');
        logger.info(`collected: ${name.replace(/\n/g, '')} -- ${src}`);
        this.storeVideoUrl(name, src);
        this.fetch(this.videoPageUrlList.pop(), this.parseVideo.bind(this))
    }

    /***
     * 存储视频地址
     */
    storeVideoUrl(name, src) {
        let line;
        name = Spider.chMop(name);
        src = Spider.chMop(src);
        line = `${name.replace(/\n/g, '')},${src}\n`;
        line = src;
        logger.info(`store a : ${line}`);
        this.save(this.filename, line)
    }

    /***
     * 按行存储
     * @param filename
     * @param line
     */
    save(filename, line) {
        fs.exists(filename, (exists) => {
            if (exists) {
                fs.appendFile(filename, `${line}\n`, 'utf8', (err) => {
                    if (err) throw err;
                    logger.info(`${line} appendTo ${filename} success!`);
                });
            } else {
                logger.error(`${filename} does not exist,so create it,and succeed!`);
            }

        });

    }

    /***
     * 启动
     */
    run() {
        this.fetch(this.seedUrl, (html) => {
            let startUrl = this.parseIndex(html);
            this.makePageUrlList(startUrl);
            this.fetch(this.pageUrlList.shift(), this.parsePage.bind(this))
        })
    }

}


module.exports = Spider;