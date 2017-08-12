/**
 * Created by owen on 2017/8/12.
 */
const Spider = require('./bin');
const app = new Spider();
const conf = require('./conf.json');


app
    .loadConfig(conf)
    .init()
    .run();