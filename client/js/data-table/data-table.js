// '.tbl-content' consumed little space for vertical scrollbar, scrollbar width depend on browser/os/platfrom. Here calculate the scollbar width .
$(window).on("load resize ", function () {
    var scrollWidth = $('.tbl-content').width() - $('.tbl-content table').width();
    $('.tbl-header').css({ 'padding-right': scrollWidth });
}).resize();

function newShowDataFn(okHandler, denyHandler) {
    return (dataArr) => {
        $('.tbl-content tbody').empty();

        dataArr.forEach(data => {
            $('.tbl-content tbody')
                .append($('<tr>')
                    .append(
                        $('<td>').text(data.username),
                        $('<td>').text(data.ip),
                        $('<td>').text(data.request_time),
                        $('<td>').text(data.description),
                        $('<td>').append(
                            $('<div>').append(
                                $(`<input username='${data.username}' class='ok-btn' type='button'>`),
                                $(`<input username='${data.username}' class='deny-btn' type='button'>`),
                            )),
                    )
                );
        });

        $('.ok-btn').on({
            click: okHandler,
        });
        $('.deny-btn').on({
            click: denyHandler,
        });
    };
}
