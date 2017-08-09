/**
 * Created by owen-carter on 17/8/9.
 */
let fs      = require('fs');
let request = require('request');
let cheerio = require('cheerio');


class Spider {
    constructor(seedUrl) {
        this.seedUrl         = seedUrl;
        this.pageNumberLimit = 10;
        this.pageUrlList     = [];
    }

    // touch file [./url.csv] if not exist /data
    init() {

    }

    fetch(url, cb) {
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
        let $    = cheerio.load(html)
        let href = $('#navcontainer li:nth-child(3) a').attr('href');
        return href
    }

    makePageUrlList(href) {
        let Href, j;
        for (j = 1; j < this.pageNumberLimit; j++) {
            Href = href + '&page=' + j;
            this.pageUrlList.push(Href)
        }
    }

    /***
     * 解析当前页面中所有的视频地址，但是好像不是真实地址
     * @param html
     */
    parsePage(html) {
        let $         = cheerio.load(html);
        let videoUrl  = $('#videobox .listchannel>div>a');
        let videoName = $('#videobox .listchannel>div>a>img');
    }


    parseVideo(html) {
        let $   = cheerio.load(html)
        let src = $('#vid source').attr('src')
        console.log(src);
        let name     = $('#videodetails-content a span').text()
        let filename = './data/' + name + '.txt'
    }


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
            this.fetch(this.pageUrlList.shift(), this.parsePage)
        })
    }


}


(new Spider('http://email.91dizhi.at.gmail.com.7h4.space/index.php'))
    .init()
    .run();