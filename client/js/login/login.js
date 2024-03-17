jQuery(document).ready(function ($) {
    $('title').text(TITLE);
    $('h1').text(TITLE);
    $('.login h1').text(LOGIN_H1);
    $('#passwordLabel').text(PSW_LABEL);
    $('#loginBtn').val(LOGIN_BTN_TEXT);
    if (!IS_USE_OTP_AND_DESCRIPTION) {
        $('#otpLabel').hide("fast");
        $('#otp').hide("fast");
        $('#descriptionLabel').hide("fast");
        $('#description').hide("fast");
    }

    $('#loginBtn').on({
        click: function () {
            clearMessage();
            showLoading();
            const req = newCaptchaRequest();
            login(req);
        },
    });
});

function newLoginHandler(successFn, failFn) {
    return (response) => {
        hideLoading();

        const res = response.responseJSON;
        const code = response.status;
        if (code === 200) {
            successFn(res, code);
        } else {
            failFn(res, code);
        }
    }
}

function clearInput() {
    $('#account').val('');
    $('#password').val('');
    $('#otp').val('');
    $('#description').val('');
    $('#captcha').val('');
}
