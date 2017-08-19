/**
 * Created by owen on 2017/8/12.
 */
const Spider = require('./bin');
const conf   = require('./conf.json');
const app    = new Spider();


app
    .loadConfig(conf)
    .url(() => {
        let urlList = [];
        for (let i = 1; i < 194; i++) {
            urlList.push(`http://www.ixian.cn/forum.php`)
        }
        return urlList;
    })
    .init()
    .run();
