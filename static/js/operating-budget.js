fetch('/operating-budget.html/top-10-dept-by-fy25-budget')
  .then(response => response.json())
  .then(data => {
    const labels = data.map(item => item.Dept);
    const budgetData = data.map(item => item['FY25 Budget']);

    const ctx = document.getElementById('department_budget').getContext('2d');

    const colors = {
      "Boston Public Schools": { background: 'rgba(0, 102, 204, 0.7)', border: 'rgba(0, 102, 204, 1)' },
      "Other": { background: 'rgba(51, 153, 255, 0.7)', border: 'rgba(51, 153, 255, 1)' },
      "Police Department": { background: 'rgba(255, 102, 0, 0.7)', border: 'rgba(255, 102, 0, 1)' },
      "Pensions": { background: 'rgba(0, 153, 0, 0.7)', border: 'rgba(0, 153, 0, 1)' },
      "Fire Department": { background: 'rgba(255, 51, 51, 0.7)', border: 'rgba(255, 51, 51, 1)' },
      "Charter School Tuition": { background: 'rgba(153, 0, 255, 0.7)', border: 'rgba(153, 0, 255, 1)' },
      "Debt Service": { background: 'rgba(102, 51, 0, 0.7)', border: 'rgba(102, 51, 0, 1)' },
      "Health Insurance": { background: 'rgba(255, 153, 204, 0.7)', border: 'rgba(255, 153, 204, 1)' },
      "MBTA": { background: 'rgba(102, 255, 255, 0.7)', border: 'rgba(102, 255, 255, 1)' },
      "Public Works Department": { background: 'rgba(153, 153, 153, 0.7)', border: 'rgba(153, 153, 153, 1)' },
      "Public Health Commission": { background: 'rgba(255, 204, 51, 0.7)', border: 'rgba(255, 204, 51, 1)' }
    };

    const backgroundColors = labels.map(label => colors[label]?.background || 'rgba(0, 0, 0, 0.5)');
    const borderColors = labels.map(label => colors[label]?.border || 'rgba(0, 0, 0, 1)');

    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: budgetData,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          tooltip: {
            callbacks: {
              label: function(tooltipItem) {
                return tooltipItem.label + ': $' + tooltipItem.raw.toLocaleString(); // Format as currency
              }
            }
          }
        }
      }
    });
  })
  .catch(error => console.error('Error fetching data:', error));

  fetch('/operating-budget.html/expense_category')
  .then(response => response.json())
  .then(data => {
    const labels = data.map(item => item['Expense Category']); 
    const budgetData = data.map(item => item['FY25 Budget']); 

    const ctx = document.getElementById('cat_budget').getContext('2d');

    const categoryColors = {
        "Personnel Services": { background: 'rgba(0, 102, 204, 0.7)', border: 'rgba(0, 102, 204, 1)' }, // Dark Blue
        "Other Expenses": { background: 'rgba(51, 153, 255, 0.7)', border: 'rgba(51, 153, 255, 1)' }, // Light Blue
        "Contractual Services": { background: 'rgba(255, 102, 0, 0.7)', border: 'rgba(255, 102, 0, 1)' }, // Orange
        "Current Charges & Obligations": { background: 'rgba(0, 153, 0, 0.7)', border: 'rgba(0, 153, 0, 1)' }, // Green
        "Fixed Expenses": { background: 'rgba(255, 51, 51, 0.7)', border: 'rgba(255, 51, 51, 1)' }, // Red
        "Supplies & Materials": { background: 'rgba(153, 0, 255, 0.7)', border: 'rgba(153, 0, 255, 1)' }, // Purple
        "Equipment": { background: 'rgba(102, 51, 0, 0.7)', border: 'rgba(102, 51, 0, 1)' } // Brown
    };
      

    const backgroundColors = labels.map(label => categoryColors[label]?.background || 'rgba(0, 0, 0, 0.5)'); 
    const borderColors = labels.map(label => categoryColors[label]?.border || 'rgba(0, 0, 0, 1)');

    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels, 
        datasets: [{
          data: budgetData,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          tooltip: {
            callbacks: {
              label: function(tooltipItem) {
                return tooltipItem.label + ': $' + tooltipItem.raw.toLocaleString(); 
              }
            }
          }
        }
      }
    });
  })
  .catch(error => console.error('Error fetching data:', error));



