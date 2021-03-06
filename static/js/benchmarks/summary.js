// Get gpu id from url
var gpu_id = getUrlVars()["gpu_id"];

// filters for chart
var chart_filters = {"Network": ['All', 'ResNet50', 'ResNet152', 'Inception3', 'Inception4', 'VGG16', 'AlexNet', 'SSD300'],
                     "Precision": ['All', 'FP32', 'FP16'],
                     "NUM_GPU": [1,2,4,8,16]}; // Use -1 to select All

// Function to build button for filters
// name: name of the filter groups
// iterms: options for each filter (-1 is used to select all possible values for a filter)
function create_chart_filter(name, items) {
  // document.getElementById("filters").innerHTML+=
  var content = '<div class="filter">';
  content += '<div class="filterName">'+name+':</div>'
  content += '<div class="btn-toolbar btn-group-toggle" data-toggle="buttons">'
  for (var i = 0; i < items.length; i++){
   var v = (items[i] == -1)?'All':items[i];
   if (i == 0){
     content += '<label class="btn btn-outline-secondary active">'
     content += '<input class="chart_radio" type="radio" name="chart_'+name+'" value="'+items[i]+'" autocomplete="off" checked>'+v
   }
   else {
     content += '<label class="btn btn-outline-secondary">'
     content += '<input class="chart_radio" type="radio" name="chart_'+name+'" value="'+items[i]+'" autocomplete="off">'+v
   }
   content += '</label>'
  }
  content += '</div>';
  content += '</div>';
  content += '</div>';
  document.getElementById("chart_filter").innerHTML += content
}

// get the current selected chart filters
function get_chart_filters(){
  var selected_chart_filters = {};
  for (var key in chart_filters) {
      if (chart_filters.hasOwnProperty(key)) {
        var v = document.querySelector('input[name="chart_'+key+'"]:checked').value;
        if ((typeof chart_filters[key][0]) == 'number'){
          v = Number(v)
        }
        selected_chart_filters[key] = v
      }
  }
  return selected_chart_filters;
}


// Generate place holders for the content in this summary page
function generate_placeholder(){

  var content = '';
  content += '<div id="content">';
  content += '<div class="title">';
  content += '  <h1>' + gpu_id + ' Performance Summary</h1>';
  content += '  </div>';
  content += '  <div class="filterGroup fontBigger" id="chart_filter">';
  content += '  </div>';
  content += '  <div id="chart_div">';
  content += '  </div>';
  content += '</div>';
  document.body.innerHTML += content;

}

// Callback that creates and renders a chart
function drawChart() {

  var selected_chart_filters = get_chart_filters();

  // Filter data by chart_filters
  var data_chart = $.grep(data, function(n, i){
    var select = true;

    if (selected_chart_filters['Network'] !== 'All'){
      select = (n.Network === selected_chart_filters['Network']);
    }


    if (select && selected_chart_filters['Precision'] !== 'All'){
      select = (n.Precision === selected_chart_filters['Precision']);
    }

    if (select){
      select = (n.NUM_GPU === selected_chart_filters['NUM_GPU']);
    }
    return select;
  })

  // Reduce (by averaging) the filtered data based on GPU + NVlink composition
  var reduced_data_chart = []
  var distinct_record = [...new Set(data_chart.map(x => x.GPU + '_' + x.PCIeTopo + '_' + x.NVlink))]

  for (var idx_gpu = 0; idx_gpu < distinct_record.length; idx_gpu++){
    // Find all entries for a distinct record name
    var data_gpu = $.grep(data_chart, function(n, i){
      return ((n.GPU + '_' + n.PCIeTopo + '_' + n.NVlink) === distinct_record[idx_gpu])
    })
    var num_record = data_gpu.length
    var gpu_name = data_gpu[0].GPU
    var nvlink_name = data_gpu[0].NVlink
    var pcie_topo = data_gpu[0].PCIeTopo
    if (nvlink_name !== 0){
      var record_name =  gpu_name + "_PCIeTopo-" + pcie_topo + "_NVlink-" + nvlink_name;
    }
    else{
      var record_name =  gpu_name + "_PCIeTopo-" + pcie_topo;
    }

    // Compute the average
    var sum_speedup = 0.0
    for (var idx_record = 0; idx_record < num_record; idx_record++){
      sum_speedup += data_gpu[idx_record].Speedup;
    }
    var avg_speedup = sum_speedup / num_record

    var record = {
      RECORD_NAME: record_name,
      GPU_SHORT: gpu_name,
      SPEEDUP: avg_speedup.toFixed(2),
    };
    reduced_data_chart.push(record)
  }

  // Create the chart
  var num_iterms = reduced_data_chart.length;
  reduced_data_chart.sort(function(a, b){return b['SPEEDUP'] - a['SPEEDUP']});
  var google_data = new google.visualization.DataTable();
  google_data.addColumn("string", "RECORD_NAME");
  google_data.addColumn("number", "Speedup");
  google_data.addColumn({ type: 'string', role: 'style' });
  google_data.addRows(num_iterms)
  for (var i = 0; i < num_iterms; i++){
    google_data.setCell(i, 0, reduced_data_chart[i]['RECORD_NAME']);
    google_data.setCell(i, 1, reduced_data_chart[i]['SPEEDUP']);

    if (reduced_data_chart[i]['GPU_SHORT'].toString() === gpu_id){
      google_data.setCell(i, 2, 'color: #76A7FA');
    }
    else{
      google_data.setCell(i, 2, 'opacity: 0.2');
    }
  }

  // Some chart options
  var options = {'title':'Training Speedup w.r.t a Single 1080Ti',
                 'width':800,
                 'height':500,
                 hAxis: {
                     viewWindow: {
                         min: 0,
                     },
                 },
                 bar: {groupWidth: 20},
                 legend: {position: 'none'},
                 'chartArea': {'left':330,
                               'top': 50,
                               'backgroundColor': '#FFFFFF'},

               }

   // Instantiate and draw our chart, passing in some options.
   var chart = new google.visualization.BarChart(document.getElementById('chart_div'));
   chart.draw(google_data, options);
}

// Load the Visualization API and the corechart package.
google.charts.load('current', {'packages':['corechart']});

// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(drawChart);
