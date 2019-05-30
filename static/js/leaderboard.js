
var def_filters = {"Model": ['ResNet50', 'ResNet152', 'Inception3', 'Inception4', 'VGG16', 'AlexNet', 'SSD300'],
                   "Precision": ['FP32', 'FP16'],
                   "NUM_GPU": [-1,1,2,4,8]}; // Use -1 to select All

var def_columns = [
      { "data": "Model",
      "title":"Model",
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
      "width": "30px",
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
      },
      { "data": "CPU",
      "title":"CPU",
      "width": "60px",
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
      ];

// Function to build child row
// d: data for a single row
function format_child ( d ) {

  return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
      '<tr>'+
          '<td>Model:</td>'+
          '<td>'+d["Model"]+'</td>'+
          '<td>Precision:</td>'+
          '<td>'+d['Precision']+'</td>'+
          '<td>Images/sec:</td>'+
          '<td>'+d['Images/sec']+'</td>'+
          '<td>Speedup w.r.t 1 x 1080Ti:</td>'+
          '<td>'+d['Speedup'].toFixed(2)+'</td>'+
      '</tr>'+
      '<tr>'+
          '<td>GPU:</td>'+
          '<td>'+'<a href="/summary?gpu_id='+d['GPU']+'" target="_blank">'+d['GPU']+'</a></td>'+
          // '<td>'+d['GPU']+'</td>'+
          '<td>CPU:</td>'+
          '<td>'+d['CPU']+'</td>'+
          '<td>Product:</td>'+
          '<td>'+'<a href="'+d['ProductLink']+'" target"="_blank">'+d['Product']+'</a></td>'+
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
      select = (n.Model === selected['Model']);
    }
    return select;
  })


  var curTable = $('#leaderboard').DataTable( {
    data: data_table,
    "pageLength": 10,
    destroy: true,
    autoWidth: false,
    // "asStripeClasses": [],
    "bInfo": true,
    "columns": def_columns,
  } );

  curTable.rows().every( function () {
    this.child(format_child(this.data()));
    this.child().addClass('smalltable');
  } );

  $('#leaderboard tbody').on( 'click', 'tr', function () {

      var row = curTable.row( this );
      var child = row.child;

      if ( child.isShown() ) {
          child.hide();
      }
      else {
        child.show();
      }
  } );

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
