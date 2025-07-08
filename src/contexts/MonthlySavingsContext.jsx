import React, { createContext, useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { addDoc, collection, getDocs, orderBy, query,  serverTimestamp,  where } from 'firebase/firestore';
import { db } from '../firebase/config';
import { toast } from 'react-toastify';


export const MonthlySavingsContext = createContext();

export const MonthlySavingsProvider = ({children}) => {
    const [monthlySavings, setMonthlySavings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { currentUser } = useAuth();

    // Fetch monthly savings data
    const fetchMonthlySavings = async () => {
        if (!currentUser) return;

        setLoading(true);
        try {
            const q = query(
                collection(db, 'monthlySavings'),
                where('userId', '==', currentUser.uid),
                
            );

            const querySnapshot = await getDocs(q);
            const fetchedSavings = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setMonthlySavings(fetchedSavings);
            setError(null);
        } catch (error) {
            setError("Failed to load monthly savings");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    // save monthly data
    const saveMonthlySummary = async (year, month, summary, transactions) => {
        if (!currentUser) return;

        try {
            const monthlyData = {
                userId: currentUser.uid,
                year,
                month,
                totalIncome: summary.totalIncome,
                totalExpenses: summary.totalExpenses,
                savings: summary.totalIncome - summary.totalExpenses,
                transactionCount: transactions.length,
                incomeCount: summary.incomeCount,
                expenseCount: summary.expenseCount,
                createdAt: serverTimestamp(),
                // Store category breakdowns
                incomeByCategory: getIncomeByCategory(transactions),
                expensesByCategory: getExpensesByCAtegory(transactions)
            };

            await addDoc(collection(db, 'monthlySavings'), monthlyData);

            toast.success(`Monthly data for ${getMonthName(month)} ${year} saved successfully`);
            await fetchMonthlySavings();
        } catch (error) {
            setError("Failed to save monthly data");
            toast.error("Failed to save monthly data");
            console.error(error);
        }
    }

    // Auto save monthly data (called at month end)
    const autoSaveMonthlySummary = async (summary, transactions) => {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;

        // Check if data for this month already exists
        const existingData = monthlySavings.find(
            saving => saving.year === year && saving.month === month
        );

        if (!existingData && transactions.length > 0) {
            await saveMonthlySummary(year, month, summary, transactions);
        }
    }

    // Manual save for current month
    const saveCurrentMonth = async (summary, transactions) => {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;

        await saveMonthlySummary(year, month, summary, transactions);
    }

    // Helper functions
    const getIncomeByCategory = (transactions) => {
        return transactions
            .filter(t => t.type === 'income')
            .reduce((acc, t) => {
                acc[t.tag] = (acc[t.tag] || 0) + t.amount;
                return acc;
            }, {});
    }

    const getExpensesByCAtegory = (transactions) => {
        return transactions
            .filter(t => t.type === 'expense')
            .reduce((acc, t) => {
                acc[t.tag] = (acc[t.tag] || 0) + t.amount;
                return acc;
            }, {});
    }

    const getMonthName = (month) => {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return months[month - 1];
    };

    // GEt savings for a specific month
    const getSavingsForMonth = (year, month) => {
        return monthlySavings.find(
            saving => saving.year === year && saving.month === month
        );
    }

    // Get yearly summary
    const getYearlySummary = (year) => {
        const yearData = monthlySavings.filter(saving => saving.year === year);
        return yearData.reduce((acc, month) => {
            acc.totalIncome += month.totalIncome;
            acc.totalExpenses += month.totalExpenses;
            acc.totalSavings += month.savings;
            acc.monthCount += 1;
            return acc;
        }, {
            totalIncome: 0,
            totalExpenses: 0,
            totalSavings: 0,
            monthCount: 0,
            averageMonthlySavings: 0
        });
    }

    // Fetch monthly savings whenever the user changes
    useEffect(() => {
        if (currentUser) {
            fetchMonthlySavings();
        } else {
            setMonthlySavings([]);
        }
    }, [currentUser]);

    const value = {
        monthlySavings,
        loading,
        error,
        saveMonthlySummary,
        autoSaveMonthlySummary,
        saveCurrentMonth,
        getSavingsForMonth, getYearlySummary,
        getMonthName,
        fetchMonthlySavings
    };

    return (
        <MonthlySavingsContext.Provider value={value}>
            {children}
        </MonthlySavingsContext.Provider>
    );
}


