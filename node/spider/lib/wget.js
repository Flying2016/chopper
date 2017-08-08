/**
 * Created by owen on 2017/8/6.
 */

const fs = require('fs');
const log4js = require('log4js');
const download = require('download');
const {logger} = require('../config/index.js');


/***
 * 起一个进程用来下载，只负责下载
 * 具体下载实现在内部实现，只接受主进程发送来的url参数
 * 不再向外吐数据
 * 但是每一个/好几个任务完成，需要向主进程发送信号
 */
class Wget {
    constructor() {
        this.urlList = [];
        this.dist = './images';
    }

    init() {
        process.on('message', (data) => {
            logger.info('下载进程拿到数据！');
            this.parse('', data)
        });
        return this;
    }


    static pack(message) {
        return message;
    }

    static send(message) {
        process.send(Wget.pack(message));
    }


    download(url, html) {
        logger.info('下载进程开始下载！');
        download(url, this.dist).then(() => {
            logger.info('done!');
        });
    }

    downloadBatch() {
        Promise.all([
            'unicorn.com/foo.jpg',
            'cats.com/dancing.gif'
        ].map(x => download(x, 'dist'))).then(() => {
            logger.info('files downloaded!');
        });
    }

    run() {
        logger.info('started...');
    }
}

(new Wget())
    .init()
    .run();

