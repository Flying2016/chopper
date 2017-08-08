/**
 * Created by owen-carter on 17/8/8.
 */

const Login = function loginFn(name) {
    this.name = name;
};

Login.prototype.save = function () {
    let inputList = [];
    $(`form[name='${this.name}'] input`).each(function () {
        inputList.push({
            id   : $(this).attr('id'),
            name : $(this).attr('name'),
            type : $(this).attr('type'),
            value: ($(this).attr('type') === 'checkbox') ? $(this).prop('checked') : $(this).prop('value')
        })
    });
    localStorage.loginCredential = JSON.stringify(inputList)
};

Login.prototype.isRemembered = function () {
    let inputList;
    try {
        if (!localStorage.loginCredential) {
            return false;
        }
        inputList = JSON.parse(localStorage.loginCredential);
        for (let i = 0; i < inputList.length; i++) {
            if (inputList[i]['type'] === 'checkbox') {
                return inputList[i]['value']
            }
        }
    } catch (e) {
        return false;
    }
};

Login.prototype.recover = function () {
    let sel;
    let loginCredential = JSON.parse(localStorage.loginCredential);
    for (let i = 0; i < loginCredential.length; i++) {
        sel = `form[name='${this.name}'] input[name='${loginCredential[i]['name']}']`;
        $(sel).val(loginCredential[i]['value']);
    }
};

Login.prototype.submit = function () {
    this.save();
    $(`form[name='${this.name}']`).submit();
};

Login.prototype.init = function () {
    if (this.isRemembered()) {
        this.recover()
    }
};

let login = new Login('myForm');
login.init();
$("#loginBtn").click(() => {
    login.submit()
})
