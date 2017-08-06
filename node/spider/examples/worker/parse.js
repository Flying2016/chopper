/**
 * Created by owen on 2017/8/6.
 */
class Parser {
    constructor() {
    }

    init() {
        process.on('message', (data) => {
            console.log('parse got message:', data);
        });
        return this;
    }


    static pack(message) {
        return {
            version: '',
            data: message
        };
    }

    static send(message) {
        process.send(Parser.pack(message));
    }

    run() {
        setInterval(() => {
            Parser.send('jft')
        }, 1000)
    }
}

(new Parser()).init().run();