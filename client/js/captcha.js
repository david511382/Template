var captchaID;

jQuery(document).ready(function ($) {
    newCaptcha();
    $('#captcha-svg').on({
        click: newCaptcha,
    });
});

function newCaptcha() {
    $('#captcha-svg').empty();
    $.ajax({
        url: '/captcha',
        method: 'post',
        complete: captchaHandler,
    });
}

function captchaHandler(response) {
    const res = response.responseJSON;
    const code = response.status;
    if (code === 200) {
        $('#captcha-svg')
            .append(res.results.html);
        captchaID = res.results.id;
    } else {
        showMessage(res.msg);
    }
}

function newCaptchaRequest(req) {
    if (!req)
        req = {
            headers: {
                'captcha': `${captchaID}:${$('#captcha').val()}`,
            }
        };
    return req;
}
