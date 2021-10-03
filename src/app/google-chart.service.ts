import { Injectable } from '@angular/core';
import { GoogleChartBaseService } from './google-chart-base.service';

declare var google: any;

@Injectable({
  providedIn: 'root'
})
export class GoogleChartService extends GoogleChartBaseService {
  constructor() {
    super();
  }

  public BuildGeoChart(elementId: string, data: any[], options: any): void {
    const chartFunc = () => { return new google.visualization.GeoChart(document.getElementById(elementId)); };
    this.buildGeoChart(data, chartFunc, options);
  }
}
