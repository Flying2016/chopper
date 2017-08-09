/**
 * Created by owen-carter on 17/8/9.
 */
const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');
const log4js = require('log4js');


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
    constructor(seedUrl) {
        this.seedUrl = seedUrl;
        this.pageNumberLimit = 10;
        this.pageUrlList = [];
    }

    // touch file [./url.csv] if not exist /data
    init() {
        fs.appendFile('./url.csv', 'name,size,url\n', 'utf8', (err) => {
            if (err) throw err;
            logger.info('url.csv does not exist,create url.csv success!');
        });
        return this;
    }

    fetch(url, cb) {
        logger.info(`start to fetch ${url}...`);
        request({url: url}, function (err, res, body) {
            if (err) {
                console.log(err)
            } else {
                cb(body)
            }
        });
    }

    /***
     * 解析应用分析地址
     * @param html
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
        logger.info('start parse the page....');
        // logger.info(html);
        let $ = cheerio.load(html);
        let videoUrl = $('#videobox .listchannel>div>a');
        let videoName = $('#videobox .listchannel>div>a>img');
        console.dir(videoUrl)
        console.dir(videoName)
        // this.fetch(videoUrl, this.parseVideo.bind(this))
    }


    parseVideo(html) {
        let $ = cheerio.load(html)
        let src = $('#vid source').attr('src')
        console.log(src);
        let name = $('#videodetails-content a span').text()
        let filename = './data/' + name + '.txt'
    }

    /***
     *
     */
    storeCsv() {

        let filename;
        let mp4url;
        let src;

        fs.appendFile(x, y, function (err) {
            if (err) {
                console.log(err)
            } else {
                console.log('The "data to append" was appended to file!');
            }
        });
    }

    run() {
        this.fetch(this.seedUrl, (html) => {
            let startUrl = this.parseIndex(html);
            this.makePageUrlList(startUrl);
            this.fetch(this.pageUrlList.shift(), this.parsePage.bind(this))
        })
    }


}


(new Spider('http://email.91dizhi.at.gmail.com.7h4.space/index.php'))
    .init()
    .run();