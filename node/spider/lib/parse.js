/**
 * Created by owen on 2017/8/6.
 */

const log4js  = require('log4js');
const cheerio = require("cheerio");

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


    parse(url, html) {
        console.log('分析进程开始解析！');
        let $        = cheerio.load(html);
        let instance = this;
        $('a').each(function () {
            let href = $(this).attr('href');
            if (href.split('/').pop().indexOf('.') !== -1) {
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

