import React, { useEffect, useState } from 'react'
import { FiPlusCircle, FiMinusCircle, FiRotateCw, FiDownload } from 'react-icons/fi';
import { SlActionUndo } from "react-icons/sl";
import DashboardHeader from '../components/DashboardHeader';
import FinancialCharts from '../components/FinancialCharts';
import FinancialSummary from '../components/FinancialSummary';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import { useTransactions } from '../hooks/useTransactions';

function Dashboard() {
  const [formType, setFormType] = useState(null); // income or expense or null
  const { transactions, loading, calculateSummary, resetAllTransactions, undoLastOperation, exportToCSV } = useTransactions();

  const [summary, setSummary] = useState({
    totalBalance: 0,
    totalIncome: 0,
    totalExpenses: 0,
    incomeCount: 0,
    expenseCount: 0
  });

  // Update sidebar values whenever summary changes
  useEffect(() => {
    const sidebarBalance = document.getElementById('sidebar-balance');
    const sidebarSavings = document.getElementById('sidebar-savings');

    if (sidebarBalance) {
      sidebarBalance.textContent = summary.totalBalance.toFixed(2);
    }

    if (sidebarSavings) {
      sidebarSavings.textContent = (summary.totalIncome - summary.totalExpenses).toFixed(2);
    }
  }, [summary]);

  // Recalculate summary when transactions change
  useEffect(() => {
    setSummary(calculateSummary());
  }, [transactions, calculateSummary]);
  
  return (
    <div className="py-6">
      <DashboardHeader />
      
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Financial Summary Cards */}
        <FinancialSummary summary={summary} />
        
        {/* Quick Actions */}
        <div className="lg:col-span-3 flex flex-wrap gap-3 justify-center sm:justify-start">
          <button
            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-700 transition cursor-pointer"
            onClick={() => setFormType('income')}
          >
            <FiPlusCircle className="mr-2" />
            Add Income
          </button>
          
          <button
            className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-red-700 transition cursor-pointer"
            onClick={() => setFormType('expense')}
          >
            <FiMinusCircle className="mr-2" />
            Add Expense
          </button>
          
          <button
            className="btn btn-secondary inline-flex items-center cursor-pointer"
            onClick={undoLastOperation}
          >
            <SlActionUndo className="mr-2" />
            Undo
          </button>
          
          <button
            className="btn btn-secondary inline-flex items-center cursor-pointer"
            onClick={() => {
              if (window.confirm('Are you sure you want to reset all transactions? This action cannot be undone.')) {
                resetAllTransactions();
              }
            }}
          >
            <FiRotateCw className="mr-2" />
            Reset
          </button>
          
          <button
            className="btn btn-secondary inline-flex items-center cursor-pointer"
            onClick={exportToCSV}
            disabled={transactions.length === 0}
          >
            <FiDownload className="mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Transaction Form Modal */}
      {formType && (
        <div className="fixed inset-0 bg-neutral-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 slide-up">
            <h2 className="text-xl font-semibold mb-4">
              {formType === 'income' ? 'Add Income' : 'Add Expense'}
            </h2>
            <TransactionForm
              type={formType}
              onClose={() => setFormType(null)}
            />
          </div>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts */}
        <div className="lg:col-span-3">
          <h2 className="text-xl font-semibold mb-4">Financial Overview</h2>
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-neutral-200">
            <FinancialCharts transactions={transactions} />
          </div>
        </div>
        
        {/* Transactions List */}
        <div className="lg:col-span-3">
          <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
          <TransactionList transactions={transactions} loading={loading} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard
