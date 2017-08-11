/**
 * Created by owen-carter on 17/8/9.
 */
const fs      = require('fs');
const request = require('request');
const cheerio = require('cheerio');
const log4js  = require('log4js');


log4js.configure({
    categories: {
        default: {
            appenders: ['spider', 'out'],
            level    : 'info'
        }
    },
    appenders : {
        out   : {type: 'stdout'},
        spider: {
            type    : 'file',
            filename: './spider.log'
        }
    }
});

const logger = log4js.getLogger('spider');


export default class Spider {
    constructor(seedUrl) {
        // 首页地址
        this.seedUrl              = seedUrl;
        this.filename             = './url.csv';
        // 限制页面条数
        this.pageNumberLimit      = 6;
        // 分页页面地址池
        this.pageUrlList          = [];
        // 视频页页面地址池
        this.videoPageUrlList     = [];
        // 有效代理地址池
        this.validProxyUrlPool    = [];
        // 代理页面分页页码
        this.proxyPageNumber      = 1;
        // 代理页面分页页码上限
        this.proxyPageNumberLimit = 200;
    }

    // touch file [./url.csv] if not exist /data
    init() {
        fs.exists(this.filename, (exists) => {
            if (exists) {
                return;
            }
            // fs.appendFile('./url.csv', 'name,size,url\n', 'utf8', (err) => {
            fs.appendFile('./url.csv', '', 'utf8', (err) => {
                if (err) throw err;
                logger.info('url.csv does not exist,create url.csv success!');
            });

        });
        return this;
    }


    searchProxy(pageNumber = 1, cb) {
        let url  = `http://www.xicidaili.com/nn/${pageNumber}`;
        let conf = {
            url    : url,
            method : "GET",
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
        let $            = cheerio.load(html);
        let trList       = $("#ip_list tr");
        let tr;
        let tdList;
        let speed;
        let connectTime;
        for (let i = 1; i < trList.length; i++) {
            let proxy     = {};
            tr            = trList.eq(i);
            tdList        = tr.children("td");
            proxy['ip']   = tdList.eq(1).text();
            proxy['port'] = tdList.eq(2).text();
            speed         = tdList.eq(6).children("div").attr("title");
            speed         = speed.substring(0, speed.length - 1);
            connectTime   = tdList.eq(7).children("div").attr("title");
            connectTime   = connectTime.substring(0, connectTime.length - 1);
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
        let url  = "http://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js";
        let flag = proxyUrlList.length;  //检查是否所有异步函数都执行完的标志量
        for (let i = 0; i < proxyUrlList.length; i++) {
            let proxy = proxyUrlList[i];
            logger.info(`start filter proxy url ${proxy['ip']}:${proxy['port']}...`);
            request({
                url    : url,
                proxy  : "http://" + proxy['ip'] + ":" + proxy['port'],
                method : 'GET',
                timeout: 20 * 1000 * 4 / 20
            }, (error, response, body) => {
                // 完成一个，做一个标记
                flag--;
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
                    logger.info(`find a bad proxy ${response.request['proxy']['href']}`);
                }

                // 如果本批次完成
                if (flag === 0) {
                    // 当前页面小于总页数
                    if (this.proxyPageNumber < this.proxyPageNumberLimit) {
                        this.searchProxy(this.proxyPageNumber++, this.parseProxy.bind(this));
                    }
                }
                //
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


    /***
     * 公共的get方法，有一个回掉参数，需要注意，应该做一下回掉函数的有效性判断
     * @param url {string}
     * @param cb {function}
     */
    fetch(url, cb) {
        logger.info(`start to fetch ${url}...`);
        request({url: url}, function (err, res, body) {
            if (err) {
                console.log(err)
            } else {
                logger.info(`got the page ${url}...`);
                cb(body)
            }
        });
    }


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


