/**
 * Created by owen-carter on 17/8/8.
 */

let chopper = require('chopper');

let plug = () => {

};

// 注册插件
chopper.plugin('name', () => {
    return;
});

// 注册任务
chopper.task('meizi', () => {
    return chopper.url()
        .pipe(plug())
        .pipe(plug())
        .pipe(plug())
        .pipe(plug())
        .pipe(plug())
});

chopper.task('meizi', () => {
    return class Meizi extends Base {
        constructor() {

        }

        fetch() {

        }

        parse() {

        }

        download() {

        }

        run() {

        }
    }
});


// 全寨爬取


chopper.run(['meizi'])