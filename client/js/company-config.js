const TITLE = '司法院VPN連線登記系統';
const LOGIN_H1 = '廠商VPN連線登記';
const PSW_LABEL = '請輸入IDE密碼';
const LOGIN_BTN_TEXT = '線上登記';
const IS_USE_OTP_AND_DESCRIPTION = true;
var login = companyLogin;

function companyLogin(req) {
    let connectTime = $('#connectTime').val();
    if (connectTime) {
        const [hour, min] = connectTime.split(':');
        connectTime = new Date();
        connectTime.setHours(hour);
        connectTime.setMinutes(min);
        connectTime = connectTime.toISOString();
    }
    const data = {
        username: $('#account').val(),
        description: $('#description').val(),
        psw: $('#password').val(),
        otp: $('#otp').val(),
        connect_time: connectTime,
    };

    req.url = '/login/requirement';
    req.method = 'post';
    req.data = data;
    req.complete = newLoginHandler(loginSuccess, loginFail);
    $.ajax(req);
}

function loginSuccess(res, code) {
    clearInput();

    const connectTime = new Date(res.results);
    const msg = `VPN連線登記完成，請求${connectTime.toLocaleTimeString()}開始連線，待承辦人核可。`;
    showMessage(msg);
}

function loginFail(res, code) {
    showMessage(res.msg);
    newCaptcha();
}