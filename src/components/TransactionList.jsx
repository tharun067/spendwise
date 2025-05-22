import React, { useMemo, useState } from 'react'
import { useTransactions } from '../hooks/useTransactions';
import { format } from 'date-fns';
import { FiTrash2, FiEdit2, FiFilter } from 'react-icons/fi';

function TransactionList({ transactions, loading }) {
    const [sortField, setSortField] = useState('date');
    const [sortDirection, setSortDirection] = useState('desc');
    const [filterType, setFilterType] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    const { deleteTransaction } = useTransactions();

    // Filter and sort transaction
    const filteredAndSortedTransactions = useMemo(() => {
        let result = [...transactions];

        // Apply type filter
        if (filterType !== 'all') {
            result = result.filter(t => t.type === filterType);
        }

        // Apply search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(t => t.name.toLowerCase().includes(term) || t.tag.toLowerCase().includes(term));
        }

        // Apply sorting
        result.sort((a, b) => {
            let aValue = a[sortField];
            let bValue = b[sortField];

            // Handle date comparison
            if (sortField === 'date') {
                aValue = new Date(aValue).getTime();
                bValue = new Date(bValue).getTime();
            }

            // Handle string comparison
            if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }

            if (sortDirection === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;

            }
        });
        return result;
    }, [transactions, sortField, sortDirection, filterType, searchTerm])
    
    // Handle sort change
    const handleSort = (field) => {
        if (field === sortField) {
            // Toggle direction if clicking the same field
            setSortDirection(sortDirection === 'asc' ? 'decs' : 'asc');
        } else {
            // Set new field and default to descending
            setSortField(field);
            setSortDirection('desc');
        }
    };

    // Get sort indicator
    const getSortIndicator = (field) => {
        if (field !== sortField) return null;
        return sortDirection === 'asc' ? '↑' : '↓';
    };

    
    return (
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
            <div className="p-4 border-b border-neutral-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center">
                    <h3 className="font-medium">Transactions</h3>
                    <span className="ml-2 text-sm text-neutral-500">
                        {filteredAndSortedTransactions.length} {filteredAndSortedTransactions.length === 1 ? 'item' : 'items'}
                    </span>
                </div>
        
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <input
                        type="text"
                        placeholder="Search transactions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-3 py-1 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 w-full sm:w-auto"
                    />
          
                    <button
                        className="btn btn-secondary py-1 px-3 flex items-center text-sm"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <FiFilter size={16} className="mr-1" />
                        Filters
                    </button>
                </div>
            </div>
      
            {showFilters && (
                <div className="p-4 bg-neutral-50 border-b border-neutral-200 flex flex-wrap gap-2">
                    <div>
                        <label htmlFor="filterType" className="block text-xs font-medium text-neutral-600 mb-1">
                            Transaction Type
                        </label>
                        <select
                            id="filterType"
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="px-3 py-1 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                        >
                            <option value="all">All Types</option>
                            <option value="income">Income Only</option>
                            <option value="expense">Expenses Only</option>
                        </select>
                    </div>
                </div>
            )}
      
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-neutral-200">
                    <thead className="bg-neutral-50">
                        <tr>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider cursor-pointer hover:text-neutral-700"
                                onClick={() => handleSort('name')}
                            >
                                Name {getSortIndicator('name')}
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider cursor-pointer hover:text-neutral-700"
                                onClick={() => handleSort('amount')}
                            >
                                Amount {getSortIndicator('amount')}
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider cursor-pointer hover:text-neutral-700"
                                onClick={() => handleSort('type')}
                            >
                                Type {getSortIndicator('type')}
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider cursor-pointer hover:text-neutral-700"
                                onClick={() => handleSort('tag')}
                            >
                                Category {getSortIndicator('tag')}
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider cursor-pointer hover:text-neutral-700"
                                onClick={() => handleSort('date')}
                            >
                                Date {getSortIndicator('date')}
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-neutral-200">
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-4 text-center text-sm text-neutral-500">
                                    Loading transactions...
                                </td>
                            </tr>
                        ) : filteredAndSortedTransactions.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-4 text-center text-sm text-neutral-500">
                                    No transactions found.
                                </td>
                            </tr>
                        ) : (
                            filteredAndSortedTransactions.map((transaction) => (
                                <tr key={transaction.id} className="hover:bg-neutral-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-800">
                                        {transaction.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={transaction.type === 'income' ? 'text-accent-600' : 'text-error-500'}>
                                            {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${transaction.type === 'income'
                                                ? 'bg-accent-100 text-accent-800'
                                                : 'bg-primary-100 text-primary-800'
                                            }`}>
                                            {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                                        {transaction.tag}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                                        {format(new Date(transaction.date), 'MMM dd, yyyy')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            className="text-neutral-400 hover:text-neutral-600 mr-3"
                                            aria-label={`Edit ${transaction.name}`}
                                        >
                                            <FiEdit2 size={16} />
                                        </button>
                                        <button
                                            className="text-neutral-400 hover:text-error-500"
                                            onClick={() => {
                                                if (window.confirm('Are you sure you want to delete this transaction?')) {
                                                    deleteTransaction(transaction.id);
                                                }
                                            }}
                                            aria-label={`Delete ${transaction.name}`}
                                        >
                                            <FiTrash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default TransactionList
