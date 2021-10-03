import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CovidDataService {
  url = 'https://services1.arcgis.com/0MSEUqKaxRlEPj5g/arcgis/rest/services/Coronavirus_2019_nCoV_Cases/FeatureServer/1/query?where=1%3D1&outFields=*&outSR=4326&f=json';
  constructor(private http: HttpClient) {}

  getCovidData(): Observable<any> {
    return this.http.get<any>(this.url)
    .pipe(
      catchError(this.handleError())
    );
  }

  public handleError() {
    return (error: any): Observable<any> => {
      return of(error);
    };
  }
}
