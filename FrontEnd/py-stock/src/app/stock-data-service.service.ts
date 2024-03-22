import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PredictStockPriceModel } from './PredictStockPriceModel';
import fetch from 'node-fetch';

@Injectable({
  providedIn: 'root'
})
export class StockDataService {

  constructor(private http: HttpClient) {}

  getStockData(selectedValue: string): Observable<any> {
    return this.http.get('http://127.0.0.1:5000/stock_prices?symbol='+selectedValue);
  }

  sendStockData(stockData: PredictStockPriceModel,selectedValue: string): Observable<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    
    console.log(stockData)
    return this.http.post<any>('http://127.0.0.1:5000/get_prediction?symbol='+selectedValue, stockData, {headers});
  }

}
