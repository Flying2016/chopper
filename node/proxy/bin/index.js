/**
 * Created by owen-carter on 17/8/9.
 */

const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');
const logger = require('../utils/log');

class Spider {
    constructor(seedUrl) {
        // 首页地址
        this.seedUrl = seedUrl;
        // filename
        this.filename = './ip.txt';
        // 限制页面条数
        this.pageNumberLimit = 6;
        // 有效代理地址池
        this.validProxyUrlPool = [];
        // 代理页面分页页码
        this.proxyPageNumber = 1;
        // 代理页面分页页码上限
        this.proxyPageNumberLimit = 200;
    }

    // touch file [./url.csv] if not exist /data
    init() {
        return this;
    }


    searchProxy(pageNumber = 1, cb) {
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

    parseProxy(html) {
        let proxyUrlList = [];
        let $ = cheerio.load(html);
        let trList = $("#ip_list tr");
        let tr;
        let tdList;
        let speed;
        let connectTime;
        for (let i = 1; i < trList.length; i++) {
            let proxy = {};
            tr = trList.eq(i);
            tdList = tr.children("td");
            proxy['ip'] = tdList.eq(1).text();
            proxy['port'] = tdList.eq(2).text();
            speed = tdList.eq(6).children("div").attr("title");
            speed = speed.substring(0, speed.length - 1);
            connectTime = tdList.eq(7).children("div").attr("title");
            connectTime = connectTime.substring(0, connectTime.length - 1);
            //用速度和连接时间筛选一轮
            if (speed <= 5 && connectTime <= 1) {
                logger.info(`find a nice proxy ${proxy['ip']}:${proxy['port']}`);
                proxyUrlList.push(proxy);
            }
        }
        // 过滤地址
        logger.info('start filter proxy url...');
        this.filterProxy(proxyUrlList);

    }

    filterProxy(proxyUrlList) {
        let url = "http://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js";
        let tasks = proxyUrlList.length;
        for (let i = 0; i < proxyUrlList.length; i++) {
            let proxy = proxyUrlList[i];
            logger.info(`start filter proxy url ${proxy['ip']}:${proxy['port']}...`);
            request({
                url: url,
                proxy: "http://" + proxy['ip'] + ":" + proxy['port'],
                method: 'GET',
                timeout: 20 * 1000 * 4 / 20
            }, (error, response, body) => {
                tasks--;
                let href;
                if (error) {
                    return;
                }
                if (response.statusCode == 200) {
                    href = response.request['proxy']['href'];
                    this.validProxyUrlPool.push(href);
                    this.storeProxy(href);
                    logger.info(`find a useful proxy : ${href}`);
                } else {
                    logger.error(`find a bad proxy ${response.request['proxy']['href']}`);
                }
                if (tasks === 0) {
                    if (this.proxyPageNumber < this.proxyPageNumberLimit) {
                        this.searchProxy(this.proxyPageNumber++, this.parseProxy.bind(this));
                    }
                }
            });
        }

    }

    /***
     * 存储随意格式
     */
    storeProxy(line) {
        let filename = './ip.txt';
        logger.info(`store ${line} to ip.txt`);
        this.save(filename, line)
    }


    save(filename, line) {
        fs.exists(filename, (exists) => {
            if (exists) {
                fs.appendFile(filename, `${line}\n`, 'utf8', (err) => {
                    if (err) throw err;
                    logger.info(`${line} appendTo ${filename} success!`);
                });
            } else {
                fs.appendFile(filename, ``, 'utf8', (err) => {
                    if (err) throw err;
                    logger.error(`${filename} does not exist,so create it,and succeed!`);
                });
            }

        });

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
     * 启动
     */
    run() {
        this.searchProxy(this.proxyPageNumber, this.parseProxy.bind(this));
    }


}


module.exports = Spider;