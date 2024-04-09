jQuery(document).ready(function ($) {
    $('#message-confirm').on({
        click: clearMessage,
    });
});

function clearMessage() {
    $('#message-box').hide("fast");
}

function showMessage(msg) {
    $('#message').text(msg);
    $('#message-box').show('fast');
}
