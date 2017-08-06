/**
 * Created by owen on 2017/8/6.
 */
class Engine {
    constructor() {
    }

    init() {
        process.on('message', (m) => {
            console.log('CHILD got message:', m);
        });
        process.on('error', (m) => {
            console.log('PARENT got message:', m);
        });
        return this;
    }


    static pack(message) {
        return {
            version: '',
            data: message
        };
    }

    send(message) {
        process.send(this.pack(message));
    }

    run() {

    }
}

(new Engine()).init().run();