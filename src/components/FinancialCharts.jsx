import { useState } from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
Chart.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function FinancialCharts({transactions}) {
  const [chartType, setChartType] = useState('doughnut');
  
  // Process transaction data
  const processChartData = () => {
    if (!transactions || transactions.length === 0) {
      return {
        incomeVsExpense: {
          labels: ['Income', 'Expenses'],
          datasets: [{
            data: [0, 0],
            backgroundColor: ['#34C759', '#0077FF'],
            borderWidth: 0
          }]
        },
        incomeByCategory: {
          labels: [],
          datasets: [{
            data: [],
            backgroundColor: [],
            borderWidth: 0
          }]
        },
        expenseByCategory: {
          labels: [],
          datasets: [{
            data: [],
            backgroundColor: [],
            borderWidth: 0
          }]
        }
      };
    }

    // Calculate income vs expense totals
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    // Group income by category
    const incomeByCategory = transactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => {
        acc[t.tag] = (acc[t.tag] || 0) + t.amount;
        return acc;
      }, {});

    // Group expenses by category
    const expenseByCategory = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.tag] = (acc[t.tag] || 0) + t.amount;
        return acc;
      }, {});

    // Generate colors for categories
    const generateColors = (count) => {
      const colors = [
        '#0077FF', '#34C759', '#FF9500', '#FF3B30', '#5856D6', 
        '#FF2D55', '#AF52DE', '#007AFF', '#5AC8FA', '#4CD964'
      ];
      
      return Array(count).fill().map((_, i) => colors[i % colors.length]);
    };

    return {
      incomeVsExpense: {
        labels: ['Income', 'Expenses'],
        datasets: [{
          data: [totalIncome, totalExpense],
          backgroundColor: ['#34C759', '#FF3B30'],
          borderWidth: 0
        }]
      },
      incomeByCategory: {
        labels: Object.keys(incomeByCategory),
        datasets: [{
          data: Object.values(incomeByCategory),
          backgroundColor: generateColors(Object.keys(incomeByCategory).length),
          borderWidth: 0
        }]
      },
      expenseByCategory: {
        labels: Object.keys(expenseByCategory),
        datasets: [{
          data: Object.values(expenseByCategory),
          backgroundColor: generateColors(Object.keys(expenseByCategory).length),
          borderWidth: 0
        }]
      }
    };
  };

  const chartData = processChartData();

  // Chart options
  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 12,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: $${value.toFixed(2)}`;
          }
        }
      }
    },
    cutout: '60%'
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.raw || 0;
            return `${label}: $${value.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '₹' + value;
          }
        }
      }
    }
  };

  // Convert doughnut data to bar data
  const getBarData = (data) => {
    return {
      labels: data.labels,
      datasets: [
        {
          label: 'Amount',
          data: data.datasets[0].data,
          backgroundColor: data.datasets[0].backgroundColor,
          borderWidth: 0,
          borderRadius: 4,
        }
      ]
    };
  };

    return (
        <div>
            <div className="flex flex-wrap gap-3 mb-6">
                <button
                    className={`px-4 py-2 text-sm font-medium rounded-md ${chartType === 'doughnut' ? 'bg-primary-500 text-white' : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'}`}
                    onClick={() => setChartType('doughnut')}
                >
                    Pie Chart
                </button>
                <button
                    className={`px-4 py-2 text-sm font-medium rounded-md ${chartType === 'bar' ? 'bg-primary-500 text-white' : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'}`}
                    onClick={() => setChartType('bar')}
                >
                    Bar Chart
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-sm p-4 border border-neutral-200">
                    <h3 className="text-lg font-medium mb-4 text-center">Income vs Expenses</h3>
                    <div className="h-64">
                        {chartType === 'doughnut' ? (
                            <Doughnut data={chartData.incomeVsExpense} options={doughnutOptions} />
                        ) : (
                            <Bar data={getBarData(chartData.incomeVsExpense)} options={barOptions} />
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-4 border border-neutral-200">
                    <h3 className="text-lg font-medium mb-4 text-center">Income by Category</h3>
                    <div className="h-64">
                        {chartType === 'doughnut' ? (
                            <Doughnut data={chartData.incomeByCategory} options={doughnutOptions} />
                        ) : (
                            <Bar data={getBarData(chartData.incomeByCategory)} options={barOptions} />
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-4 border border-neutral-200">
                    <h3 className="text-lg font-medium mb-4 text-center">Expenses by Category</h3>
                    <div className="h-64">
                        {chartType === 'doughnut' ? (
                            <Doughnut data={chartData.expenseByCategory} options={doughnutOptions} />
                        ) : (
                            <Bar data={getBarData(chartData.expenseByCategory)} options={barOptions} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FinancialCharts
