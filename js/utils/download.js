/**
 * Created by owen-carter on 17/8/9.
 */

const Curl = function () {

};

/***
 * HTMLImageElement类型是一个动态的类型，也就是说不添加进DOM树中还是能够加载
 * @param url
 */
Curl.prototype.get = function (url) {
    let img = document.createElement("img");
    url     = url + `&timeStamp=${(new Date()).getTime()}`;
    img.src = url;
    img.addEventListener('load', () => {
        console.dir('img load');
        document.body.appendChild(img);
    })
};


Curl.prototype.post = function (url, data) {
    let form    = document.createElement("form");
    form.action = url;
    form.method = 'post';
};

Curl.prototype.genQs = function (url, query) {
    url += '?';
    for (let key in query) {
        if (query.hasOwnProperty(key)) {
            url += `${key}=${query[key]}`
        }
    }
    return url.substring(0, url.length - 1)
};


Curl.prototype.download = function (url, query) {
    let link;
    url += '?';
    for (let key in query) {
        if (query.hasOwnProperty(key)) {
            url += `${key}=${query[key]}`
        }
    }
    url.substring(0, url.length - 1);
    link                  = document.createElement('a');
    link.style.visibility = 'hidden';
    link.href             = url;
    link.click();
};


let curl = new Curl();
curl.get("www.baidu.com/ss", () => {

});


