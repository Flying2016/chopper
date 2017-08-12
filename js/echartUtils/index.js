/**
 * Created by owen-carter on 17/8/8.
 */

const ChartUtils = function loginFn() {
    this.chart = null;
};


ChartUtils.prototype.update = function (cb) {
    let opt = this.chart.getOption(option);
    opt = cb(opt)
    this.chart.setOption(opt)

};

ChartUtils.prototype.init = function (id) {
    this.chart = echarts.init(document.getElementById(id));
    this.option = {}
};

ChartUtils.prototype.draw = function (option) {
    this.chart.setOption(option)
};

module.exports = ChartUtils;