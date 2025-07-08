import { BarElement, CategoryScale, Chart, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from 'chart.js';
import React, { useMemo, useState } from 'react'
import { useMonthlySavings } from '../hooks/useMonthlySavings';
import { FiCalendar, FiTrendingUp, FiTrendingDown, FiDollarSign, FiBarChart2 } from 'react-icons/fi';
import { Bar, Line } from 'react-chartjs-2';


// Register Chart.js components
Chart.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

function MonthlySavingsView() {
  const { monthlySavings, loading, getMonthName, getYearlySummary } = useMonthlySavings();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [viewType, setViewType] = useState('monthly');

  // Get available years
  const availableYears = useMemo(() => {
    const years = [...new Set(monthlySavings.map(saving => saving.year))];
    return years.sort((a, b) => b - a);
  }, [monthlySavings]);

  // Filter data by selected year
  const yearlyData = monthlySavings.filter(saving => saving.year === selectedYear);

  // Get yearly summary
  const yearlySummary = getYearlySummary(selectedYear);

  // Prepare chart data for monthly view
  const monthlyChartData = useMemo(() => {
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const incomeData = [];
    const expenseData = [];
    const savingsData = [];
    const labels = [];

    months.forEach(month => {
      const monthData = yearlyData.find(saving => saving.month === month);
      labels.push(getMonthName(month).substring(0, 3));

      if (monthData) {
        incomeData.push(monthData.totalIncome);
        expenseData.push(monthData.expenseData);
        savingsData.push(monthData.savings);
      } else {
        incomeData.push(0);
        expenseData.push(0);
        savingsData.push(0);
      }
    });


    return {
      labels,
      datasets: [
        {
          label: 'Income',
          data: incomeData,
          backgroundColor: '#34C759',
          borderColor: '#34C759',
          borderWidth: 2,
          fill: false
        },
        {
          label: 'Expenses',
          data: expenseData,
          backgroundColor: '#FF3B30',
          borderColor: '#FF3B30',
          borderWidth: 2,
          fill: false
        },
        {
          label: 'Savings',
          data: savingsData,
          backgroundColor: '#0077FF',
          borderColor: '#0077FF',
          borderWidth: 2,
          fill: false
        }
      ]
    };
  }, [yearlyData, getMonthName]);

  // Prepare chart data for yearly comparison
  const yearlyChartData = useMemo(() => {
    const yearlyComparison = availableYears.map(year => {
      const summary = getYearlySummary(year);
      return {
        year,
        ...summary,
        averageMonthlySavings: summary.monthCount > 0 ? summary.totalSavings / summary.monthCount : 0
      };
    });

    return {
      labels: yearlyComparison.map(data => data.year.toString()),
      datasets: [
        {
          label: 'Total Income',
          data: yearlyComparison.map(data => data.totalIncome),
          backgroundColor: '#34C759',
          borderRadius: 4
        },
        {
          label: 'Total Expenses',
          data: yearlyComparison.map(data => data.totalExpenses),
          backgroundColor: '#FF3B30',
          borderRadius: 4
        },
        {
          label: 'Total Savings',
          data: yearlyComparison.map(data => data.totalSavings),
          backgroundColor: '#0077FF',
          borderRadius: 4
        }
      ]
    };
  }, [availableYears, getYearlySummary]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: $${context.raw.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '$' + value;
          }
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading monthly savings data...</div>
      </div>
    );
  }

  if (monthlySavings.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <FiBarChart2 size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-800 mb-2">No Monthly Data Available</h3>
        <p className="text-gray-600">
          Start tracking your finances and save monthly data to see your savings history.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Monthly Savings</h2>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex gap-2">
            <button
              onClick={() => setViewType('monthly')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${viewType === 'monthly'
                  ? 'bg-[#0077FF] text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              Monthly View
            </button>
            <button
              onClick={() => setViewType('yearly')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${viewType === 'yearly'
                  ? 'bg-[#0077FF] text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              Yearly Comparison
            </button>
          </div>
          
          {viewType === 'monthly' && (
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#0077FF]"
            >
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {viewType === 'monthly' ? (
        <>
          {/* Yearly Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-[#34C759] bg-opacity-10 text-[#34C759]">
                  <FiTrendingUp size={20} />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Total Income</h3>
                  <p className="text-xl font-semibold text-gray-800">
                    ₹{yearlySummary.totalIncome.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-[#FF3B30] bg-opacity-10 text-[#FF3B30]">
                  <FiTrendingDown size={20} />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Total Expenses</h3>
                  <p className="text-xl font-semibold text-gray-800">
                    ₹{yearlySummary.totalExpenses.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-[#0077FF] bg-opacity-10 text-[#0077FF]">
                  <FiDollarSign size={20} />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Total Savings</h3>
                  <p className="text-xl font-semibold text-gray-800">
                    ₹{yearlySummary.totalSavings.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-[#FF9500] bg-opacity-10 text-[#FF9500]">
                  <FiCalendar size={20} />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Avg Monthly</h3>
                  <p className="text-xl font-semibold text-gray-800">
                    ₹{yearlySummary.monthCount > 0 ? (yearlySummary.totalSavings / yearlySummary.monthCount).toFixed(2) : '0.00'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Monthly Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium mb-4">Monthly Breakdown - {selectedYear}</h3>
            <div className="h-80">
              <Line data={monthlyChartData} options={chartOptions} />
            </div>
          </div>

          {/* Monthly Data Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-medium">Monthly Details - {selectedYear}</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Month
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Income
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Expenses
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Savings
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transactions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {yearlyData.map((monthData) => (
                    <tr key={`${monthData.year}-${monthData.month}`} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                        {getMonthName(monthData.month)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#34C759]">
                        ₹{monthData.totalIncome.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#FF3B30]">
                        ₹{monthData.totalExpenses.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={monthData.savings >= 0 ? 'text-[#34C759]' : 'text-[#FF3B30]'}>
                          ₹{monthData.savings.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {monthData.transactionCount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Yearly Comparison View */
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium mb-4">Yearly Comparison</h3>
          <div className="h-80">
            <Bar data={yearlyChartData} options={chartOptions} />
          </div>
        </div>
      )}
    </div>
  );
}

export default MonthlySavingsView
