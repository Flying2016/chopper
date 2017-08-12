/**
 * Created by owen-carter on 17/8/11.
 */
const Spider = require('./bin');

const app = new Spider('http://www.xicidaili.com/nn/');
app.init().run();