fetch('/operating-budget.html/top-10-program_budget')
  .then(response => response.json())
  .then(data => {
    const labels = data.map(item => item['Program']); 
    const budgetData = data.map(item => item['FY25 Budget']); 

    const ctx = document.getElementById('top-10-program_budget').getContext('2d');

    const programColors = {
        "Pensions": { background: 'rgba(0, 153, 0, 0.7)', border: 'rgba(0, 153, 0, 1)' }, // Green
        "BPS Operations": { background: 'rgba(0, 102, 204, 0.7)', border: 'rgba(0, 102, 204, 1)' }, // Dark Blue
        "Charter School Tuition": { background: 'rgba(153, 0, 255, 0.7)', border: 'rgba(153, 0, 255, 1)' }, // Purple
        "Debt Service": { background: 'rgba(102, 51, 0, 0.7)', border: 'rgba(102, 51, 0, 1)' }, // Brown
        "K-8": { background: 'rgba(51, 153, 255, 0.7)', border: 'rgba(51, 153, 255, 1)' }, // Light Blue
        "Bureau of Field Services": { background: 'rgba(255, 102, 0, 0.7)', border: 'rgba(255, 102, 0, 1)' }, // Orange
        "Health Insurance": { background: 'rgba(255, 153, 204, 0.7)', border: 'rgba(255, 153, 204, 1)' }, // Light Pink
        "Boston Fire Suppression": { background: 'rgba(255, 51, 51, 0.7)', border: 'rgba(255, 51, 51, 1)' }, // Red
        "BPS Finance": { background: 'rgba(0, 102, 204, 0.7)', border: 'rgba(0, 102, 204, 1)' }, // Dark Blue
        "Elementary": { background: 'rgba(54, 162, 235, 0.7)', border: 'rgba(54, 162, 235, 1)' }, // Soft Blue
        "High": { background: 'rgba(255, 205, 86, 0.7)', border: 'rgba(255, 205, 86, 1)' }, // Yellow
        "Public Health Commission": { background: 'rgba(255, 204, 51, 0.7)', border: 'rgba(255, 204, 51, 1)' }, // Bright Yellow
        "MBTA": { background: 'rgba(102, 255, 255, 0.7)', border: 'rgba(102, 255, 255, 1)' }, // Aqua Blue
        "Reserve for Collective Bargaining City": { background: 'rgba(201, 203, 207, 0.7)', border: 'rgba(201, 203, 207, 1)' }, // Light Gray
        "BAT-Admin & Technology": { background: 'rgba(192, 75, 75, 0.7)', border: 'rgba(192, 75, 75, 1)' }, // Deep Red
        "Other": { background: 'rgba(153, 153, 153, 0.7)', border: 'rgba(153, 153, 153, 1)' } // Neutral Gray
    };
      

    const backgroundColors = labels.map(label => programColors[label]?.background || 'rgba(0, 0, 0, 0.5)'); 
    const borderColors = labels.map(label => programColors[label]?.border || 'rgba(0, 0, 0, 1)'); 

    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: budgetData,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          tooltip: {
            callbacks: {
              label: function(tooltipItem) {
                return tooltipItem.label + ': $' + tooltipItem.raw.toLocaleString(); 
              }
            }
          }
        }
      }
    });
  })
  .catch(error => console.error('Error fetching data:', error));


fetch('/operating-budget.html/top-10-dept-by-fy25-budget')
    .then(response => response.json())
    .then(data => {
    const ctx = document.getElementById('department_budget_over_years').getContext('2d');

    const filteredData = data.filter(item => item.Dept !== "Other");

    const labels = ["FY22", "FY23", "FY24", "FY25"];

    const departmentColors = {
        "Boston Public Schools": 'rgba(255, 99, 132, 1)', // Red
        "Police Department": 'rgba(54, 162, 235, 1)', // Blue
        "Pensions": 'rgba(255, 205, 86, 1)', // Yellow
        "Fire Department": 'rgba(75, 192, 192, 1)', // Teal
        "Charter School Tuition": 'rgba(153, 102, 255, 1)', // Purple
        "Debt Service": 'rgba(102, 51, 0, 1)', // Brown
        "Health Insurance": 'rgba(255, 153, 204, 1)', // Pink
        "MBTA": 'rgba(102, 255, 255, 1)', // Light Cyan
        "Public Works Department": 'rgba(153, 153, 153, 1)', // Gray
        "Public Health Commission": 'rgba(255, 204, 51, 1)', // Orange-Yellow
        "Other": 'rgba(51, 153, 255, 1)' // Light Blue
    };

    const datasets = filteredData.map(item => ({
        label: item.Dept, 
        data: [
        item['FY22 Actual Expense'],
        item['FY23 Actual Expense'],
        item['FY24 Appropriation'],
        item['FY25 Budget']
        ],
        borderColor: departmentColors[item.Dept],
        backgroundColor: departmentColors[item.Dept].replace('1)', '0.5)'), 
        fill: false
    }));

    new Chart(ctx, {
        type: 'line',
        data: {
        labels: labels,
        datasets: datasets
        },
        options: {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            tooltip: {
            callbacks: {
                label: function(tooltipItem) {
                return tooltipItem.dataset.label + ': $' + tooltipItem.raw.toLocaleString(); 
                }
            }
            }
        },
        scales: {
            y: {
            ticks: {
                callback: function(value) {
                return '$' + value.toLocaleString(); 
                }
            }
            }
        }
        }
    });
    })
    .catch(error => console.error('Error fetching data:', error));


fetch('/operating-budget.html/expense_category_over_year')
    .then(response => response.json())
    .then(data => {
      const ctx = document.getElementById('cat_exp_over_years').getContext('2d');
  
      const years = data.years;
      const categories = data.categories;
  
      const categoryColors = {
        "Contractual Services": 'rgba(255, 99, 132, 1)',
        "Current Charges & Obligations": 'rgba(54, 162, 235, 1)',
        "Equipment": 'rgba(255, 205, 86, 1)',
        "Fixed Expenses": 'rgba(75, 192, 192, 1)',
        "Other Expenses": 'rgba(153, 102, 255, 1)',
        "Personnel Services": 'rgba(201, 203, 207, 1)',
        "Supplies & Materials": 'rgba(255, 159, 64, 1)'
      };
  
      const datasets = categories.map(cat => ({
        label: cat.category, 
        data: years.map(year => cat.expenses[year]), 
        borderColor: categoryColors[cat.category], 
        backgroundColor: categoryColors[cat.category].replace('1)', '0.5)'), 
        fill: false
      }));
  
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: years, 
          datasets: datasets
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'top' },
            tooltip: {
              callbacks: {
                label: function(tooltipItem) {
                  return tooltipItem.dataset.label + ': $' + tooltipItem.raw.toLocaleString(); 
                }
              }
            }
          },
          scales: {
            y: {
              ticks: {
                callback: function(value) {
                  return '$' + value.toLocaleString(); 
                }
              }
            }
          }
        }
      });
    })
    .catch(error => console.error('Error fetching data:', error));
  