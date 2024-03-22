#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Wed Feb  1 01:47:44 2023

@author: ruvinjagoda
"""

import mysql.connector
from flask import Flask, jsonify,request
import pandas as pd
from tensorflow.keras.models import load_model
import numpy as np
import joblib
from flask_cors import CORS
from flask_cors import cross_origin

app = Flask(__name__)

# Connection to database
mydb = mysql.connector.connect(
  host="localhost",
  user="root",
  password="Ruvin@123",
  database="tempdatabase"
)

mycursor = mydb.cursor()



# Get request send to get graph data from the database
@app.route("/stock_prices", methods=["GET"])
def stock_prices():
    # Get the value of the 'symbol' query parameter from the request
    symbol = request.args.get('symbol')
    app.logger.debug('Printing a debug message '+symbol)
    # SQL query to select all columns from stock_prices table
    
    mycursor.execute("SELECT * FROM "+symbol)
        
    

    result = mycursor.fetchall()
    stocks = [{"x": data[0], "open": round(float(data[1]),5),"high":round(float(data[2]),5),"low":round(float(data[3]),5),"close":round(float(data[4]),5),"volume": int(data[5])} 
              for data in result]
    response = jsonify(stocks)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

# Post request send to get graph data from the database
@app.route("/get_prediction", methods=["POST"])
@cross_origin()
def stock_prices_predict():
    symbol = request.args.get('symbol')
    app.logger.debug('Printing a debug message model '+symbol)
    request_data = request.json
    print(request_data)
    data = {'Date': request_data['date'], 
            'Low': request_data['low'],
            'Open': request_data['open'],
            'High': request_data['high'],
            'Close': request_data['close']}

    dfp = pd.DataFrame(data,index=[0])


    dfp['open-close']  = dfp['Open'] - dfp['Close']
    dfp['low-high']  = dfp['Low'] - dfp['High']

    splitted = dfp['Date'].str.split('-', expand=True)
     
    dfp['month'] = splitted[1].astype('int')

    dfp['is_quarter_end'] = np.where(dfp['month']%3==0,1,0)
    
    if(symbol == 'general'):
        # Load saved model and scaler from file
        loaded_model = load_model('general_model.h5')
        scaler = joblib.load('general_scaler.pkl')
    else :
        
        # Load saved model and scaler from file     
        modelStr = symbol + '_model.h5'
        scalerStr = symbol + '_scaler.pkl'
        loaded_model = load_model(modelStr)
        scaler = joblib.load(scalerStr)
        
    
    x_test= dfp[['open-close', 'low-high', 'is_quarter_end']]
    new_data = scaler.transform(x_test)  # Scale the data using the scaler object used for training
    num_timesteps = 3
    # Reshape the data into the expected shape
    new_data = new_data.reshape((1, num_timesteps, x_test.shape[1] // num_timesteps))

    # Make a prediction
    prediction = loaded_model.predict(new_data)

    # The prediction is a probability value between 0 and 1, so you can round it to get a binary classification result
    binary_prediction = round(prediction[0][0])

    print('Probability:', round(float(prediction[0][0]), 2))
    print('Binary prediction:', binary_prediction)
    
    stocks = [{"probability":round((prediction[0][0].astype(float)), 2),"binary": binary_prediction}]
    response = jsonify(stocks)
    return response

if __name__ == "__main__":
    app.run(debug=True)
    CORS(app)