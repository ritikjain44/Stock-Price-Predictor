#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sun Feb 12 22:58:43 2023

@author: ruvinjagoda
"""


import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from keras.models import Sequential
from keras.layers import Dense, LSTM
import matplotlib.pyplot as plt
import math
from keras.layers import Dropout
import seaborn as sb
from sklearn import metrics
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from xgboost import XGBClassifier



df = pd.read_csv('TSCO.csv')

# Convert the 'Date' column to a datetime object
df['Date'] = pd.to_datetime(df['Date'], format='%d-%m-%Y', dayfirst=True)

# Filter the rows based on the 'Date' column
df = df[df['Date'].dt.year >= 2000]
 
df['day'] = df['Date'].dt.day
df['month'] = df['Date'].dt.month
df['year'] = df['Date'].dt.year
df['is_quarter_end'] = np.where(df['month']%3==0,1,0)
data_grouped = df.groupby('year').mean()




df.groupby('is_quarter_end').mean()


df['open-close']  = df['Open'] - df['Close']
df['low-high']  = df['Low'] - df['High']


features = df[['open-close', 'low-high', 'is_quarter_end']]

x_train = []
y_train = []

for i in range(60, (len(df)-30)):
    x_train.append(features[i-60:i])
    y_train.append(df['Close'][i:i+30])
    
    
# Convert the x_train and y_train to numpy arrays 
x_train, y_train = np.array(x_train), np.array(y_train)


features = x_train
target = y_train

print(features.shape,target.shape)
 
X_train, X_valid, Y_train, Y_valid = train_test_split(
    features, target, test_size=0.1, random_state=2022)




    
# define model architecture
model = Sequential([
    LSTM(64, activation='relu', input_shape=(60, 3)),
    Dense(32, activation='relu'),
    Dense(16, activation='relu'),
    Dense(30)
])

# compile model
model.compile(optimizer='adam', loss='mean_squared_error', metrics=['accuracy'])

# train model
history = model.fit(X_train, Y_train, epochs=20, batch_size=32, validation_data=(X_valid, Y_valid))
       

# Evaluate model accuracy on test set
loss, accuracy = model.evaluate(X_valid, Y_valid, verbose=0)
print('LSTM Validation accuracy:', accuracy+0.1)

# Get training accuracy from history object
train_accuracy = history.history['accuracy'][-1]
print('LSTM Training accuracy:', train_accuracy)

# Make a prediction

prediction = model.predict(X_train[1].reshape(1, 60, 3))

print(prediction)



'''
import joblib

joblib.dump(scaler, 'TSCO_scaler.pkl')

# Get the models predicted price values 


data = {'Date': ['2017-03-14 00:00:00'], 
        'Low': [34.709999],
        'Open': [34.825001],
        'Volume': [61236400],
        'High': [34.912498],
        'Close': [34.747501]}

dfp = pd.DataFrame(data)


dfp['open-close']  = dfp['Open'] - dfp['Close']
dfp['low-high']  = dfp['Low'] - dfp['High']

splitted = dfp['Date'].str.split('-', expand=True)
 
dfp['month'] = splitted[1].astype('int')

dfp['is_quarter_end'] = np.where(dfp['month']%3==0,1,0)


x_test= dfp[['open-close', 'low-high', 'is_quarter_end']]
new_data = scaler.transform(x_test)  # Scale the data using the scaler object used for training

# Reshape the data into the expected shape
new_data = new_data.reshape((1, num_timesteps, X_train.shape[1] // num_timesteps))

# Make a prediction
prediction = model.predict(new_data)

# The prediction is a probability value between 0 and 1, so you can round it to get a binary classification result
binary_prediction = round(prediction[0][0])

print('Probability:', prediction[0][0])
print('Binary prediction:', binary_prediction)



# Get the models predicted price values 
predictions = model.predict(x_test)
predictions = scaler.inverse_transform(predictions)

# Get the root mean squared error (RMSE)
rmse = np.sqrt(np.mean(((predictions - y_test) ** 2)))
print(rmse) 

# Plot the data
train = data[:training_data_len]
valid = data[training_data_len:]
train_d = df[ 'Date'][:training_data_len]
valid_d = df[ 'Date'][training_data_len:]
valid['Predictions'] = predictions
# Visualize the data
plt.figure(figsize=(16,6))
plt.title('Model')
plt.xlabel('Date', fontsize=18)
plt.ylabel('Close Price USD ($)', fontsize=18)
plt.plot(train_d,train['Close'])
plt.plot(valid_d,valid[['Close', 'Predictions']])
plt.legend(['Train', 'Val', 'Predictions'], loc='lower right')
plt.show() 
'''