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


class Spider {
    constructor(seedUrl) {
        // 首页地址
        this.seedUrl          = seedUrl;
        this.filename         = './url.csv';
        // 限制页面条数
        this.pageNumberLimit  = 6;
        // 分页页面地址池
        this.pageUrlList      = [];
        // 视频页页面地址池
        this.videoPageUrlList = [];
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

    /***
     * 解析应用的首页地址，目的是为了得到起始地址
     * 但是其实没有什么用
     * @param html {string}
     * @returns {*|jQuery}
     */
    parseIndex(html) {
        logger.info('start parse the index page....');
        // logger.info(html);
        let $    = cheerio.load(html);
        let href = $('#navcontainer li:nth-child(3) a').attr('href');
        logger.info(`index page href is ${href}`);
        return href;
    }

    /***
     * 根据起始地址
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
     * 解析当前页面中所有的视频地址，但是好像不是真实地址
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
            this.fetch(this.pageUrlList.pop(), this.parsePage.bind(this))
        } else {
            this.fetch(this.videoPageUrlList.pop(), this.parseVideo.bind(this))
        }
    }


    parseVideo(html) {
        let $, name, src;
        $    = cheerio.load(html)
        src  = $('#vid source').attr('src');
        name = $('#viewvideo-title').text();
        logger.info(`collected: ${name} -- ${src}`);
        this.store(name, src);
        this.fetch(this.videoPageUrlList.pop(), this.parseVideo.bind(this))
    }

    /***
     * 存储随意格式
     */
    store(name, src) {
        fs.appendFile(this.filename, `${name},${src} \n`, 'utf8', (err) => {
            if (err) throw err;
            logger.info(`${name},$${src} appendTo ${this.filename} success!`);
        });
    }

    /***
     * 启动
     */
    run() {
        this.fetch(this.seedUrl, (html) => {
            let startUrl = this.parseIndex(html);
            this.makePageUrlList(startUrl);
            // 拿到所有页面了的url，但是不可以循环去消费掉，链接数太大，node hold不住
            // 需要一种机制
            // 访问一个page如果成功，那么就从新开始自己
            this.fetch(this.pageUrlList.shift(), this.parsePage.bind(this))
        })
    }


}


(new Spider('http://email.91dizhi.at.gmail.com.7h4.space/index.php'))
    .init()
    .run();