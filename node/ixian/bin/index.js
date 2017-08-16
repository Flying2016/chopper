/**
 * Created by owen on 2017/8/12.
 */

const fs      = require('fs');
const request = require('request');
const cheerio = require('cheerio');
const iconv   = require('iconv-lite');
const logger  = require('../utils/log');

class Spider {
    /***
     * define all configure
     */
    constructor() {
        this.filename         = './magnet.csv';
    }

    /***
     * 加载配置
     * @returns {Spider}
     */
    loadConfig(conf) {

        return this;
    }

    url(fn) {
        return this;
    }

    /***
     * 初始化战场
     * @returns {Spider}
     */
    init() {
        return this;
    }


    /***
     *
     * @param href
     * @returns {*}
     */
    wget(href) {
        href     = `${href}`;
        let conf = {
            url     : href,
            method  : "GET",
            encoding: null,
            headers : {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36'
            }
        };
        logger.info(`start access proxy ${href}`);
        return request(conf);
    }

    async parseIt() {
        var f1 = await wget('/etc/fstab');
        var f2 = await wget('/etc/shells');
        console.log(f1.toString());
        console.log(f2.toString());
    }


}

module.exports = Spider;