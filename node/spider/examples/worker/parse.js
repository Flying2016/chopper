/**
 * Created by owen on 2017/8/6.
 */
process.on('message', (m) => {
    console.log('CHILD got message:', m);
});

process.send({foo: 'bar'});