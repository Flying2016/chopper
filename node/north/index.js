/**
 * Created by owen-carter on 17/8/9.
 */
let fs      = require('fs');
let request = require('request');
let cheerio = require('cheerio');


class Spider {
    constructor(seedUrl) {
        this.seedUrl = seedUrl;
    }

    // touch file [./url.csv] if not exist /data
    init() {

    }

    fetch(url) {
        request({url: url}, function (err, res, body) {
            if (err) {
                console.log(err)
            } else {
                // parse(body)
            }
        });
    }

    parseIndex() {

    }

    parsePage() {

    }


    parseVedio() {

    }


    storeCsv() {

        let filename;
        let mp4url;
        let src;

        fs.appendFile(x, y, function (err) {
            if (err) {
                console.log(err)
            } else {
                console.log('The "data to append" was appended to file!');
            }
        });
    }

    run() {

    }


}


(new Spider('http://email.91dizhi.at.gmail.com.7h4.space/index.php'))
    .init()
    .run();