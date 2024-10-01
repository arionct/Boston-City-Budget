# City of Boston: City Budget

## Description
The City of Boston's budget includes an **operating budget** and a **capital budget**. The operating budget handles day-to-day expenses including public employees and services. On the other hand, the capital budget is more focused on improving currently owned assets. To optimize the allocation of resources for these budgets, it is crucial to understand how Boston's money is being spent. Through collaboration with the Citywide Analytics Team, Boston's central data organization, this project aims to analyze how Boston spends its annual budget and any changes over time. Further, this project will contrast the projected spending against the actual spending and also examine per capita spending.

## Goal
The ultimate goal of this project is to improve the City of Boston's allocation of resources through the analysis of documented data. This project seeks to achieve this by:
* Observing the spending's change over time to isolate any trends
* Identifying differences in projected spending and actual spending
* Exploring per capita spending
* Investigating spending by department, budget category, geography, and program

## Data Required
This project will use data collected by the Citywide Analytics Team:
* [Boston's operating budget](https://data.boston.gov/dataset/operating-budget/resource/3575b787-c1b6-4275-b4e1-c111a3601b75?inner_span=True)
* [Boston's capital budget](https://data.boston.gov/dataset/capital-budget/resource/c62d666e-27ea-4c03-9cb1-d3a81a1fb641)
* [Summary of Boston's expenditures](https://data.boston.gov/dataset/checkbook-explorer)
* [General Boston data](https://data.boston.gov/)

## Data Modeling
These are some ideas for how this project may model the data to be able to draw relevant conclusions:
* **Time Series Modeling:** observe trends over time using tools such as ARIMA, exponential smoothing, etc.
* **Variance Analysis with Regression Models:** identify differences in projected and actual spending.
* **Per Capita Spending Analysis:** explore per capita spending by normalizing spending data by population.
* **Cluster Analysis for Geographical and Departmental Spending:** use clustering algorithms to group locations or departments to better target budgeting.
* **Classification Models:** classify a given budget as over/under-spending using models such as a decision tree or logistic regression.

## Data Visualization
* Bar charts comparing the spending of different categories; compare spending by different departments, compare spending by different budget categories, compare spending by geography (which areas receive the most funding), compare spending by program. Each of these categories will receive a bar chart that shows which department, category, area, or program receives the most funding.
* From the bar chart data, we will select fields that take up higher amounts of the budget. We will make a scatter plot and draw a line of best fit to analyze the city's spending trends in this field over a period of time.
* Scatter plots comparing city spending in certain areas alongside the median income of said area
* Use bullet graphs to compare actual spending against budgeted amounts or targets, helping to identify areas of over- or under-spending.

## Testing
xyz
