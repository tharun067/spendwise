import { FiArrowLeft, FiCheckCircle, FiDollarSign, FiList, FiPieChart } from 'react-icons/fi';
import { Link } from 'react-router-dom';

function HowItWorks() {
    return (
        <div className="min-h-screen bg-neutral-50 py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <Link to="/" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-8">
                    <FiArrowLeft className="mr-2" />
                    Back to Dashboard
                </Link>
        
                <h1 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-8">How to Use SpendWise</h1>
        
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 mb-8">
                    <h2 className="text-2xl font-semibold mb-6 text-neutral-800">Getting Started</h2>
          
                    <p className="text-neutral-700 mb-6">
                        SpendWise helps you track your income and expenses, analyze your spending habits, and take control of your finances.
                        Here's how to get the most out of the application:
                    </p>
          
                    <div className="space-y-6">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-100 text-primary-600">
                                    <FiDollarSign size={24} />
                                </div>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-medium text-neutral-800">Recording Transactions</h3>
                                <p className="mt-2 text-neutral-600">
                                    Use the "Add Income" and "Add Expense" buttons to record your financial transactions.
                                    Make sure to categorize them properly for better insights into your spending habits.
                                </p>
                            </div>
                        </div>
            
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-100 text-primary-600">
                                    <FiPieChart size={24} />
                                </div>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-medium text-neutral-800">Analyzing Your Finances</h3>
                                <p className="mt-2 text-neutral-600">
                                    The dashboard provides visual charts of your income and expenses by category.
                                    Use these insights to identify spending patterns and areas where you can save.
                                </p>
                            </div>
                        </div>
            
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-100 text-primary-600">
                                    <FiList size={24} />
                                </div>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-medium text-neutral-800">Managing Transactions</h3>
                                <p className="mt-2 text-neutral-600">
                                    The transactions table allows you to sort, filter, and search your financial records.
                                    You can edit or delete transactions as needed, and export your data to CSV for external analysis.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
        
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
                    <h2 className="text-2xl font-semibold mb-6 text-neutral-800">Tips for Effective Financial Management</h2>
          
                    <ul className="space-y-4">
                        <li className="flex">
                            <FiCheckCircle className="flex-shrink-0 text-[#34C759] mt-1 mr-3" size={20} />
                            <p className="text-neutral-700">
                                <span className="font-medium">Be consistent:</span> Update your transactions regularly, ideally daily, to maintain an accurate picture of your finances.
                            </p>
                        </li>
                        <li className="flex">
                            <FiCheckCircle className="flex-shrink-0 text-[#34C759] mt-1 mr-3" size={20} />
                            <p className="text-neutral-700">
                                <span className="font-medium">Use categories wisely:</span> Create a consistent categorization system to better understand your spending patterns.
                            </p>
                        </li>
                        <li className="flex">
                            <FiCheckCircle className="flex-shrink-0 text-[#34C759] mt-1 mr-3" size={20} />
                            <p className="text-neutral-700">
                                <span className="font-medium">Review regularly:</span> Set aside time each week or month to review your financial summary and adjust your budget as needed.
                            </p>
                        </li>
                        <li className="flex">
                            <FiCheckCircle className="flex-shrink-0 text-[#34C759] mt-1 mr-3" size={20} />
                            <p className="text-neutral-700">
                                <span className="font-medium">Set goals:</span> Use the insights from SpendWise to set realistic financial goals and track your progress over time.
                            </p>
                        </li>
                        <li className="flex">
                            <FiCheckCircle className="flex-shrink-0 text-[#34C759] mt-1 mr-3" size={20} />
                            <p className="text-neutral-700">
                                <span className="font-medium">Export data:</span> Regularly export your transaction data as a backup and for more advanced analysis if needed.
                            </p>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default HowItWorks
