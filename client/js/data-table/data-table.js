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
                        $('<td>').text(new Date(data.request_time).toLocaleTimeString()),
                        $('<td>').text(data.description),
                        $('<td>').text(new Date(data.connect_time).toLocaleTimeString()),
                        $('<td>').append(
                            $('<div>').append(
                                $(`<input id='${data.id}' class='ok-btn' type='button'>`),
                                $(`<input id='${data.id}' class='deny-btn' type='button'>`),
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
