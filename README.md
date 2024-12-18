# City of Boston: City Budget

## Video Presentation
https://youtu.be/iNP8n7nPqCQ?feature=shared

## Project Description
The City of Boston's budget includes an **operating budget** and a **capital budget**. The operating budget handles day-to-day expenses including public employees and services. On the other hand, the capital budget is more focused on improving currently owned assets. To optimize the allocation of resources for these budgets, it is crucial to understand how Boston's money is being spent. Through collaboration with the Citywide Analytics Team, Boston's central data organization, this project aims to analyze how Boston spends its annual budget and any changes over time. Further, this project will contrast the projected spending against the actual spending and also examine per capita spending.

## How to Run the Code
1. **Clone the repository** (if applicable):
```bash
   git clone https://github.com/arionct/Boston-City-Budget
   cd ./Boston-City-Budget/
```
2. **Install dependencies and create a virtual environment:**
```bash
make install
```
This command will:
* Create a virtual environment called venv.
* Install all required Python packages listed in requirements.txt.

3. **Start the Flask application:**
```bash
make run
```

This will:
* Set the FLASK_APP environment variable to app.py.
* Start the Flask development server at http://localhost:3000.
* Enable development mode with automatic reloading.

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
* [Boston Neighborhood Demographics](https://data.boston.gov/dataset/neighborhood-demographics/resource/d8c23c6a-b868-4ba4-8a3b-b9615a21be07) - Poverty Rates, & Per Capita Income tabs of table

## Data Visualization
Visualizations: Please run our code to see interactive visualizations with interpretations, claims, and analysis. 

Our first few visualizations are bar graphs that depict the total budget/spending for various categories within the capital and operating budgets. The first bar graph explores the capital budget across all the departments, revealing the City of Boston’s emphasis on public education and Public Works. The next four bar graphs visualize the operating budget and actual operating expenses across the various expense categories (we attempted to graph across departments but there were far too many departments to build a coherent graph).

Going more in-depth with the operating budget we started with visualizing the data to get an understanding of the file. We were able to visualize the data through pie charts and line graphs (change over time) to show trends in the operating budget. Our first pie chart visualization (displaying the top 10 department's budgets) provides a breakdown of the budget allocations across the top 10 departments for the fiscal year of 2025. Each segment of the pie represented a department. With 32.9% Boston Public Schools received the largest share, which could show that there was a significant investment in education. Furthermore using a line graph we were able to visualize that Boston Public School had the highest expenses across all years with a noticeable upward trend compared to the other departments. We were also able to use another pie cart to display the budget by expense category with each slice representing a distinct category. We were able to see Personnel Services dominated the budget with 50.8%, which shows a significant investment in staffing and wages, highlighting that the city's focus was on supporting its workforce. Using a line graph we were also able to see the trends in spending throughout the years. This was able to show us that Personnel Services consistently had the highest expenses among the categories with a steady upward trend. Our last pie chart visualizes the top 10 program budgets. Overall in the program budgets, there was no one program with a greater percentage than the rest, however, pensions received the highest with 9.1% signifying a substantial commitment to retirement benefits for employees. We were also able to use a heatmap to display the cabinet expenses over multiple fiscal years. The color corresponded to the expense amount with darker shades indicating higher expenditures. From the heatmap, we were able to see that the Education Cabinet and Public Safety Cabinet had significantly higher expenses than the rest with Education having a steady increase from FY22 to FY25. Lastly, for the operating budget, we were able to use a treemap for the top 10 departmental expenses which further showed how Boston Public School received the largest allocation, amounting to $1,526,629,466.

The last visualizations shown were an analysis of city project spending by neighborhood. Bar charts were used to show in ascending order which neighborhoods had the highest budget, and a printed list was shown below. A double bar chart was used to compare this same average neighborhood project spending by neighborhood per-capita income. A correlation coefficient of 0.4 was calculated, suggesting a moderate, positive correlation between increased spending on neighborhoods with higher per-capita income. A linear regression model was fitted to project budget (Y) and per-capita neighborhood income (X), and the regression line also showed a positive increase in spending in higher-income neighborhoods. This data requires further research and refining since there are outliers in the scatter plot which do not fit to a normal distribution variance. More features will be used in the future to better understand city project spending by neighborhood such as population, race proportions, poverty rates, or educational attainment. Understanding city project expenses in neighborhoods based on these attributes can help policymakers redirect the city budget to places that need more care from the city.

## Data Processing
Fortunately, the data we are dealing with is entirely based in U.S. dollars. Thus, we did not need to perform any sort of data standardization to account for numerical differences that unnaturally occur as a result of unit differences. However, this is not to say that we did not engage in any data processing at all. Many of the cells reported “#Missing” values instead of numerical dollar values, meaning these cells would cause errors in numerical computation. Pandas made correcting these values very convenient, so they did not pose too much of an obstacle.

## Data Modeling & Preliminary Results
There are many categories of data that can result in many types of models and analyses:
* Our first method of modeling involves time series forecasting, allowing us to predict the budgets for the next few years. Considering we are working with time-based data to make these predictions, we decided to employ Autoregressive Integrated Moving Average (ARIMA) as implemented by the ARIMA class within the _statsmodels_ Python library; we made predictions for the different departments within the operating budget. These predictions can be used by City of Boston policymakers to make informed decisions about what departments will likely require more vs less attention in the future.
* Our next analysis involves observing the variance between budgeting and actual observed spending. To do this, we took the squared error between budget and actual spending and showed the results in the form of a bar graph. This would allow policymakers to identify areas of inaccurate budget creation whose methods might need to be modified. Further, areas with low such variance likely have robust methods for calculating a budget and these methods can likely be held (mostly) the same. For example, the Personnel Services expense category has by far the highest variance, meaning that its budget is quite inaccurate; it may be helpful to revise the methods for its budget creation.
* We also decided to perform an anomaly detection analysis. We used IsolationForest offered by _sklearn_ to pick out anomalous data points. We use FY 2025's operation budget. Then, we insert a column into this data called 'Anamoly,' which uses isolation forest to populate rows in the data with -1 if an entry is an anomaly. Then, each anomaly row is displayed alongside its department and program. These can be valuable for a variety of reasons; for our own use, this anomaly detection can indicate data points that may be outliers and should be excluded. This anomaly detection can also be helpful to policymakers to identify areas of incorrect data collection.
* Another analysis that we decided to undertake was investigating over spending. We fit a RandomForestClassifier to data in which spending was above the budget. Our model currently has an accuracy of roughly 67%, so we plan to tune some hyperparameters and if this proves unsuccessful, we will investigate alternative methods for classifying over spending. This would be very advantageous to policymakers to identify areas in which the the budget should be revised.
        - In progress tuning: class weight = balanced if overbudget has an imbalance. For example, far more departments are within budget. N_etsimators = 100, increasing trees --> improves accuracy performance. Max_depth = between 5 to 10; prevents over fitting when analyzing data with a small number of features.

## Testing
* We will split training and testing data. Therefore. 20% of the dataset can be kept for testing purposes, while the remaining 80% will be used for training. This approach ensures that the model is evaluated on unseen data to provide an unbiased estimate of its generalization capability.
* We can also use k-fold cross-validation (e.g., k=5 or k=10) to ensure the model's robustness by training and testing it on different subsets of the dataset. This approach will help us prevent overfitting and ensures the model performs well on unseen data.
* We will assess model perfomance base off of different locations and spending pattern with the actual test data we aquired with the test data.
* We can also use Mean Absolute Error (MAE), Mean Squared Error (MSE), R-squared, and classification accuracy (for over/under-spending models) to evaluate the model's performance. This can help us gather different aspects of model quality and gather info about the accuracy and/or error quantification.

## Repository
All the updated code relevant to our project is added in this repository. All the datasets and images are also in this repository.

## Deliverables
* Code and cleaned datasets are in the repo. Cleaned code and data by removing unnecessary punctuations and converting data to numerical values.
* Provided a detailed README with instruction on how to run the code.
* Video containing our visualizations and findings

## Progress Since Midterm Report: 
We added more geographical analysis based on economic data of neighborhoods: 
A model for project budget vs. poverty rate linear regression model.
Outlier detection and removal, along with Huber regression was used to improve our previous project budget vs. per capita income model from one month ago.

ARIMA Model for Time Series Analysis Forecasting on expenses in operating budget.

An interactive website detailing our findings and breaking down results based on budgets was implemented to allow for user accessibilty. Please read the 'How to Run the Code' section to run this website.

## Conclusion

### Operating Budget
The analysis of Boston's operating budget for FY25 highlights a strategic focus on education and workforce support, as demonstrated by the significant allocation to Boston Public Schools, which received the largest budget share at 32.9%. Over the years, Boston Public Schools have consistently shown an upward trend in expenses, underscoring the city's sustained investment in education. Similarly, the budget by expense category reveals that Personnel Services dominate at 50.8%, indicating the city's commitment to supporting its workforce through salaries, wages, and benefits. Other expense categories, such as contractual services and supplies, receive smaller allocations, reflecting the prioritization of employee-related costs over operational expenses.

The program budget analysis shows a balanced distribution, with pensions receiving the highest allocation among programs at 9.1%, reflecting a strong commitment to retirement benefits for city employees. The heatmap analysis provides further insights, highlighting that the Education and Public Safety Cabinets consistently have the highest expenditures across fiscal years. The steady increase in Education Cabinet spending from FY22 to FY25 emphasizes the city's prioritization of educational growth and development. Meanwhile, the treemap visualization reiterates Boston Public Schools' significant allocation and showcases how other top departments, like the Police and Fire Departments, contribute to public safety and essential services.

Overall, Boston's fiscal strategy reflects a deliberate emphasis on enhancing education, sustaining workforce support, and maintaining public safety. This balanced approach ensures that critical areas such as employee benefits, public services, and operational efficiency are well-funded, supporting the city's long-term goals for growth and sustainability.

### Geographical Analysis utilizing Capital Budget
In order to better examine possible causes for neighborhood project spending, we analyzed economic data that related to each neighborhood. We filtered the capital budget data to find the mean spending of total project budget per neighborhood. This represents the project budget value for its respective neighborhood. Charlestown's z-score for income was within a normal range, but its z-score for budget exceeded 3. Assuming a normal distribution of data, having a budget 3 standard deviations away from the mean is improbable at only about a 0.3% chance. Thus, this value was considered an outlier and filtered out. Huber regression, a linear regression model robust to outliers, was used to model our data. The huber regression line shows a greater trend upward once the one outlier was removed. A correlation coefficient, calculated the same way as in in the previous data visualization shows a score of 0.47. This shows a positive trend between the two variables, suggesting that city project spending increases as a neighborhood's per capita income increases. In order to better examine possible causes for neighborhood project spending, we analyzed economic data that related to each neighborhood. Project Budget by neighborhood was found the same as in the previously described model. This time, we examined the poverty rate. The correlation coefficient was slightly weaker at about -0.26. However, these models support each other in suggesting that neighborhoods with more wealthy citizens receive more funding from the city for various projects.


