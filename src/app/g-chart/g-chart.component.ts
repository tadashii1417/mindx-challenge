import { Component, Input, OnInit } from '@angular/core';
import { GoogleChartService } from '../google-chart.service';

@Component({
  selector: 'app-g-chart',
  templateUrl: './g-chart.component.html',
  styleUrls: ['./g-chart.component.css']
})
export class GChartComponent implements OnInit {


  @Input() data: any[];
  @Input() options: any;
  @Input() elementId: string;
  @Input() type: string;

  constructor(private gchartService: GoogleChartService) { }

  ngOnInit() {
    switch (this.type) {
      case 'geochart':
        this.gchartService.BuildGeoChart(this.elementId, this.data, this.options);
        break;
      default:
        break;
    }
  }
}
