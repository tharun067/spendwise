import React, { useEffect } from 'react'
import { useMonthlySavings } from "../hooks/useMonthlySavings";
import { useTransactions } from '../hooks/useTransactions';

function MonthlyAutoSave() {
    const { autoSaveMonthlySummary } = useMonthlySavings();
    const { transactions, calculateSummary } = useTransactions();

    useEffect(() => {
        const checkAndSaveMonthlyData = () => {
            const now = new Date();
            const isLastDayOfMonth = new Date(now.getFullYear(),
                now.getMonth() + 1, 0).getDate() === now.getDate();
            
            // Check if it's the last day of the month and it's after 11 PM

            if (isLastDayOfMonth && now.getHours() >= 23) {
                const summary = calculateSummary();
                autoSaveMonthlySummary(summary, transactions);
            }
        }

        // Check every hour
        const interval = setInterval(checkAndSaveMonthlyData, 60 * 60 * 1000);

        // Also check on component mount
        checkAndSaveMonthlyData();

        return () => clearInterval(interval);
    }, [transactions, calculateSummary, autoSaveMonthlySummary]);

    return null;
}

export default MonthlyAutoSave;
