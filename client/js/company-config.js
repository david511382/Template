const TITLE = '司法院VPN連線登記系統';
const LOGIN_H1 = '廠商VPN連線登記';
const PSW_LABEL = '請輸入IDE密碼';
const LOGIN_BTN_TEXT = '線上登記';
const IS_USE_OTP_AND_DESCRIPTION = true;
var login = companyLogin;

function companyLogin(req) {
    const data = {
        username: $('#account').val(),
        description: $('#description').val(),
        psw: $('#password').val(),
        otp: $('#otp').val(),
    };

    req.url = '/login/requirement';
    req.method = 'post';
    req.data = data;
    req.complete = newLoginHandler(loginSuccess, loginFail);
    $.ajax(req);
}

function loginSuccess(res, code) {
    clearInput();
    showMessage('VPN連線登記完成，在承辦人許可前無法重複登記。');
}

function loginFail(res, code) {
    showMessage(res.msg);
    newCaptcha();
}