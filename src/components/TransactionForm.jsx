import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { FiX } from 'react-icons/fi';
import { useTransactions } from '../hooks/useTransactions';
import 'react-datepicker/dist/react-datepicker.css';

function TransactionForm({ type, onClose }) {
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date());
    const [tag, setTag] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { addTransaction } = useTransactions();

    const tags = type === 'income'
        ? ['Salary', 'Freelance', 'Investment', 'Gift', 'Other', 'PocketMoney']
        : ['Food', 'Shopping', 'Housing', 'Transportation', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Other'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!name || !amount || !tag) {
            setError('Please fill in all fields');
            return;
        }

        if (isNaN(amount) || parseFloat(amount) <= 0) {
            setError('Please enter a valid amount');
            return;
        }

        try {
            setLoading(true);
            const transaction = {
                name,
                amount: parseFloat(amount),
                date,
                tag,
                type
            };
            await addTransaction(transaction);
            onClose();
        } catch (error) {
            setError('Failed to add transaction');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            {error && (
                <div className="mb-4 bg-red-100 text-red-700 p-3 rounded-md text-sm">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={type === 'income' ? 'e.g., Salary' : 'e.g., Groceries'}
                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                        Amount ($)
                    </label>
                    <input
                        type="number"
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                        Date
                    </label>
                    <DatePicker
                        selected={date}
                        onChange={(date) => setDate(date)}
                        maxDate={new Date()}
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label htmlFor="tag" className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                    </label>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {tags.map((tagOption) => (
                            <button
                                key={tagOption}
                                type="button"
                                className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                                    tag === tagOption
                                        ? type === 'income'
                                            ? 'bg-green-500 text-white'
                                            : 'bg-blue-500 text-white'
                                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                }`}
                                onClick={() => setTag(tagOption)}
                            >
                                {tagOption}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className={`px-4 py-2 rounded-md text-white ${
                        type === 'income'
                            ? 'bg-green-600 hover:bg-green-700'
                            : 'bg-blue-600 hover:bg-blue-700'
                    } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {loading ? 'Adding...' : 'Add Transaction'}
                </button>
            </div>

            <button
                type="button"
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                aria-label="Close"
            >
                <FiX size={20} />
            </button>
        </form>
    );
}

export default TransactionForm;
