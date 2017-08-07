/**
 * Created by owen on 2017/8/6.
 */
const log4js = require('log4js');

log4js.configure({
    categories: {
        default: {
            appenders: ['spider'],
            level: 'info'
        }
    },
    appenders: {
        spider: {
            type: 'file',
            filename: './spider.log'
        }
    }
});


module.exports.logger = log4js.getLogger('spider');
