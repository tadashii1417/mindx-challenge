import { Component, OnDestroy, OnInit } from '@angular/core';
import { CovidDataService } from './covid-data.service';
import { Subscription } from 'rxjs';
import { country_coord_table } from './country-coords';
import { GoogleLoginProvider, SocialAuthService, SocialUser } from 'angularx-social-login';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  loggedIn = false;
  socialUser!: SocialUser;

  dataCountry: any[] = [];
  dataConfirmed: any[] = [];
  dataRecovered: any[] = [];
  dataDeaths: any[] = [];
  countryCoord = country_coord_table;
  lastUpdatedTime;
  loading = true;

  options = {
    colorAxis: {minValue: 0, maxValue: 0, colors: ['#ff0800']},
    legend: 'none',
    displayMode: 'markers',
    enableRegionInteractivity: 'true',
    resolution: 'countries',
    sizeAxis: {maxSize: 30},
    markerOpacity: 0.5,
    region: '035',
    keepAspectRatio: false,
    tooltip: {isHtml: true, showTitle: false}
  };

  subsCovidData: Subscription;
  constructor(
    private covidDataService: CovidDataService,
    private socialAuthService: SocialAuthService) {}

  ngOnInit() {
    this.getCovidData();

    this.socialAuthService.authState.subscribe((user) => {
      this.socialUser = user;
      this.loggedIn = (user != null);
    });
  }

  loginWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  getCovidData() {
    this.subsCovidData = this.covidDataService.getCovidData().subscribe(
      data => {
        data.features.forEach(element => {
          if (element.attributes.Last_Update !== null) {
            this.lastUpdatedTime = new Date(element.attributes.Last_Update);
            const elmIndex = this.dataCountry.findIndex(elm => elm.Country_Region === element.attributes.Country_Region);
            const latitude = this.getCountryLatitude(element.attributes.Country_Region);
            const longitude = this.getCountryLongitude(element.attributes.Country_Region);

            if (latitude !== 'error' && longitude !== 'error') {
              if (elmIndex === -1) {
                this.dataConfirmed.push([latitude, longitude, element.attributes.Confirmed,
                  '<strong>' + element.attributes.Country_Region + `</strong>
                  <div style="color:orange">Confirmed: <br>` + element.attributes.Confirmed + `</div>
                  <div style="color:green">Recovered: <br>` + element.attributes.Recovered + `</div>
                  <div style="color:red">Deaths: <br>` + element.attributes.Deaths + '</div>']);

                this.dataRecovered.push([latitude, longitude, element.attributes.Recovered]);
                this.dataDeaths.push([latitude, longitude, element.attributes.Deaths]);

                this.dataCountry.push({
                  Country_Region: element.attributes.Country_Region,
                  Confirmed: element.attributes.Confirmed,
                  Recovered: element.attributes.Recovered,
                  Deaths: element.attributes.Deaths
                });
              } else {
                this.dataConfirmed[elmIndex][2] = this.dataConfirmed[elmIndex][2] + element.attributes.Confirmed;
                this.dataRecovered[elmIndex][2] = this.dataRecovered[elmIndex][2] + element.attributes.Recovered;
                this.dataDeaths[elmIndex][2] = this.dataDeaths[elmIndex][2] + element.attributes.Deaths;

                this.dataConfirmed[elmIndex][3] = '<strong>' + element.attributes.Country_Region + `</strong>
                    <div style="color:orange">Confirmed: <br>` + this.dataConfirmed[elmIndex][2] + `</div>
                    <div style="color:green">Recovered: <br>` + this.dataRecovered[elmIndex][2] + `</div>
                    <div style="color:red">Deaths: <br>` + this.dataDeaths[elmIndex][2] + '</div>';

                this.dataCountry[elmIndex] = {
                  Country_Region: element.attributes.Country_Region,
                  Confirmed: this.dataConfirmed[elmIndex][2],
                  Recovered: this.dataRecovered[elmIndex][2],
                  Deaths: this.dataDeaths[elmIndex][2]
                };
              }
            }
          } else {
            console.log(element);
          }
        });

        console.log(this.dataCountry);
        console.log(this.dataConfirmed)
        this.loading = false;
      });
  }

  getCountryLatitude(country: string): any {
    const countryIndex = this.countryCoord.findIndex(c => c.Country_Region === country);
    if (countryIndex === -1) {
      return 'error';
    } else {
      return parseFloat(this.countryCoord[this.countryCoord.findIndex(c => c.Country_Region === country)].Latitude);
    }
  }

  getCountryLongitude(country: string): any {
    const countryIndex = this.countryCoord.findIndex(c => c.Country_Region === country);
    if (countryIndex === -1) {
      return 'error';
    }
    return parseFloat(this.countryCoord[this.countryCoord.findIndex(c => c.Country_Region === country)].Longitude);
  }

  ngOnDestroy(): void {
    if (this.subsCovidData) {
      this.subsCovidData.unsubscribe();
    }
  }

  logOut(): void {
    this.socialAuthService.signOut();
    this.loggedIn = false;
  }
}
