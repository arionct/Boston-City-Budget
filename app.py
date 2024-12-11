import matplotlib.pyplot as plt
from flask import Flask, render_template, jsonify
from matplotlib.ticker import FuncFormatter
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.linear_model import HuberRegressor
from scipy.stats import zscore

# Read the data from the CSV file
cap_budg = pd.read_csv('./data/capital_budget.csv')
op_budg = pd.read_csv('./data/operating_budget.csv')

# Clean the data
op_budg.replace("#Missing", 0, inplace=True)
op_budg['FY22 Actual Expense'] = pd.to_numeric(
    op_budg['FY22 Actual Expense'].str.replace(',', ''))
op_budg['FY23 Actual Expense'] = pd.to_numeric(
    op_budg['FY23 Actual Expense'].str.replace(',', ''))
op_budg['FY24 Appropriation'] = pd.to_numeric(
    op_budg['FY24 Appropriation'].str.replace(',', ''))
op_budg['FY25 Budget'] = pd.to_numeric(
    op_budg['FY25 Budget'].str.replace(',', ''))


app = Flask(__name__)

@app.route('/')
def index():
  return render_template('index.html')

@app.route('/operating-budget')
def operating():
  return render_template('operating-budget.html')

#------------------------------------------------------------------------------------------------
# Operating Budget
#------------------------------------------------------------------------------------------------




def get_huber_reg():
    neighborhood_budg = cap_budg.groupby(
        'Neighborhood')['Total_Project_Budget'].mean().sort_values(ascending=True)
    # Load and clean neighborhood income data
    npi = pd.read_csv('./data/2015-2019_neighborhood_tables_2021.12.21.csv')
    npi.columns = ['Neighborhood', 'Total Population',
                   'Income', 'Per Capita Income']
    npi = npi[['Neighborhood', 'Total Population',
               'Income', 'Per Capita Income']].dropna()
    npi = npi.iloc[3:].reset_index(drop=True)
    npi['Total Population'] = npi['Total Population'].str.replace(
        ',', '').astype(int)
    npi['Income'] = npi['Income'].str.replace(
        ',', '').str.replace('$', '').astype(float)
    npi['Per Capita Income'] = npi['Per Capita Income'].str.replace(
        ',', '').str.replace('$', '').astype(float)

    # Merge the two datasets
    combined_df = pd.DataFrame({
        'Project Budget': neighborhood_budg,
        'Per Capita Income': npi.set_index('Neighborhood')['Per Capita Income']
    }).dropna()  # Ensure no NaN values

    # Step 1: Calculate Z-scores for both variables
    combined_df['Z_Score_Income'] = zscore(combined_df['Per Capita Income'])
    combined_df['Z_Score_Budget'] = zscore(combined_df['Project Budget'])

    # Step 2: Filter out outliers based on Z-score threshold (e.g., |z| > 3)
    outliers = combined_df[
        (combined_df['Z_Score_Income'].abs() > 3) |
        (combined_df['Z_Score_Budget'].abs() > 3)
    ]
    # Step 3: Remove outliers from the dataset for regression
    filtered_df = combined_df.drop(outliers.index)

    # Prepare filtered data for regression
    X_filtered = filtered_df[['Per Capita Income']].values
    Y_filtered = filtered_df['Project Budget'].values

    # Step 3: Fit a robust regression model
    robust_model = HuberRegressor()
    robust_model.fit(X_filtered, Y_filtered)

    # Predict budget on the filtered dataset
    y_robust_pred = robust_model.predict(X_filtered)

    graph_data = {
        "scatterplot": {
            "x": filtered_df[['Per Capita Income']].tolist(),
            "y": filtered_df['Project Budget'].tolist()
        },
        "regression_line": {
            "x": filtered_df[['Per Capita Income']].tolist(),
            "y": y_robust_pred.tolist()
        },
        "model": {
            "coefficients": robust_model.coef_.tolist(),
            "intercept": robust_model.intercept_
        }
    }
    return jsonify(graph_data)


def get_poverty_reg():
    neighborhood_budg = cap_budg.groupby(
        'Neighborhood')['Total_Project_Budget'].mean().sort_values(ascending=True)
    poverty_data = pd.read_csv(
        './data/2015-2019_neighborhood_data_povertyrates.csv')
    poverty_data['Poverty rate'] = pd.to_numeric(
        poverty_data['Poverty rate'].str.replace('%', '').astype(float)) / 100

    # Merge race data and project budget data on 'Neighborhood'
    pd_combined_df = pd.merge(
        poverty_data, neighborhood_budg, on='Neighborhood', how='outer')
    pd_combined_df = pd_combined_df.dropna(
        subset=['Poverty rate', 'Total_Project_Budget'])

    # Independent variable (poverty rate)
    X = pd_combined_df[['Poverty rate']].values
    # Dependent variable (project budget)
    Y = pd_combined_df['Total_Project_Budget'].values

    # Fit a linear regression model
    linear_model = LinearRegression()
    linear_model.fit(X, Y)

    graph_data = {
        "scatterplot": {
            "x": pd_combined_df[['Poverty rate']].tolist(),
            "y": pd_combined_df['Total_Project_Budget'].tolist()
        },
        "regression_line": {
            "x": pd_combined_df[['Poverty rate']].tolist(),
            "y": linear_model.tolist()
        },
        "model": {
            "coefficients": linear_model.coef_.tolist(),
            "intercept": linear_model.intercept_
        }
    }
    return jsonify(graph_data)


if __name__ == '__main__':
    app.run(debug=True)