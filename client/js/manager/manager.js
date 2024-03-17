var showData;

$.ajax({
    url: '/auth/verify',
    method: 'post',
    complete: (response) => {
        const res = response.responseJSON;
        const code = response.status;
        if (code != 200) {
            authRedirect(res);
        }
    },
    async: false
});

jQuery(document).ready(function ($) {
    showData = newShowDataFn(okHandler, denyHandler);

    fetchLoginRequirements();

    const timeoutID = window.setInterval((fetchLoginRequirements), 7000);
});

function fetchLoginRequirements() {
    $.ajax({
        url: '/login/requirement',
        method: 'get',
        complete: fetchHandler,
    });
}

function fetchHandler(response) {
    const res = response.responseJSON;
    const code = response.status;
    if (code === 200) {
        showData(res.results);
    } else if (isNoAuth(code))
        authRedirect(res);
    else {
        showMessage(res.msg);
    }
}

function okHandler(e) {
    if (confirm("確定要核准連線嗎?")) {
        showLoading();
        const target = e.target;
        const username = target.getAttribute('username');
        $.ajax({
            url: `/login/requirement/${username}`,
            method: 'post',
            data: {
                approval: true,
            },
            complete: comfirmHandler,
        });
    } else {
        showMessage("取消操作");
    }
}

function denyHandler(e) {
    if (confirm("確定要拒絕連線嗎?")) {
        showLoading();
        const target = e.target;
        const username = target.getAttribute('username');
        $.ajax({
            url: `/login/requirement/${username}`,
            method: 'delete',
            data: {
                approval: false,
            },
            complete: comfirmHandler,
        });
    } else {
        showMessage("取消操作");
    }
}

function comfirmHandler(response) {
    hideLoading();

    const res = response.responseJSON;
    const code = response.status;
    if (code === 200) {
        showMessage(res.results);
        fetchLoginRequirements();
    } else if (isNoAuth(code))
        authRedirect(res);
    else {
        showMessage(res.msg);
    }
}

function isNoAuth(code) {
    return code === 401 || code === 403;
}

function authRedirect(res) {
    alert(res.msg);
    window.location.href = "manager-login.html";
}