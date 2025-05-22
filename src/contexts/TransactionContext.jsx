import { createContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '../hooks/useAuth';
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
    where
} from 'firebase/firestore';
import { toast } from 'react-toastify';
import { db } from '../firebase/config';
import { Timestamp } from 'firebase/firestore';

export const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [undoStack, setUndoStack] = useState([]);
    const { currentUser } = useAuth();

    // Fetch user's transactions
    const fetchTransactions = async () => {
        if (!currentUser) return;

        setLoading(true);
        try {
            const q = query(
                collection(db, 'transactions'),
                where('userId', '==', currentUser.uid),
            );

            const querySnapshot = await getDocs(q);
            const fetchedTransactions = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    date: data.date?.toDate?.() || new Date()
                };
            });

            setTransactions(fetchedTransactions);
            setError(null);
        } catch (error) {
            console.error(error);
            setError('Failed to load transactions');
            toast.error('Failed to load transactions');
        } finally {
            setLoading(false);
        }
    };

    // Add new Transaction
    const addTransaction = async (transaction) => {
        if (!currentUser) return;
        setLoading(true);
        try {
            const transactionToSave = {
                ...transaction,
                userId: currentUser.uid,
                createdAt: serverTimestamp(),
                date: transaction.date instanceof Date ? Timestamp.fromDate(transaction.date) : serverTimestamp(),
                clientId: uuidv4()
            };

            await addDoc(collection(db, 'transactions'), transactionToSave);

            setUndoStack(prev => [...prev, { type: 'add', data: transactionToSave }]);
            toast.success('Transaction added successfully');
            await fetchTransactions();
        } catch (error) {
            console.error(error);
            setError('Failed to add transaction');
            toast.error('Failed to add transaction');
        } finally {
            setLoading(false);
        }
    };

    
    // Delete Transaction
    const deleteTransaction = async (id) => {
        if (!currentUser) return;
        setLoading(true);
        try {
            const transactionToDelete = transactions.find(t => t.id === id);
            await deleteDoc(doc(db, 'transactions', id));
            setUndoStack(prev => [...prev, { type: 'delete', data: transactionToDelete }]);
            toast.success('Transaction deleted successfully');
            await fetchTransactions();
        } catch (error) {
            console.error(error);
            setError('Failed to delete transaction');
            toast.error('Failed to delete transaction');
        } finally {
            setLoading(false);
        }
    };

    // Update Transaction
    const updateTransaction = async (id, updatedData) => {
        if (!currentUser) return;
        setLoading(true);
        try {
            const oldTransaction = transactions.find(t => t.id === id);
            const updatePayload = {
                ...updatedData,
                date: updatedData.date instanceof Date ? Timestamp.fromDate(updatedData.date) : updatedData.date
            };

            await updateDoc(doc(db, 'transactions', id), updatePayload);

            setUndoStack(prev => [...prev, {
                type: 'update',
                data: {
                    old: oldTransaction,
                    new: { ...oldTransaction, ...updatedData }
                }
            }]);

            toast.success('Transaction updated successfully');
            await fetchTransactions();
        } catch (error) {
            console.error(error);
            setError('Failed to update transaction');
            toast.error('Failed to update transaction');
        } finally {
            setLoading(false);
        }
    };

    // Undo last operation
    const undoLastOperation = async () => {
        if (undoStack.length === 0) {
            toast.info('Nothing to undo');
            return;
        }

        setLoading(true);
        try {
            const lastOperation = undoStack[undoStack.length - 1];

            if (lastOperation.type === 'add') {
                const transactionToDelete = transactions.find(
                    t => t.clientId === lastOperation.data.clientId
                );
                if (transactionToDelete) {
                    await deleteDoc(doc(db, 'transactions', transactionToDelete.id));
                }
            } else if (lastOperation.type === 'delete') {
                const { id, ...rest } = lastOperation.data;
                await addDoc(collection(db, 'transactions'), {
                    ...rest,
                    date: rest.date instanceof Date ? Timestamp.fromDate(rest.date) : rest.date
                });
            } else if (lastOperation.type === 'update') {
                await updateDoc(
                    doc(db, 'transactions', lastOperation.data.old.id),
                    {
                        ...lastOperation.data.old,
                        date: Timestamp.fromDate(new Date(lastOperation.data.old.date))
                    }
                );
            }

            setUndoStack(prev => prev.slice(0, -1));
            toast.success('Undo successful');
            await fetchTransactions();
        } catch (error) {
            console.error(error);
            setError('Failed to undo operation');
            toast.error('Failed to undo operation');
        } finally {
            setLoading(false);
        }
    };

    // Reset all transactions
    const resetAllTransactions = async () => {
        if (!currentUser || !window.confirm('Are you sure you want to delete all transactions?')) return;

        setLoading(true);
        try {
            const q = query(
                collection(db, 'transactions'),
                where('userId', '==', currentUser.uid)
            );

            const querySnapshot = await getDocs(q);
            const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
            await Promise.all(deletePromises);

            setUndoStack([]);
            toast.success('All transactions have been reset');
            await fetchTransactions();
        } catch (error) {
            console.error(error);
            setError('Failed to reset transactions');
            toast.error('Failed to reset transactions');
        } finally {
            setLoading(false);
        }
    };

    // Export to CSV
    const exportToCSV = () => {
        if (transactions.length === 0) {
            toast.info('No transactions to export');
            return;
        }

        try {
            const csvHeader = ['Name', 'Amount', 'Type', 'Tag', 'Date'].join(',');
            const csvRows = transactions.map(t => {
                const dateStr = t.date ? new Date(t.date).toLocaleDateString() : '';
                return [
                    t.name || '',
                    t.amount || '',
                    t.type || '',
                    t.tag || '',
                    dateStr
                ].join(',');
            });

            const csvString = [csvHeader, ...csvRows].join('\n');
            const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', `transactions_${new Date().toLocaleDateString()}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            toast.success('Transactions exported');
        } catch (error) {
            console.error(error);
            setError('Export failed');
            toast.error('Export failed');
        }
    };

    // Summary
    const calculateSummary = () => {
        if (transactions.length === 0) {
            return {
                totalBalance: 0,
                totalIncome: 0,
                totalExpenses: 0,
                incomeCount: 0,
                expenseCount: 0
            };
        }

        const summary = transactions.reduce((acc, t) => {
            const amount = parseFloat(t.amount) || 0;

            if (t.type === 'income') {
                acc.totalIncome += amount;
                acc.incomeCount += 1;
            } else {
                acc.totalExpenses += amount;
                acc.expenseCount += 1;
            }
            return acc;
        }, {
            totalIncome: 0,
            totalExpenses: 0,
            incomeCount: 0,
            expenseCount: 0
        });

        return {
            ...summary,
            totalBalance: summary.totalIncome - summary.totalExpenses
        };
    };

    // Effect to refetch when user changes
    useEffect(() => {
        if (currentUser) {
            fetchTransactions();
        } else {
            setTransactions([]);
        }
    }, [currentUser]);

    const value = {
        transactions,
        loading,
        error,
        addTransaction,
        deleteTransaction,
        updateTransaction,
        undoLastOperation,
        resetAllTransactions,
        exportToCSV,
        calculateSummary,
        fetchTransactions
    };

    return (
        <TransactionContext.Provider value={value}>
            {children}
        </TransactionContext.Provider>
    );
};
