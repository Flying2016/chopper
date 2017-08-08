/**
 * Created by owen on 2017/8/6.
 */

const log4js = require('log4js');
const cheerio = require("cheerio");


/***
 * 只负责解析页面，不负责下载
 * 只接受url，内部取页面，并分析出图片地址和外链
 * 将{图片地址和外链}发送到主进程
 * 主进程进行调度，将图片地址发送到下载进程，url推送到地址池
 * 并且此数据也是一次信号发送，发送一次信号，即认为爬改网页成功
 * 那么主进程发送新的url到解析地址，那么可能存在url池枯竭的情况
 * 所以该解析进程，除了需要实现，从页面中取到url，并且要取到正确的，同时还要进行一定程度的猜测，
 */
class Parser {
    constructor() {
    }

    init() {
        process.on('message', (data) => {
            console.log('分析进程拿到数据！');
            this.parse('', data)
        });
        return this;
    }


    static pack(message) {
        return message;
    }

    static send(message) {
        process.send(Parser.pack(message));
    }

    /***
     * 分析中心需要自建下载网页方法，因为在进程之间传递大数据，效率太低
     * 所以分析中心，拿到url，采集网页，验证网页，采集url，采集图片url
     * 发送到主进程
     */
    fetch() {

    }

    /***
     * 解析网页，拿到网页之后，应该验证一下是不是网页，进行有效验证
     * @param url
     * @param html
     */
    parse(url, html) {
        console.log('分析进程开始解析！');
        let $ = cheerio.load(html);
        let instance = this;
        $('a').each(function () {
            let href = $(this).attr('href');
            let suffix = href.split('/').pop();
            if (suffix && suffix.indexOf('.') !== -1) {
                console.log(`分析进程发现可用url ${href}`);
                Parser.send(href)
            } else {
                Parser.send(href)
            }
        });
    }

    run() {
        console.dir('started...')
    }
}

(new Parser())
    .init()
    .run();

