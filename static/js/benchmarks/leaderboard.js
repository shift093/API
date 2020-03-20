
var def_filters = {"Network": ['ResNet50', 'ResNet152', 'Inception3', 'Inception4', 'VGG16', 'AlexNet', 'SSD300'],
                   "Precision": ['FP32', 'FP16'],
                   "NUM_GPU": [-1,1,2,4,8,16]}; // Use -1 to select All


var flag_nvlink = false
if (lambda_mode){
  flag_nvlink = true
}

var def_columns = [
      { "className":      'details-control',
      "orderable":      false,
      "data":           null,
      "defaultContent": '',
      "width": "6px",
      },
      { "data": "Network",
      "title":"Network",
      "visible": false,
      "searchable": false,
      "className": 'dt-right',
      },
      { "data": "Precision",
      "title":"Precision",
      "visible": false,
      "searchable": false,
      "className": 'dt-right',
      },
      { "data": "GPU",
      "title":"GPU",
      "width": "40px",
      "className": 'dt-right',
      },
      { "data": "Images/sec",
      "title":"Images/sec",
      "width": "20px",
      "className": 'dt-right',
      },
      { "data": "Speedup",
      "title":"Speedup",
      "visible": true,
      "searchable": false,
      "width": "50px",
      "render": function ( data ) {
          return data.toFixed(2);
      },
      "className": 'dt-right',
      },
      { "data": "NUM_GPU",
      "title":"#GPU",
      "width": "25px",
      "type" : "num",
      "className": 'dt-right',
      },
      { "data": "NVlink",
      "title":"NVlink",
      "width": "50px",
      "className": 'dt-right',
      "visible": flag_nvlink,
      "searchable": flag_nvlink,      
      },
      { "data": "CPU",
      "title":"CPU",
      "width": "80px",
      "className": 'dt-right',
      },
      { "data": "Price ($)",
      "title":"GPU Cost ($)",
      "width": "50px",
      "className": 'dt-right',
      },
      { "data": "Code",
      "title":"Code",
      "visible": false,
      "searchable": false,
      "className": 'dt-right',
      },
      { "data": "Update Method",
      "title":"Update Method",
      "visible": false,
      "searchable": false,
      "className": 'dt-right',
      },
      { "data": "Data",
      "title":"Data",
      "width": "30px",
      "className": 'dt-right',
      },
      { "data": "Batch Size",
      "title":"Batch Size",
      "width": "50px",
      "className": 'dt-right',
      },
      { "data": "Framework",
      "title":"Framework",
      "visible": false,
      "searchable": false,
      "className": 'dt-right',
      },
      { "data": "Acceleration",
      "title":"Acceleration",
      "visible": false,
      "searchable": false,
      "className": 'dt-right',
      },
      { "data": "Driver",
      "title":"Driver",
      "visible": false,
      "searchable": false,
      "className": 'dt-right',
      },
      { "data": "Product",
      "title":"Product",
      "visible": false,
      "searchable": false,
      "className": 'dt-right',
      },
      { "data": "ProductLink",
      "title":"ProductLink",
      "visible": false,
      "searchable": false,
      "className": 'dt-right',
      },
      { "data": "PCIeTopo",
      "title":"PCIeTopo",
      "visible": false,
      "searchable": false,
      "className": 'dt-right',
      },
      { "data": "Model",
      "title":"Model",
      "visible": true,
      "searchable": true,
      "width": "90px",
      "className": 'dt-right',
      },
      ];

