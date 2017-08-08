/**
 * Created by owen on 2017/8/9.
 */
const log4js = require('log4js');
const request = require("request");
const cheerio = require("cheerio");
const child_process = require('child_process');


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

export default logger