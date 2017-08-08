/**
 * Created by owen on 2017/8/6.
 */

const fs = require('fs');
const log4js = require('log4js');
const download = require('download');
const {logger} = require('../config/index.js');


class Wget {
    constructor() {
        this.urlList = [];
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
        download('http://unicorn.com/foo.jpg', 'dist').then(() => {
            logger.info('done!');
        });

        download('http://unicorn.com/foo.jpg').then(data => {
            fs.writeFileSync('dist/foo.jpg', data);
        });

        download('unicorn.com/foo.jpg').pipe(fs.createWriteStream('dist/foo.jpg'));

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

