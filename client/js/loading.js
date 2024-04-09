function showLoading() {
    $('#loader-container').show("slow");
    $('#loader-container').prop("user-select", 'none');
}

function hideLoading() {
    $('#loader-container').hide("fast");
}