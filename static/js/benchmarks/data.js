var data = (function () {
    var json = null;
    $.ajax({
        'async': false,
        'global': false,
        'url': '/API/static/js/benchmarks/data.json',
        'dataType': "json",
        'success': function (data) {
            json = data;
        }
    });
    return json;
})();

// remove some rows under non-lambda mode
if (lambda_mode === 0){
    data = $.grep(data, function(n, i){
      var select = (n.Lambda === 0);
      return select;
    })
}
