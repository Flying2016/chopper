/**
 * Created by owen on 2017/8/6.
 */
const log4js = require('log4js');

log4js.configure({
    appenders: {
        cheese: {
            type: 'file',
            filename: 'spider.log'
        }
    },
    categories: {
        default: {
            appenders: ['spider'],
            level: 'info'
        }
    }
});

const logger = log4js.getLogger('spider');
logger.trace('Entering cheese testing');
logger.debug('Got cheese.');
logger.info('Cheese is Gouda.');
logger.warn('Cheese is quite smelly.');
logger.error('Cheese is too ripe!');
logger.fatal('Cheese was breeding ground for listeria.');

