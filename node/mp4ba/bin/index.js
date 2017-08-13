/**
 * Created by owen on 2017/8/12.
 */

const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');
const logger = require('../utils/log');


class Spider {
    /***
     * define all configure
     */
    constructor() {
        this.pageUrlStart = '';
        this.pageNumberLimit = '';
        this.urlPool = [];
    }

    /***
     * 加载配置
     * @returns {Spider}
     */
    loadConfig() {
        return this;
    }


    /***
     * 初始化战场
     * @returns {Spider}
     */
    init() {
        this.urlPool = this.makeUrls();
        return this;
    }

    makeUrls() {
        let urlList = [];
        for (let i = 1; i < this.pageNumberLimit; i++) {
            urlList.push(`http://www.mp4ba.net/forum-mp4ba-${i}.html`)
        }
        return urlList;
    }

    fetch(url, callBack) {
        let url = `${url}`;
        let conf = {
            url: url,
            method: "GET",
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36'
            }
        };
        logger.info(`start access proxy ${url}`);
        request(conf, (error, response, body) => {
            if (error) {
                logger.error(`get page ${url} fail`);
                return;
            }
            logger.info(`gotten a page ${url}`);
            callBack(body)
        });
    }

    /***
     * 解析分页页面
     * @param html
     */
    parsePage(html) {
        let $, name, src;
        $ = cheerio.load(html)
        name = $('#viewvideo-title').text();
        src = $('#vid source').attr('src');
        logger.info(`collected: ${name.replace(/\n/g, '')} -- ${src}`);
        this.save(name, link);
        this.fetch(this.videoPageUrlList.pop(), this.parsePage.bind(this))
    }

    /***
     * 解析视频页面磁链地址
     */
    parseMagnet(html) {
        let $, name, src;
        $ = cheerio.load(html);
        name = $('#viewvideo-title').text();
        src = $('#vid source').attr('src');
        logger.info(`collected: ${name.replace(/\n/g, '')} -- ${src}`);
        this.save(name, link);
        this.fetch(this.videoPageUrlList.pop(), this.parsePage.bind(this))
    }


    /***
     * 保存文件
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
        if (this.urlPool.length === 0) {
            logger.error('urlPool is empty! exited');
            return;
        }
        this.fetch(this.urlPool.pop(), this.parsePage.bind(this))
    }
}

module.exports = Spider;