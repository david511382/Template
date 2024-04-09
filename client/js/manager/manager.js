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
        const id = target.getAttribute('id');
        $.ajax({
            url: `/login/requirement/${id}`,
            method: 'post',
            data: {
                approval: true,
            },
            complete: createComfirmHandler((results) => {
                const username = results.username;
                const endTime = new Date(results.end_time);
                return `許可 ${username} 連線至${endTime.toLocaleString()}`;
            }),
        });
    } else {
        showMessage("取消操作");
    }
}

function denyHandler(e) {
    if (confirm("確定要拒絕連線嗎?")) {
        showLoading();
        const target = e.target;
        const id = target.getAttribute('id');
        $.ajax({
            url: `/login/requirement/${id}`,
            method: 'delete',
            data: {
                approval: false,
            },
            complete: createComfirmHandler((results) => {
                const username = results.username;
                return `拒絕 ${username} 連線請求`;
            }),
        });
    } else {
        showMessage("取消操作");
    }
}

function createComfirmHandler(msgF) {
    return (response) => {
        hideLoading();

        const res = response.responseJSON;
        const code = response.status;
        if (code === 200) {
            const msg = msgF(res.results);
            showMessage(msg);
            fetchLoginRequirements();
        } else if (isNoAuth(code))
            authRedirect(res);
        else {
            showMessage(res.msg);
        }
    }
}

function isNoAuth(code) {
    return code === 401 || code === 403;
}

function authRedirect(res) {
    alert(res.msg);
    window.location.href = "manager-login.html";
}