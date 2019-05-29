var data = (function () {
    var json = null;
    $.ajax({
        'async': false,
        'global': false,
        'url': 'static/data/data.json',
        'dataType': "json",
        'success': function (data) {
            json = data;
        }
    });
    return json;
})();
