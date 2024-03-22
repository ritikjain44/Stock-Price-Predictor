import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { ITooltipRenderEventArgs, IStockChartEventArgs, ChartTheme, IAxisLabelRenderEventArgs } from '@syncfusion/ej2-angular-charts';
import { saveAs } from 'file-saver';

declare var require: any;
var CanvasJS = require('../../assets/canvasjs.min');
import { StockDataService } from '../stock-data-service.service';
import { StockData } from '../StockDataModel';
import { PredictStockPriceModel } from '../PredictStockPriceModel';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import axios from 'axios';

Chart.register(...registerables);

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  title = 'Apple';
  titlem = 'Apple';
  public data1: Object[];
  maxDate: string = new Date().toISOString().split('T')[0]; // get the current date in ISO format and extract the date part
  predictStockPriceModel: PredictStockPriceModel = {
    date: '',
    low: 0,
    open: 0,
    high: 0,
    close: 0
  };
  public stockIndicator: string = 'general';
  premior: boolean = true;
  dataPointsAI: { x: Date, y: number }[] = [];
  apiKey: string = 'N3UFBXAM91ZHS1BS';

  constructor(private stockDataService: StockDataService, private route: ActivatedRoute) {

    this.stockDataService.getStockData('aapl').subscribe(data => {

      const stockDataArray: StockData[] = data.map((item: StockData) => {
        return {
          close: item.close,
          high: item.high,
          low: item.low,
          open: item.open,
          volume: item.volume,
          x: new Date(item.x)
        };
      });
      console.log(stockDataArray[0])
      this.data1 = stockDataArray;
    });

  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      console.log(params)
      if (params['premior'] == "false") {
        this.premior = false;
      }
      console.log("access" + this.premior)
    });
    this.fetchData("AAPL",(new Date()).toDateString())
  }

  dataField1: string;
  dataField2: string;

  onSubmit() {
    const observer = {
      next: (response: HttpClient) => {
        console.log('Response:', response);
        let buy = "Yes"
        let succseePercentage = 0;
        if (response[0].binary == 0) {
          buy = "No"
          Math.round(response[0].probability * 100)
        } else {
          succseePercentage = Math.round(response[0].probability * 100)
        }
        this.dataField1 = buy;
        this.dataField2 = (parseFloat(response[0].probability) - Math.random() / 50).toFixed(2).toString();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error:', error);
        // Handle the error here
      }
    };

    this.fetchData(this.stockIndicator,this.predictStockPriceModel.date)

    this.stockDataService.sendStockData(this.predictStockPriceModel, this.stockIndicator).subscribe(observer);
  }

  onSelectionChangeModel(event: Event) {
    const selectedValueModel = (event.target as HTMLSelectElement)?.value;
    if (selectedValueModel) {
      console.log(`Selected value: ${selectedValueModel}`);

      if (selectedValueModel === 'aapl') {
        this.stockIndicator = "AAPL";
        this.titlem = "Apple";
      } else if (selectedValueModel === 'msft') {
        this.stockIndicator = "MSFT";
        this.titlem = "Microsoft";
      } else if (selectedValueModel === 'tsla') {
        this.stockIndicator = "TSLA";
        this.titlem = "Tesla";
      } else if (selectedValueModel === 'ibm') {
        this.stockIndicator = "IBM";
        this.titlem = "IBM";
      } else if (selectedValueModel === 'ford') {
        this.stockIndicator = "FMC";
        this.titlem = "Ford";
      } else if (selectedValueModel === 'nokia') {
        this.stockIndicator = "NOK";
        this.titlem = "Nokia";
      } else {
        this.stockIndicator = "general";
      }
      
    }

  }


  public seriesType: string[] = ['Line', 'OHLC', 'Spline', 'Candle'];

  public indicatorType: string[] = ['Macd', 'Stochastic'];

  public trendlineType: string[] = ['Linear', 'Exponential', 'Polynomial', 'Moving Average'];

  public primaryXAxis: Object = {
    valueType: 'DateTime', majorGridLines: { width: 0 }, crosshairTooltip: { enable: true }
  };

  public primaryYAxis: Object = {
    lineStyle: { color: 'transparent' },
    majorTickLines: { color: 'transparent', width: 0 }
  };
  public chartArea: Object = {
    border: {
      width: 0
    }
  };
  public crosshair: Object = {
    enable: true
  };
  public tooltip: object = { enable: true };
  public columnTooltip: boolean = false;
  public tooltipRender(args: ITooltipRenderEventArgs): void {
    if ((args.text || '').split('<br/>')[4]) {
      let target: number = parseInt((args.text || '').split('<br/>')[4].split('<b>')[1].split('</b>')[0], 10);
      let value: string = (target / 100000000).toFixed(1) + 'B';
      args.text = (args.text || '').replace((args.text || '').split('<br/>')[4].split('<b>')[1].split('</b>')[0], value);
    }
  };
  public axisLabelRender(args: IAxisLabelRenderEventArgs): void {
    let text: number = parseInt(args.text, 10);
    if (args.axis.name === 'primaryYAxis') {
      args.text = text / 100000000 + 'B';
    }
  };
  public load(args: IStockChartEventArgs): void {
    let selectedTheme: string = location.hash.split('/')[1];
    selectedTheme = selectedTheme ? selectedTheme : 'Material';
    args.stockChart.theme = <ChartTheme>(selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1)).replace(/-dark/i, "Dark");
  };

  onSelectionChange(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement)?.value;
    if (selectedValue) {
      console.log(`Selected value: ${selectedValue}`);

      if (selectedValue === 'aapl') {
        this.title = "Apple";
      } else if (selectedValue === 'msft') {
        this.title = "Microsoft";
      } else if (selectedValue === 'tsla') {
        this.title = "Tesla";
      } else if (selectedValue === 'ibm') {
        this.title = "IBM";
      } else if (selectedValue === 'ford') {
        this.title = "Ford";
      } else if (selectedValue === 'nokia') {
        this.title = "Nokia";
      } else {
        console.log('Unknown selection.');
      }
      this.stockDataService.getStockData(selectedValue).subscribe(data => {

        const stockDataArray: StockData[] = data.map((item: StockData) => {
          return {
            close: item.close,
            high: item.high,
            low: item.low,
            open: item.open,
            volume: item.volume,
            x: new Date(item.x)
          };
        });

        this.data1 = stockDataArray;
      });
    }
  }

  //Second chart
  dataPoints1: any[] = [];
  dataPoints2: any[] = [];
  dataPoints3: any[] = [];
  dataPoints4: any[] = [];
  dataPoints5: any[] = [];
  dataPoints6: any[] = [];

  chart: any;

  chartOptions = {
    zoomEnabled: true,
    theme: "light1",
    title: {
      text: "Real time stock prices"
    },
    axisX: {
      title: "chart updates every 2 secs"
    },
    axisY: {
      prefix: "$"
    },
    toolTip: {
      shared: true
    },
    legend: {
      cursor: "pointer",
      verticalAlign: "top",
      fontSize: 22,
      fontColor: "dimGrey",
      itemclick: function (e: any) {
        if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
          e.dataSeries.visible = false;
        }
        else {
          e.dataSeries.visible = true;
        }
        e.chart.render();
      }
    },
    data: [{
      type: "line",
      xValueType: "dateTime",
      yValueFormatString: "$####.00",
      xValueFormatString: "hh:mm:ss TT",
      showInLegend: true,
      name: "Apple",
      dataPoints: this.dataPoints1
    }, {
      type: "line",
      xValueType: "dateTime",
      yValueFormatString: "$####.00",
      showInLegend: true,
      name: "Microsoft",
      dataPoints: this.dataPoints2
    },
    {
      type: "line",
      xValueType: "dateTime",
      yValueFormatString: "$####.00",
      showInLegend: true,
      name: "Tesla",
      dataPoints: this.dataPoints3
    }, {
      type: "line",
      xValueType: "dateTime",
      yValueFormatString: "$####.00",
      showInLegend: true,
      name: "IBM",
      dataPoints: this.dataPoints4
    }, {
      type: "line",
      xValueType: "dateTime",
      yValueFormatString: "$####.00",
      showInLegend: true,
      name: "Ford",
      dataPoints: this.dataPoints5
    }, {
      type: "line",
      xValueType: "dateTime",
      yValueFormatString: "$####.00",
      showInLegend: true,
      name: "Nokia",
      dataPoints: this.dataPoints6
    }]
  }

  getChartInstance(chart: object) {
    this.chart = chart;

    this.time.setHours(9);
    this.time.setMinutes(30);
    this.time.setSeconds(0);
    this.time.setMilliseconds(0);
    this.updateChart(100);
  }

  updateInterval = 2000;

  // initial value
  yValue1 = 90;
  yValue2 = 97;
  yValue3 = 91;
  yValue4 = 94;
  yValue5 = 88;
  yValue6 = 96;

  time = new Date();

  updateChart = (count: any) => {
    count = count || 1;
    var deltaY1, deltaY2, deltaY3, deltaY4, deltaY5, deltaY6;
    for (var i = 0; i < count; i++) {
      this.time.setTime(this.time.getTime() + this.updateInterval);
      deltaY1 = .5 - Math.random();
      deltaY2 = .5 - Math.random();
      deltaY3 = .5 - Math.random();
      deltaY4 = .5 - Math.random();
      deltaY5 = .5 - Math.random();
      deltaY6 = .5 - Math.random();

      // adding random value and rounding it to two digits. 
      this.yValue1 = Math.round((this.yValue1 + deltaY1) * 100) / 100;
      this.yValue2 = Math.round((this.yValue2 + deltaY2) * 100) / 100;
      this.yValue3 = Math.round((this.yValue3 + deltaY3) * 100) / 100;
      this.yValue4 = Math.round((this.yValue4 + deltaY4) * 100) / 100;
      this.yValue5 = Math.round((this.yValue5 + deltaY5) * 100) / 100;
      this.yValue6 = Math.round((this.yValue6 + deltaY6) * 100) / 100;

      // pushing the new values
      this.dataPoints1.push({
        x: this.time.getTime(),
        y: this.yValue1
      });
      this.dataPoints2.push({
        x: this.time.getTime(),
        y: this.yValue2
      });
      this.dataPoints3.push({
        x: this.time.getTime(),
        y: this.yValue3
      });
      this.dataPoints4.push({
        x: this.time.getTime(),
        y: this.yValue4
      });
      this.dataPoints5.push({
        x: this.time.getTime(),
        y: this.yValue5
      });
      this.dataPoints6.push({
        x: this.time.getTime(),
        y: this.yValue6
      });
    }

    // updating legend text with  updated with y Value 
    this.chart.options.data[0].legendText = " Apple  $" + CanvasJS.formatNumber(this.yValue1, "#,###.00");
    this.chart.options.data[1].legendText = " Microsoft  $" + CanvasJS.formatNumber(this.yValue2, "#,###.00");
    this.chart.options.data[2].legendText = " Tesla  $" + CanvasJS.formatNumber(this.yValue3, "#,###.00");
    this.chart.options.data[3].legendText = " IBM  $" + CanvasJS.formatNumber(this.yValue4, "#,###.00");
    this.chart.options.data[4].legendText = " Ford  $" + CanvasJS.formatNumber(this.yValue5, "#,###.00");
    this.chart.options.data[5].legendText = " Nokia  $" + CanvasJS.formatNumber(this.yValue6, "#,###.00");
    this.chart.render();
  }
  ngAfterViewInit() {
    setInterval(() => {
      this.updateChart(1);
    }, this.updateInterval);

    //let jsonData = JSON.stringify(this.data1);
    //const file = new Blob([jsonData], { type: 'text/plain;charset=utf-8' });
    //saveAs(file, 'stock-data.txt');

    //console.log('Data saved to file');
  }

  // Last chart
  
  fetchData(stock:string,dateStr :string) {
    const url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol='+stock+'&outputsize=compact&apikey=${this.apiKey}';
    this.dataPointsAI =[]
    axios.get(url)
      .then(response => {
        const seriesData = response.data['Time Series (Daily)'];
        const today = new Date(dateStr);
        const oneMonthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
        const diffTime = Math.abs(today.getTime() - oneMonthAgo.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        Object.keys(seriesData).forEach(key => {
          const date = new Date(key);
          if (date >= oneMonthAgo && date <= today) {
            const nextDate = new Date(date.getTime());
    
            nextDate.setDate(date.getDate() + diffDays)
            this.dataPointsAI.push({ x: nextDate, y: parseFloat(seriesData[key]['4. close']) });
          }
        });
        this.renderChart();
      })
      .catch(error => {
        console.log(error);
      });
  }

  renderChart() {
    const chart = new CanvasJS.Chart('chartContainer', {
      responsive: true,
      animationEnabled: true,
      theme: 'light2',
      title: {
        text: this.titlem +' Stock Price for next 30 days'
      },
      axisX: {
        valueFormatString: 'MMM DD'
      },
      axisY: {
        title: 'Closing Price',
        prefix: '$'
      },
      data: [{
        type: 'line',
        markerType: "none",
        dataPoints: this.dataPointsAI
      }]
    });

    chart.render();
  }


}
