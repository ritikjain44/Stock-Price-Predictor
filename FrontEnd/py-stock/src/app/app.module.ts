import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import * as CanvasJSAngularChart from '../assets/canvasjs.angular.component';
import { StockChartModule } from '@syncfusion/ej2-angular-charts';
import { DateTimeService, LegendService, TooltipService } from '@syncfusion/ej2-angular-charts';
import { DataLabelService, CandleSeriesService,ChartAllModule, RangeNavigatorAllModule} from '@syncfusion/ej2-angular-charts';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
var CanvasJSChart = CanvasJSAngularChart.CanvasJSChart;


@NgModule({
  declarations: [
    AppComponent,
    CanvasJSChart,
    LoginComponent,
    HomeComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    StockChartModule,
    ChartAllModule,
    RangeNavigatorAllModule,
    HttpClientModule ,
    FormsModule
  ],
  providers: [ DateTimeService, LegendService, TooltipService, DataLabelService, CandleSeriesService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
