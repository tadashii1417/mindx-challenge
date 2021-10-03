import { Injectable } from '@angular/core';

declare var google: any;

@Injectable({
  providedIn: 'root'
})
export class GoogleChartBaseService {

  constructor() {
    google.charts.load('current',
      {'packages': ['geochart', 'corechart', 'bar']});
  }

  protected buildGeoChart(data: any[], chartFunc: any, options: any): void {
    var func = (chartFunc, options) => {
      var datatable = new google.visualization.DataTable();
      datatable.addColumn('number', 'Latitude');
      datatable.addColumn('number', 'Longitude');
      datatable.addColumn('number', 'confirmed');
      datatable.addColumn({'type': 'string', 'role': 'tooltip', 'p': {'html': true}}); //
      datatable.addRows(data);
      chartFunc().draw(datatable, options);
    };
    var callback = () => func(chartFunc, options);
    google.charts.setOnLoadCallback(callback);
  }
}
