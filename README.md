# City of Boston: City Budget

## Video Presentation
https://youtu.be/iNP8n7nPqCQ?feature=shared

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
* [Boston's operating budget](https://data.boston.gov/dataset/operating-budget/resource/8f2971f0-7a0d-401d-8376-0289e3b810ba)
* [Boston's capital budget](https://data.boston.gov/dataset/capital-budget/resource/c62d666e-27ea-4c03-9cb1-d3a81a1fb641)
* [Summary of Boston's expenditures](https://data.boston.gov/dataset/checkbook-explorer)
* [General Boston data](https://data.boston.gov/)

## Data Visualization
Our first few visualizations are bar graphs that depict the total budget/spending for various categories within the capital and operating budgets. The first bar graph explores the capital budget across all the departments, revealing the City of Boston’s emphasis on public education and Public Works. The next four bar graphs visualize the operating budget and actual operating expenses across the various expense categories (we attempted to graph across departments but there were far too many departments to build a coherent graph).

The last visualizations shown were an analysis of city project spending by neighborhood. Bar charts were used to show in ascending order which neighborhoods had the highest budget, and a printed list was shown below. A double bar chart was used to compare this same average neighborhood project spending by neighborhood per-capita income. A correlation coefficient of 0.4 was calculated, suggesting a moderate, positive correlation between increased spending on neighborhoods with higher per-capita income. A linear regression model was fitted to project budget (Y) and per-capita neighborhood income (X), and the regression line also showed a positive increase in spending in higher-income neighborhoods. This data requires further research and refining since there are outliers in the scatter plot which do not fit to a normal distribution variance. More features will be used in the future to better understand city project spending by neighborhood such as population, race proportions, poverty rates, or educational attainment. Understanding city project expenses in neighborhoods based on these attributes can help policymakers redirect the city budget to places that need more care from the city.

## Data Processing
Fortunately, the data we are dealing with is entirely based in U.S. dollars. Thus, we did not need to perform any sort of data standardization to account for numerical differences that unnaturally occur as a result of unit differences. However, this is not to say that we did not engage in any data processing at all. Many of the cells reported “#Missing” values instead of numerical dollar values, meaning these cells would cause errors in numerical computation. Pandas made correcting these values very convenient, so they did not pose too much of an obstacle.

## Data Modeling & Preliminary Results
There are many categories of data that can result in many types of models and analyses:
* Our first method of modeling involves time series forecasting, allowing us to predict the budgets for the next few years. Considering we are working with time-based data to make these predictions, we decided to employ Autoregressive Integrated Moving Average (ARIMA) as implemented by the ARIMA class within the _statsmodels_ Python library; we made predictions for the different departments within the operating budget. These predictions can be used by City of Boston policymakers to make informed decisions about what departments will likely require more vs less attention in the future.
* Our next analysis involves observing the variance between budgeting and actual observed spending. To do this, we took the squared error between budget and actual spending and showed the results in the form of a bar graph. This would allow policymakers to identify areas of inaccurate budget creation whose methods might need to be modified. Further, areas with low such variance likely have robust methods for calculating a budget and these methods can likely be held (mostly) the same. For example, the Personnel Services expense category has by far the highest variance, meaning that its budget is quite inaccurate; it may be helpful to revise the methods for its budget creation.
* We also decided to perform an anomaly detection analysis. We used IsolationForest offered by _sklearn_ to pick out anomalous data points. We use FY 2025's operation budget. Then, we insert a column into this data called 'Anamoly,' which uses isolation forest to populate rows in the data with -1 if an entry is an anomaly. Then, each anomaly row is displayed alongside its department and program. These can be valuable for a variety of reasons; for our own use, this anomaly detection can indicate data points that may be outliers and should be excluded. This anomaly detection can also be helpful to policymakers to identify areas of incorrect data collection.
* Another analysis that we decided to undertake was investigating over spending. We fit a RandomForestClassifier to data in which spending was above the budget. Our model currently has an accuracy of roughly 67%, so we plan to tune some hyperparameters and if this proves unsuccessful, we will investigate alternative methods for classifying over spending. This would be very advantageous to policymakers to identify areas in which the the budget should be revised.

## Testing
* We will split training and testing data. Therefore. 20% of the dataset can be kept for testing purposes, while the remaining 80% will be used for training. This approach ensures that the model is evaluated on unseen data to provide an unbiased estimate of its generalization capability.
* We can also use k-fold cross-validation (e.g., k=5 or k=10) to ensure the model's robustness by training and testing it on different subsets of the dataset. This approach will help us prevent overfitting and ensures the model performs well on unseen data.
* We will assess model perfomance base off of different locations and spending pattern with the actual test data we aquired with the test data.
* We can also use Mean Absolute Error (MAE), Mean Squared Error (MSE), R-squared, and classification accuracy (for over/under-spending models) to evaluate the model's performance. This can help us gather different aspects of model quality and gather info about the accuracy and/or error quantification.
