jQuery(document).ready(function ($) {
    $("#account").focus(function () {
        $("#accountLabel").addClass("show");
        $(this).val('')
    }).blur(function () {
        $("#accountLabel").removeClass("show");
    });

    const DESCRIPTION_HEIGHT_EM = 1.4;
    var span = $('<span>').css('display', 'inline-block').css('word-break', 'break-all').appendTo('body').css('visibility', 'hidden');
    function initSpan(textarea) {
        span.text(textarea.text())
            .width(textarea.width())
            .css('font', textarea.css('font'));
    }
    $('#description').on({
        input: function () {
            var text = $(this).val();
            span.text(text);
            const height = text ? span.height() : `${DESCRIPTION_HEIGHT_EM}em`;
            $(this).height(height);
        },
        focus: function () {
            initSpan($(this));

            $("#descriptionLabel").addClass("show");
        },
        blur: function () {
            $("#descriptionLabel").removeClass("show");
        },
        keypress: function (e) {
            if (e.which == 13) e.preventDefault();
        }
    });
    $('#description').height(`${DESCRIPTION_HEIGHT_EM}em`);
});
