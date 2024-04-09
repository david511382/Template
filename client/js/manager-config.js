const TITLE = '司法院VPN連線登記系統管理後台';
const LOGIN_H1 = '管理員登入';
const PSW_LABEL = '請輸入AD密碼';
const LOGIN_BTN_TEXT = '登入';
const IS_USE_OTP_AND_DESCRIPTION = false;
var login = managerLogin;

function managerLogin(req) {
    const data = {
        username: $('#account').val(),
        psw: $('#password').val(),
    };

    req.url = '/auth/login';
    req.method = 'post';
    req.data = data;
    req.complete = newLoginHandler(loginSuccess, loginFail);
    $.ajax(req);
}

function loginSuccess(res, code) {
    const token = res.results;
    // Set a cookie
    document.cookie = `Authorization=${token}`;

    window.location.href = "manager.html";
}

function loginFail(res, code) {
    showMessage(res.msg);
    newCaptcha();
}