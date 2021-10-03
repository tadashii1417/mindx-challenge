import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { GChartComponent } from './g-chart/g-chart.component';
import { ReactiveFormsModule } from '@angular/forms';
import { GoogleLoginProvider, SocialAuthServiceConfig, SocialLoginModule } from 'angularx-social-login';

@NgModule({
   declarations: [
      AppComponent,
      GChartComponent
   ],
   imports: [
      BrowserModule,
      HttpClientModule,
      ReactiveFormsModule,
      SocialLoginModule
   ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '361009537273-46bflagk359i2p9t6tv000egdtm1inq1.apps.googleusercontent.com'
            )
          }
        ]
      } as SocialAuthServiceConfig,
    }
  ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
