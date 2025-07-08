import React from 'react'
import { FiDollarSign, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

function FinancialSummary({ summary }) {
    const { totalBalance, totalIncome, totalExpenses } = summary;

    return (
        <>
            <div className="dashboard-card">
                <div className="flex items-center">
                    <div className="p-3 rounded-full bg-primary-100 text-primary-600">
                        <FiDollarSign size={24} />
                    </div>
                    <div className="ml-4">
                        <h3 className="text-sm font-medium text-neutral-500">Current Balance</h3>
                        <p className="text-2xl font-semibold text-neutral-800">
                            ₹{totalBalance.toFixed(2)}
                        </p>
                    </div>
                </div>
            </div>

            <div className="dashboard-card">
                <div className="flex items-center">
                    <div className="p-3 rounded-full bg-accent-100 text-accent-600">
                        <FiTrendingUp size={24} />
                    </div>
                    <div className="ml-4">
                        <h3 className="text-sm font-medium text-neutral-500">Total Income</h3>
                        <p className="text-2xl font-semibold text-neutral-800">
                            ₹{totalIncome.toFixed(2)}
                        </p>
                    </div>
                </div>
            </div>

            <div className="dashboard-card">
                <div className="flex items-center">
                    <div className="p-3 rounded-full bg-error-500 bg-opacity-10 text-error-500">
                        <FiTrendingDown size={24} />
                    </div>
                    <div className="ml-4">
                        <h3 className="text-sm font-medium text-neutral-500">Total Expenses</h3>
                        <p className="text-2xl font-semibold text-neutral-800">
                            ₹{totalExpenses.toFixed(2)}
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default FinancialSummary
