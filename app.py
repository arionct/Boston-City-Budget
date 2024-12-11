import matplotlib.pyplot as plt
from flask import Flask, render_template, jsonify
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression, HuberRegressor
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

@app.route('/operating-budget.html')
def operating():
  return render_template('operating-budget.html')

@app.route('/geography.html')
def geography():
  return render_template('geography.html')


#------------------------------------------------------------------------------------------------
# Capital Budget
#------------------------------------------------------------------------------------------------
@app.route('/get-capital-department-budgets')
def get_capital_department_budgets():
    grouped = cap_budg.groupby('Department')['Total_Project_Budget'].sum()
    # Prepare data for Chart.js
    labels = grouped.index.tolist()
    values = grouped.values.tolist()

    return jsonify({
        'labels': labels,
        'values': values
    })


#------------------------------------------------------------------------------------------------
# Operating Budget
#------------------------------------------------------------------------------------------------
# Summing expenses by department for each fiscal year

pd.options.display.float_format = '{:,.2f}'.format

# Top 10 Dept by FY25 Budget
@app.route('/operating-budget.html/top-10-dept-by-fy25-budget')
def get_operating_budget():
    dept_spending = op_budg.groupby('Dept')[['FY22 Actual Expense', 'FY23 Actual Expense', 'FY24 Appropriation', 'FY25 Budget']].sum()
    dept_spending = dept_spending.sort_values('FY25 Budget', ascending=False)

    n = 10
    top_n = dept_spending.head(n)  # Get the top 10 departments
    other = dept_spending.iloc[n:].sum()  # Sum the remaining departments
    top_n.loc['Other'] = other  # Add an 'Other' category

    data = top_n.reset_index().to_dict(orient='records')
    return jsonify(data)

@app.route('/operating-budget.html/expense_category')
def get_expense_category():
    category_spending = op_budg.groupby('Expense Category')['FY25 Budget'].sum()
    category_spending = category_spending.sort_values(ascending=False)
    data = category_spending.reset_index().to_dict(orient='records')
  
    return jsonify(data)

@app.route('/operating-budget.html/top-10-dept-by-fy25-budget')
def get_top_10_dept():
  n = 10

  dept_spending = op_budg.groupby('Dept')[['FY22 Actual Expense', 'FY23 Actual Expense', 'FY24 Appropriation', 'FY25 Budget']].sum()
  dept_spending_sorted = dept_spending.sort_values('FY25 Budget', ascending=False)
  top_n = dept_spending_sorted.head(n)

  response_data = top_n.reset_index().to_dict(orient='records')

  return jsonify(response_data)

@app.route('/operating-budget.html/top-10-program_budget')
def get_program_budget():
    n_program = 10
    program_spending = op_budg.groupby('Program')['FY25 Budget'].sum()
    program_spending = program_spending.sort_values(ascending=False)
    # Select the top 10 programs and sum the rest as "Other"
    top_n_program = program_spending.head(n_program)
    other = program_spending.iloc[n_program:].sum()
    top_n_program.loc['Other'] = other
    data = top_n_program.reset_index().to_dict(orient='records')

    return jsonify(data)

@app.route('/operating-budget.html/expense_category_over_year')
def get_expense_category_over_year():
    category_spending = op_budg.groupby('Expense Category')[['FY22 Actual Expense', 'FY23 Actual Expense', 'FY24 Appropriation', 'FY25 Budget']].sum()

    response_data = {
        "categories": [],
        "years": ["FY22", "FY23", "FY24", "FY25"]
    }

    for category, row in category_spending.iterrows():
        response_data["categories"].append({
        "category": category,
        "expenses": {
            "FY22": row['FY22 Actual Expense'],
            "FY23": row['FY23 Actual Expense'],
            "FY24": row['FY24 Appropriation'],
            "FY25": row['FY25 Budget']
        }})
        
    return jsonify(response_data)

@app.route('/get-huber-reg-data')
def get_huber_reg():
    neighborhood_budg = cap_budg.groupby(
        'Neighborhood')['Total_Project_Budget'].mean().sort_values(ascending=True)
    # Load and clean neighborhood income data
    npi = pd.read_csv('./data/2015-2019_neighborhood_tables_2021.12.21.csv')
    npi.columns = ['Neighborhood', 'Total Population', 'Income', 'Per Capita Income']
    npi = npi[['Neighborhood', 'Total Population','Income', 'Per Capita Income']].dropna()
    npi = npi.iloc[3:].reset_index(drop=True)
    npi['Total Population'] = npi['Total Population'].str.replace(',', '').astype(int)
    npi['Income'] = npi['Income'].str.replace(',', '').str.replace('$', '').astype(float)
    npi['Per Capita Income'] = npi['Per Capita Income'].str.replace(',', '').str.replace('$', '').astype(float)

    # Merge the two datasets
    combined_df = pd.DataFrame({
        'Project Budget': neighborhood_budg,
        'Per Capita Income': npi.set_index('Neighborhood')['Per Capita Income']
    }).dropna()

    # Calculate Z-scores and remove outliers
    combined_df['Z_Score_Income'] = zscore(combined_df['Per Capita Income'])
    combined_df['Z_Score_Budget'] = zscore(combined_df['Project Budget'])
    outliers = combined_df[(combined_df['Z_Score_Income'].abs() > 3) | (combined_df['Z_Score_Budget'].abs() > 3)]
    filtered_df = combined_df.drop(outliers.index)

    # Prepare regression
    X_filtered = filtered_df[['Per Capita Income']].values
    Y_filtered = filtered_df['Project Budget'].values
    robust_model = HuberRegressor()
    robust_model.fit(X_filtered, Y_filtered)
    y_robust_pred = robust_model.predict(X_filtered)

    correlation = filtered_df['Project Budget'].corr(filtered_df['Per Capita Income'])

    graph_data = {
        "scatterplot": {
            "x": filtered_df['Per Capita Income'].tolist(),
            "y": filtered_df['Project Budget'].tolist(),
            "labels": filtered_df.index.tolist() if "Neighborhood" not in filtered_df else filtered_df['Neighborhood'].tolist() 
        },
        "regression_line": {
            "x": filtered_df['Per Capita Income'].tolist(),
            "y": y_robust_pred.tolist()
        },
        "model": {
            "coefficients": robust_model.coef_.tolist(),
            "intercept": robust_model.intercept_,
            "correlation": correlation
        }
    }
    return jsonify(graph_data)

@app.route('/get-poverty-reg-data')
def get_poverty_reg():
    neighborhood_budg = cap_budg.groupby(
        'Neighborhood')['Total_Project_Budget'].mean().sort_values(ascending=True)
    poverty_data = pd.read_csv('./data/2015-2019_neighborhood_data_povertyrates.csv')
    poverty_data['Poverty rate'] = pd.to_numeric(
        poverty_data['Poverty rate'].str.replace('%', ''), errors='coerce') / 100

    pd_combined_df = pd.merge(
        poverty_data, neighborhood_budg, on='Neighborhood', how='outer')
    pd_combined_df = pd_combined_df.dropna(
        subset=['Poverty rate', 'Total_Project_Budget'])

    X = pd_combined_df[['Poverty rate']].values
    Y = pd_combined_df['Total_Project_Budget'].values
    linear_model = LinearRegression()
    linear_model.fit(X, Y)

    # Create a line of best fit
    x_line = np.linspace(pd_combined_df['Poverty rate'].min(), pd_combined_df['Poverty rate'].max(), 100)
    y_line = linear_model.predict(x_line.reshape(-1, 1))
    correlation = pd_combined_df['Total_Project_Budget'].corr(pd_combined_df['Poverty rate'])

    graph_data = {
        "scatterplot": {
            "x": pd_combined_df['Poverty rate'].tolist(),
            "y": pd_combined_df['Total_Project_Budget'].tolist(),
            "labels": pd_combined_df.index.tolist() if "Neighborhood" not in pd_combined_df else pd_combined_df['Neighborhood'].tolist() 
        },
        "regression_line": {
            "x": x_line.tolist(),
            "y": y_line.tolist()
        },
        "model": {
            "coefficients": linear_model.coef_.tolist(),
            "intercept": linear_model.intercept_,
            "correlation": correlation
        }
    }
    return jsonify(graph_data)

if __name__ == '__main__':
    app.run(debug=True)