// Function to build child row
// d: data for a single row
function format_child ( d ) {

  var summary_link
  if (lambda_mode === 0){
    summary_link = '<a href="/deep-learning/gpu-benchmarks/summary?gpu_id='+d['GPU'] + '" target="_blank">'
  }
  else
  {
    summary_link = '<a href="/deep-learning/gpu-benchmarks/summary?gpu_id='+d['GPU']+'&lambda_mode=' + lambda_mode + '" target="_blank">'
  }

  return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
      '<tr>'+
          '<td>Network:</td>'+
          '<td>'+d["Network"]+'</td>'+
          '<td>Precision:</td>'+
          '<td>'+d['Precision']+'</td>'+
      '</tr>'+
      '<tr>'+
          '<td>Images/sec:</td>'+
          '<td>'+d['Images/sec']+'</td>'+
          '<td>Speedup w.r.t 1 x 1080Ti:</td>'+
          '<td>'+d['Speedup'].toFixed(2)+'</td>'+
      '</tr>'+
      '<tr>'+
          '<td>GPU:</td>'+
          '<td>'+summary_link+d['GPU']+'</a></td>'+
          '<td>CPU:</td>'+
          '<td>'+d['CPU']+'</td>'+
          '<td>Product:</td>'+
          '<td>'+'<a href="'+d['ProductLink']+'" target"="_blank">'+d['Product']+'</a></td>'+
          '<td>Model:</td>'+
          '<td>'+d['Model']+'</td>'+
      '</tr>'+
          '<td>NUM_GPU:</td>'+
          '<td>'+d['NUM_GPU']+'</td>'+
          '<td>NVlink:</td>'+
          '<td>'+d['NVlink']+'</td>'+
          '<td>GPU Cost ($):</td>'+
          '<td>'+d['Price ($)']+'</td>'+
      '</tr>'+
      '<tr>'+
          '<td>Code:</td>'+
          '<td>'+'<a href="'+d['Code']+'" target="_blank">Link</a>'+'</td>'+
          '<td>Update Method:</td>'+
          '<td>'+d['Update Method']+'</td>'+
          '<td>Data:</td>'+
          '<td>'+d['Data']+'</td>'+
          '<td>Batch Size:</td>'+
          '<td>'+d['Batch Size']+'</td>'+
      '</tr>'+
      '<tr>'+
          '<td>Framework:</td>'+
          '<td>'+d['Framework']+'</td>'+
          '<td>Acceleration:</td>'+
          '<td>'+d['Acceleration']+'</td>'+
          '<td>Driver:</td>'+
          '<td>'+d['Driver']+'</td>'+
      '</tr>'+
  '</table>';
}

// get the current selected filters
function get_filters(){
  var selected = {};
  for (var key in def_filters) {
      if (def_filters.hasOwnProperty(key)) {
        var v = document.querySelector('input[name="table_'+key+'"]:checked').value;
        if ((typeof def_filters[key][0]) == 'number'){
          v = Number(v)
        }
        selected[key] = v
      }
  }
  return selected;
}

// Function to build the leaderboard
// data: json object for the data
// def_columns: definition of the table's columns
// selected: filters for selecting rows

function buildTable(data, def_columns, selected){

  // Filter data by chart_filters
  var data_table = $.grep(data, function(n, i){
    var select = true;
    if (selected['NUM_GPU'] !== -1){
      select = (n.NUM_GPU === selected['NUM_GPU']);
    }
    if (select){
      select = (n.Precision === selected['Precision']);
    }
    if (select){
      select = (n.Network === selected['Network']);
    }
    return select;
  })


  var curTable = $('#leaderboard').DataTable({
    dom: 'frt',
    data: data_table,
    destroy: true,
    autoWidth: false,
    "columns": def_columns,
    sStripeEven: '',
    sStripeOdd: '',
    "stripeClasses": [],
    "pageLength": 15
  } );

  curTable.rows().every( function () {
    this.child(format_child(this.data()));
    this.child().addClass('smalltable');
  } );

  $('#leaderboard tbody').on( 'click', 'tr', function () {

      var row = curTable.row( this );
      var child = row.child;
      var tr = $(this).closest('tr');

      if ( child.isShown() ) {
          child.hide();
          tr.removeClass('shown');
      }
      else {
        child.show();
        tr.addClass('shown');
      }
  } );

  $('#btn-example-load-more').toggle(curTable.page.hasMore());

  create_nav_buttons(curTable);

}


// Function to build button for filters
// name: name of the filter groups
// iterms: options for each filter (-1 is used to select all possible values for a filter)
function create_filter(name, items) {
  // document.getElementById("filters").innerHTML+=
  content = '<div class="filter">';
  content += '<div class="filterName">'+name+':</div>'
  content += '<div class="btn-toolbar btn-group-toggle" data-toggle="buttons">'
  for (var i = 0; i < items.length; i++){
    var v = (items[i] == -1)?'All':items[i];
    if (i == 0){
      content += '<label class="btn btn-outline-secondary active">'
      content += '<input class="table_radio" type="radio" name="table_'+name+'" value="'+items[i]+'" autocomplete="off" checked>'+v
    }
    else {
      content += '<label class="btn btn-outline-secondary">'
      content += '<input class="table_radio" type="radio" name="table_'+name+'" value="'+items[i]+'" autocomplete="off">'+v
    }
    content += '</label>'
  }
  content += '</div>';
  content += '</div>';
  content += '</div>';
  document.getElementById("filters").innerHTML += content
}

