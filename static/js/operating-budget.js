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
