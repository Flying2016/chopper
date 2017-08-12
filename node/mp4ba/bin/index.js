/**
 * Created by owen on 2017/8/12.
 */

const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');
const logger = require('../utils/log');

class Spider {
    constructor() {
        this.pageUrlStart = '';
        this.pageNumberLimit = '';
    }

    loadConfig() {
        return this;
    }


    init() {
        return this;
    }

    fetch() {
        let url = `${this.seedUrl}${pageNumber}`;
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
                return;
            }
            cb(body)
        });
    }

    parsePage(html) {
        let $, name, src;
        $ = cheerio.load(html)
        name = $('#viewvideo-title').text();
        src = $('#vid source').attr('src');
        logger.info(`collected: ${name.replace(/\n/g, '')} -- ${src}`);
        this.storeVideoUrl(name, src);
        this.fetch(this.videoPageUrlList.pop(), this.parsePage.bind(this))
    }


    save() {
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

    run() {

    }
}

module.exports = Spider;