function create_metric_description() {

  var content = ' <div id="Metrics">'
  content += '    <h2>Metrics</h2>'
  content += '    <div id="metrics_content">'
  content += '      <div class="metric_name">'
  content += '        <b>Image/sec: </b>'
  content += '      </div>'
  content += '      <div class="metric_desc">'
  content += '        The number of images processed every second in training.'
  content += '      </div>'

  content += '      <div class="metric_name">'
  content += '        <b>Speedup: </b>'
  content += '      </div>'
  content += '      <div class="metric_desc">'
  content += '        The improvement over a <b>single 1080 Ti</b>.'
  content += '      </div>'
  content += '      <div class="metric_name">'
  content += '        <b>GPU Cost ($): </b>'
  content += '      </div>'
  content += '      <div class="metric_desc">'
  content += '        The cost of all GPUs, including accessories such as NVlink.'
  content += '      </div>'
  content += '      <div class="metric_name">'
  content += '        <b>Data: </b>'
  content += '      </div>'
  content += '      <div class="metric_desc">'
  content += '        Synthetic data is used to isolate GPU performance from other factors, such as CPU and disk I/O.'
  content += '      </div>'
  content += '    </div>'
  content += '  </div>'

  document.getElementById("content").innerHTML += content

}

function create_logs () {
  var content = ' <div id="Log">'
  content += '    <h2>Logs</h2>'
  content += '    <div id="log_content">'

  content += '      <div class="log_name">'
  content += '        <b>2019-12-10: </b>'
  content += '      </div>'
  content += '      <div class="log_desc">'
  content += '        Add 16 x V100 on SuperMicro 9029.'
  content += '      </div>'

  content += '      <div class="log_name">'
  content += '        <b>2019-09-17: </b>'
  content += '      </div>'
  content += '      <div class="log_desc">'
  content += '        Add 8 x Quadro RTX 6000 on SuperMicro 4029GR-TRT2.'
  content += '      </div>'

  content += '      <div class="log_name">'
  content += '        <b>2019-04-26: </b>'
  content += '      </div>'
  content += '      <div class="log_desc">'
  content += '        Add 8 x Quadro RTX 8000 on TYAN B7119F77V14HR-2T-N.'
  content += '      </div>'

  if (lambda_mode){
    content += '      <div class="log_name">'
    content += '        <b>2019-03-29: </b>'
    content += '      </div>'
    content += '      <div class="log_desc">'
    content += '        Add 2070 and 2060 Single GPU results.'
    content += '      </div>'    
  }

  content += '      <div class="log_name">'
  content += '        <b>2019-03-01: </b>'
  content += '      </div>'
  content += '      <div class="log_desc">'
  content += '        Add single and dual 2080 results.'
  content += '      </div>'

  content += '      <div class="log_name">'
  content += '        <b>2019-02-28: </b>'
  content += '      </div>'
  content += '      <div class="log_desc">'
  content += '        Add Tensorbook 2080 Laptop.'
  content += '      </div>'

  content += '      <div class="log_name">'
  content += '        <b>2019-02-26: </b>'
  content += '      </div>'
  content += '      <div class="log_desc">'
  content += '        Add Tensorbook 2070 Max-Q.'
  content += '      </div>'

  content += '      <div class="log_name">'
  content += '        <b>2019-02-18: </b>'
  content += '      </div>'
  content += '      <div class="log_desc">'
  content += '        Update 8 x 2080Ti for dual root complex server.'
  if (lambda_mode){
    content += ' Add 2 x Radeon VII results.'
  }  
  content += '      </div>'


  content += '      <div class="log_name">'
  content += '        <b>2019-01-21: </b>'
  content += '      </div>'
  content += '      <div class="log_desc">'
  content += '        Update Nivdia V100 SXM2 for ' + '<a href="https://lambdalabs.com/products/hyperplane" target"="_blank">Lambda Hyperlane</a>.'
  content += '      </div>'

  if (lambda_mode){
    content += '      <div class="log_name">'
    content += '        <b>2019-01-17: </b>'
    content += '      </div>'
    content += '      <div class="log_desc">'
    content += '        Update Nivdia gV100 for ' + '<a href="https://lambdalabs.com/products/quad" target"="_blank">Lambda Quad</a>.'
    content += '      </div>'
  }

  content += '      <div class="log_name">'
  content += '        <b>2019-01-1: </b>'
  content += '      </div>'
  content += '      <div class="log_desc">'
  content += '        Initial leaderboard with 1080Ti, TitanXP, TitanV, 2080Ti, TitanRTX.'
  content += '      </div>'

  content += '    </div>'
  content += '  </div>'

  document.getElementById("content").innerHTML += content
}


function create_nav_buttons(curTable) {
  // Handle click on "Load more" button
  $('#btn-example-load-more').on('click', function(){
     // Load more data
     curTable.page.loadMore();

     $('html, body').animate({
         scrollTop: $('#btn-example-back-to-top').offset().top - 700
     }, 0);

     // Show or hide "Load more" button based on whether there is more data available
     $('#btn-example-load-more').toggle(curTable.page.hasMore());

  });

  // Handle click on "Back to Top" button
  $('#btn-example-back-to-top').on('click', function(){
     $('html, body').animate({
         scrollTop: 0
     }, 0);
  });
}
