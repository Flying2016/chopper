/**
 * Created by owen-carter on 17/8/11.
 */

import Spider from '../bin';
var request = require('supertest')
require("should");


require("should");

describe('User', function () {
    describe('#save()', function () {
        it('should save without error', function (done) {
            var user = new User('Luna');
            user.save(done);
        });
    });
});


describe('sign up', function () {
    it('should not sign up an user when loginname is empty', function (done) {
        request.post('/signup')
            .send({
                loginname: '',
                password : password
            })
            .expect(200, function (err, res) {
                should.not.exist(err);
                res.text.should.containEql('用户名或密码不能为空');
                done();
            });
    });
    it('should not sign up an user when it is exist', function (done) {
        request.post('/signup')
            .send({
                loginname: loginname,
                password : password
            })
            .expect(200, function (err, res) {
                should.not.exist(err);
                res.text.should.containEql('用户已经存在');
                done();
            });
    });
})