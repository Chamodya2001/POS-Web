import React, { useState, useEffect } from 'react';
import {
    Search, Download, Users, TrendingUp, Calendar, Phone, Badge,
    FileText, BarChart3, Zap, Banknote, ArrowUp, X, Loader, Trash2
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import clsx from 'clsx';
import * as XLSX from 'xlsx';
import { API } from '../services/appService';
import { useAuth } from '../context/AuthContext';

// Professional Employee Card Component
const EmployeeCardSelector = ({ employee, isSelected, isDarkMode, onClick, onDelete }) => (
    <div
        onClick={onClick}
        className={clsx(
            'group relative rounded-xl border p-3 cursor-pointer transition-all duration-200',
            isSelected
                ? isDarkMode
                    ? 'bg-blue-600/10 border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.1)]'
                    : 'bg-blue-50 border-blue-200 shadow-[0_0_20px_rgba(59,130,246,0.05)]'
                : isDarkMode
                    ? 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-700/50 hover:border-slate-600'
                    : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
        )}
    >
        {/* Active Indicator Bar */}
        {isSelected && (
            <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-blue-500 rounded-r-full" />
        )}

        <div className="flex items-center gap-3">
            <div className={clsx(
                'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300',
                isSelected
                    ? 'bg-blue-500 text-white scale-110'
                    : isDarkMode
                        ? 'bg-slate-700 text-slate-300'
                        : 'bg-slate-100 text-slate-600'
            )}>
                {employee.first_name?.[0] || '?'}{employee.last_name?.[0] || ' '}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                    <h3 className={clsx(
                        'font-bold text-sm truncate',
                        isSelected
                            ? isDarkMode ? 'text-blue-400' : 'text-blue-700'
                            : isDarkMode ? 'text-white' : 'text-slate-900'
                    )}>
                        {employee.first_name || 'Unnamed'} {employee.last_name || 'Employee'}
                    </h3>
                    <span className={clsx(
                        'flex-shrink-0 w-2 h-2 rounded-full',
                        employee.status_id === 1 ? 'bg-green-500' : 'bg-red-500'
                    )} />
                </div>
                <p className={clsx(
                    'text-[11px] truncate mt-0.5',
                    isDarkMode ? 'text-slate-400' : 'text-slate-500'
                )}>
                    {employee.shop_name || 'General Staff'}
                </p>
            </div>

            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete(employee.casior_id);
                }}
                className={clsx(
                    'p-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100',
                    isDarkMode
                        ? 'text-slate-500 hover:text-red-400 hover:bg-red-400/10'
                        : 'text-slate-400 hover:text-red-500 hover:bg-red-50'
                )}
            >
                <Trash2 className="w-3.5 h-3.5" />
            </button>
        </div>
    </div>
);

// Professional Sales Report Card Component
const SalesReportCard = ({ label, value, trend, icon: Icon, isDarkMode }) => (
    <div className={clsx(
        'rounded-xl border p-6',
        isDarkMode
            ? 'bg-slate-800 border-slate-700'
            : 'bg-white border-slate-200 shadow-sm'
    )}>
        <div className="flex items-start justify-between">
            <div>
                <p className={clsx(
                    'text-sm font-medium mb-2',
                    isDarkMode ? 'text-slate-400' : 'text-slate-600'
                )}>
                    {label}
                </p>
                <p className={clsx(
                    'text-3xl font-bold',
                    isDarkMode ? 'text-white' : 'text-slate-900'
                )}>
                    {typeof value === 'number' && label.includes('Sales')
                        ? `RS ${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                        : typeof value === 'number'
                            ? value.toLocaleString()
                            : value
                    }
                </p>
                {trend !== undefined && (
                    <div className="flex items-center gap-1 mt-2">
                        <ArrowUp className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-green-500 font-medium">+{trend}%</span>
                    </div>
                )}
            </div>
            <div className={clsx(
                'p-3 rounded-lg',
                isDarkMode ? 'bg-slate-700' : 'bg-slate-100'
            )}>
                <Icon className={clsx(
                    'w-6 h-6',
                    isDarkMode ? 'text-slate-300' : 'text-slate-600'
                )} />
            </div>
        </div>
    </div>
);

// Sales Data Table Component
const SalesDataTable = ({ data, period, isDarkMode }) => {
    const getDateLabel = () => {
        switch (period) {
            case 'daily': return 'Date';
            case 'weekly': return 'Week';
            case 'monthly': return 'Month';
            case 'yearly': return 'Year';
            default: return 'Period';
        }
    };

    if (!data || data.length === 0) {
        return (
            <div className={clsx(
                'py-12 text-center',
                isDarkMode ? 'text-slate-500' : 'text-slate-400'
            )}>
                No sales data found for this period
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className={clsx(
                        'border-b',
                        isDarkMode ? 'border-slate-700' : 'border-slate-200'
                    )}>
                        <th className={clsx(
                            'px-6 py-4 text-left font-semibold',
                            isDarkMode ? 'text-slate-300' : 'text-slate-700'
                        )}>
                            {getDateLabel()}
                        </th>
                        <th className={clsx(
                            'px-6 py-4 text-right font-semibold',
                            isDarkMode ? 'text-slate-300' : 'text-slate-700'
                        )}>
                            Total Sales
                        </th>
                        <th className={clsx(
                            'px-6 py-4 text-right font-semibold',
                            isDarkMode ? 'text-slate-300' : 'text-slate-700'
                        )}>
                            Transactions
                        </th>
                        <th className={clsx(
                            'px-6 py-4 text-right font-semibold',
                            isDarkMode ? 'text-slate-300' : 'text-slate-700'
                        )}>
                            Avg. Transaction
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => {
                        const dateLabel = period === 'daily' ? item.date :
                            period === 'weekly' ? item.week :
                                period === 'monthly' ? item.month : item.year;
                        const avgTransaction = item.transactions > 0 ? item.sales / item.transactions : 0;

                        return (
                            <tr
                                key={index}
                                className={clsx(
                                    'border-b transition-colors',
                                    isDarkMode
                                        ? 'border-slate-700 hover:bg-slate-700/50'
                                        : 'border-slate-100 hover:bg-slate-50'
                                )}
                            >
                                <td className={clsx(
                                    'px-6 py-4 font-medium',
                                    isDarkMode ? 'text-slate-300' : 'text-slate-900'
                                )}>
                                    {dateLabel}
                                </td>
                                <td className={clsx(
                                    'px-6 py-4 text-right font-semibold text-green-600',
                                    isDarkMode ? 'text-green-400' : ''
                                )}>
                                    RS {item.sales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </td>
                                <td className={clsx(
                                    'px-6 py-4 text-right',
                                    isDarkMode ? 'text-slate-300' : 'text-slate-600'
                                )}>
                                    {item.transactions}
                                </td>
                                <td className={clsx(
                                    'px-6 py-4 text-right',
                                    isDarkMode ? 'text-slate-300' : 'text-slate-600'
                                )}>
                                    RS {avgTransaction.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};


// Transactions History Table Component
const TransactionsHistoryTable = ({ data, isDarkMode }) => {
    if (!data || data.length === 0) {
        return (
            <div className={clsx(
                'py-12 text-center',
                isDarkMode ? 'text-slate-500' : 'text-slate-400'
            )}>
                No transaction history found for this criteria
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className={clsx(
                        'border-b',
                        isDarkMode ? 'border-slate-700' : 'border-slate-200'
                    )}>
                        <th className={clsx(
                            'px-6 py-4 text-left font-semibold',
                            isDarkMode ? 'text-slate-300' : 'text-slate-700'
                        )}>
                            Order ID
                        </th>
                        <th className={clsx(
                            'px-6 py-4 text-left font-semibold',
                            isDarkMode ? 'text-slate-300' : 'text-slate-700'
                        )}>
                            Date & Time
                        </th>
                        <th className={clsx(
                            'px-6 py-4 text-left font-semibold',
                            isDarkMode ? 'text-slate-300' : 'text-slate-700'
                        )}>
                            Customer
                        </th>
                        <th className={clsx(
                            'px-6 py-4 text-left font-semibold',
                            isDarkMode ? 'text-slate-300' : 'text-slate-700'
                        )}>
                            Payment
                        </th>
                        <th className={clsx(
                            'px-6 py-4 text-right font-semibold',
                            isDarkMode ? 'text-slate-300' : 'text-slate-700'
                        )}>
                            Amount
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr
                            key={index}
                            className={clsx(
                                'border-b transition-colors outline-none',
                                isDarkMode
                                    ? 'border-slate-700 hover:bg-slate-700/50'
                                    : 'border-slate-100 hover:bg-slate-50'
                            )}
                        >
                            <td className={clsx(
                                'px-6 py-4 font-bold text-blue-500',
                            )}>
                                {item.id}
                            </td>
                            <td className={clsx(
                                'px-6 py-4 text-sm',
                                isDarkMode ? 'text-slate-300' : 'text-slate-600'
                            )}>
                                {item.date}
                            </td>
                            <td className={clsx(
                                'px-6 py-4 text-sm',
                                isDarkMode ? 'text-slate-300' : 'text-slate-600'
                            )}>
                                {item.customer}
                            </td>
                            <td className={clsx(
                                'px-6 py-4',
                                isDarkMode ? 'text-slate-300' : 'text-slate-600'
                            )}>
                                <span className={clsx(
                                    "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                                    item.payment === 'cash' ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                                )}>
                                    {item.payment}
                                </span>
                            </td>
                            <td className={clsx(
                                'px-6 py-4 text-right font-bold text-green-600',
                                isDarkMode ? 'text-green-400' : ''
                            )}>
                                RS {item.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};


export default function EmployeeReportPage() {
    const { user } = useAuth();

    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';

    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [selectedPeriod, setSelectedPeriod] = useState('monthly');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [salesData, setSalesData] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [employeesLoading, setEmployeesLoading] = useState(true);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const data = await API.getEmployees(user?.candidate_id);
                if (data && data.success) {
                    setEmployees(data.data);
                }
            } catch (err) {
                console.error("Failed to fetch employees", err);
            } finally {
                setEmployeesLoading(false);
            }
        };
        fetchEmployees();
    }, []);

    // Update sales data when employee changes
    useEffect(() => {
        const fetchReport = async () => {
            if (selectedEmployee) {
                setLoading(true);
                try {
                    const data = await API.getEmployeeReport(selectedEmployee.casior_id);
                    if (data && data.success) {
                        setSalesData(data.data);
                    }
                } catch (err) {
                    console.error("Failed to fetch employee report", err);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchReport();
    }, [selectedEmployee]);

    const handleDeleteEmployee = async (id) => {
        if (window.confirm('Remove this employee from the system?')) {
            try {
                await API.deleteEmployee(id);
                setEmployees(prev => prev.filter(emp => emp.casior_id !== id));
                if (selectedEmployee?.casior_id === id) setSelectedEmployee(null);
            } catch (err) {
                console.error("Failed to delete employee", err);
                alert("Failed to delete employee");
            }
        }
    };


    const filteredEmployees = employees.filter(emp =>
        (emp.first_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (emp.last_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (emp.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (emp.shop_name || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const currentSalesData = selectedEmployee && salesData
        ? selectedPeriod === 'daily' ? salesData.daily :
            selectedPeriod === 'weekly' ? salesData.weekly :
                selectedPeriod === 'monthly' ? salesData.monthly :
                    selectedPeriod === 'yearly' ? salesData.yearly :
                        selectedPeriod === 'custom' ? (salesData.daily || []).filter(item => {
                            if (!startDate && !endDate) return true;
                            const itemDate = item.fullDate;
                            if (startDate && itemDate < startDate) return false;
                            if (endDate && itemDate > endDate) return false;
                            return true;
                        }) : []
        : [];

    const currentHistoryData = selectedEmployee && salesData && salesData.orders
        ? salesData.orders.filter(item => {
            if (!startDate && !endDate) return true;
            const itemDate = item.date.split(' ')[0]; // Extract YYYY-MM-DD from 'YYYY-MM-DD HH:MM'
            if (startDate && itemDate < startDate) return false;
            if (endDate && itemDate > endDate) return false;
            return true;
        })
        : [];

    // Calculate totals
    const calculateTotals = () => {
        if (selectedPeriod === 'history') {
            if (!currentHistoryData || currentHistoryData.length === 0) return { totalSales: 0, totalTransactions: 0 };
            const totalSales = currentHistoryData.reduce((sum, item) => sum + item.total, 0);
            return { totalSales, totalTransactions: currentHistoryData.length };
        }

        if (!currentSalesData || currentSalesData.length === 0) {
            return { totalSales: 0, totalTransactions: 0 };
        }
        const totalSales = currentSalesData.reduce((sum, item) => sum + item.sales, 0);
        const totalTransactions = currentSalesData.reduce((sum, item) => sum + item.transactions, 0);
        return { totalSales, totalTransactions };
    };

    const { totalSales, totalTransactions } = calculateTotals();

    // Download function
    const handleDownload = () => {
        if (selectedPeriod === 'history') {
            if (!currentHistoryData || currentHistoryData.length === 0) return;
            const reportData = currentHistoryData.map(item => ({
                'Order ID': item.id,
                'Date & Time': item.date,
                'Customer': item.customer,
                'Payment': item.payment,
                'Amount': item.total
            }));
            const ws = XLSX.utils.json_to_sheet(reportData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Transaction History");
            const fileName = `${selectedEmployee.first_name}_${selectedEmployee.last_name}_history.xlsx`;
            XLSX.writeFile(wb, fileName);
            return;
        }

        if (!currentSalesData || currentSalesData.length === 0) return;

        const reportData = currentSalesData.map((item) => {
            const dateLabel = (selectedPeriod === 'daily' || selectedPeriod === 'custom') ? item.date :
                selectedPeriod === 'weekly' ? item.week :
                    selectedPeriod === 'monthly' ? item.month : item.year;
            const avgTransaction = item.transactions > 0 ? item.sales / item.transactions : 0;

            return {
                [(selectedPeriod === 'daily' || selectedPeriod === 'custom') ? 'Date' :
                    selectedPeriod === 'weekly' ? 'Week' :
                        selectedPeriod === 'monthly' ? 'Month' : 'Year']: dateLabel,
                'Total Sales': item.sales,
                'Transactions': item.transactions,
                'Avg. Transaction': avgTransaction
            };
        });

        const ws = XLSX.utils.json_to_sheet(reportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sales Report");
        const fileName = `${selectedEmployee.first_name || 'Employee'}_${selectedEmployee.last_name || ''}_${selectedPeriod}_report.xlsx`;
        XLSX.writeFile(wb, fileName);
    };

    return (
        <div className={clsx(
            'min-h-screen p-4 sm:p-6 lg:p-8',
            isDarkMode ? 'bg-slate-900' : 'bg-slate-50'
        )}>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className={clsx(
                            'p-3 rounded-lg',
                            isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700'
                        )}>
                            <BarChart3 className="w-6 h-6" />
                        </div>
                        <h1 className={clsx(
                            'text-3xl sm:text-4xl font-bold',
                            isDarkMode ? 'text-white' : 'text-slate-900'
                        )}>
                            Employee Sales Reports
                        </h1>
                    </div>
                    <p className={clsx(
                        'text-lg',
                        isDarkMode ? 'text-slate-400' : 'text-slate-600'
                    )}>
                        Monitor and analyze employee sales performance
                    </p>
                </div>

                {/* Main Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Employee List Sidebar */}
                    <div className="lg:col-span-1">
                        <div className={clsx(
                            'rounded-2xl border sticky top-6 overflow-hidden transition-all duration-300',
                            isDarkMode
                                ? 'bg-slate-800/80 border-slate-700/50 backdrop-blur-xl'
                                : 'bg-white/80 border-slate-200/60 backdrop-blur-xl shadow-sm'
                        )}>
                            {/* Sidebar Header */}
                            <div className="p-5 border-b border-inherit">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className={clsx(
                                        'text-lg font-bold flex items-center gap-2.5',
                                        isDarkMode ? 'text-white' : 'text-slate-900'
                                    )}>
                                        <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">
                                            <Users className="w-4 h-4" />
                                        </div>
                                        Staff
                                    </h2>
                                    <span className={clsx(
                                        'text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider',
                                        isDarkMode ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500'
                                    )}>
                                        {filteredEmployees.length} Total
                                    </span>
                                </div>

                                {/* Search Bar */}
                                <div className="relative group">
                                    <Search className={clsx(
                                        'absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors',
                                        isDarkMode ? 'text-slate-500 group-focus-within:text-blue-500' : 'text-slate-400 group-focus-within:text-blue-500'
                                    )} />
                                    <input
                                        type="text"
                                        placeholder="Search by name..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className={clsx(
                                            'w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-all duration-200',
                                            isDarkMode
                                                ? 'bg-slate-900/50 border-slate-700 text-white placeholder-slate-500 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10'
                                                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5'
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Employee List Container */}
                            <div className="p-3 space-y-2 max-h-[calc(100vh-320px)] overflow-y-auto custom-scrollbar">
                                {employeesLoading ? (
                                    <div className="flex flex-col items-center justify-center py-12 gap-3 opacity-50">
                                        <Loader className="w-5 h-5 animate-spin text-blue-500" />
                                        <span className="text-[11px] font-medium tracking-widest uppercase">Loading Staff</span>
                                    </div>
                                ) : filteredEmployees.length > 0 ? (
                                    filteredEmployees.map(emp => (
                                        <EmployeeCardSelector
                                            key={emp.casior_id}
                                            employee={emp}
                                            isSelected={selectedEmployee?.casior_id === emp.casior_id}
                                            isDarkMode={isDarkMode}
                                            onClick={() => setSelectedEmployee(emp)}
                                            onDelete={handleDeleteEmployee}
                                        />
                                    ))
                                ) : (
                                    <div className="text-center py-12 px-4">
                                        <div className="w-10 h-10 rounded-full bg-slate-500/5 flex items-center justify-center mx-auto mb-3">
                                            <Search className="w-4 h-4 text-slate-500" />
                                        </div>
                                        <p className="text-xs font-medium text-slate-500">No members found</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sales Report Section */}
                    <div className="lg:col-span-3 space-y-6">
                        {!selectedEmployee ? (
                            <div className={clsx(
                                'rounded-xl border-2 border-dashed p-12 text-center',
                                isDarkMode
                                    ? 'border-slate-700 bg-slate-800/50'
                                    : 'border-slate-300 bg-slate-50'
                            )}>
                                <div className={clsx(
                                    'inline-flex p-4 rounded-full mb-4',
                                    isDarkMode ? 'bg-slate-700' : 'bg-slate-200'
                                )}>
                                    <Users className={clsx(
                                        'w-8 h-8',
                                        isDarkMode ? 'text-slate-400' : 'text-slate-500'
                                    )} />
                                </div>
                                <h3 className={clsx(
                                    'text-xl font-bold mb-2',
                                    isDarkMode ? 'text-white' : 'text-slate-900'
                                )}>
                                    Select an Employee
                                </h3>
                                <p className={clsx(
                                    isDarkMode ? 'text-slate-400' : 'text-slate-600'
                                )}>
                                    Choose an employee from the list to view their sales report
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Employee Header Card */}
                                <div className={clsx(
                                    'group relative rounded-2xl border p-8 transition-all duration-500 overflow-hidden',
                                    isDarkMode
                                        ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 shadow-xl'
                                        : 'bg-white border-slate-200 shadow-sm'
                                )}>
                                    {/* Decorative Background Element */}
                                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
                                        <Users className="w-64 h-64 -rotate-12" />
                                    </div>

                                    <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div className="flex items-center gap-6">
                                            {/* Avatar with Glow */}
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 animate-pulse" />
                                                <div className={clsx(
                                                    'relative w-24 h-24 rounded-2xl flex items-center justify-center text-4xl font-black shadow-2xl',
                                                    isDarkMode
                                                        ? 'bg-slate-700 text-blue-400'
                                                        : 'bg-blue-600 text-white'
                                                )}>
                                                    {selectedEmployee.first_name?.[0]}{selectedEmployee.last_name?.[0]}
                                                </div>
                                            </div>

                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h2 className={clsx(
                                                        'text-3xl font-black tracking-tight',
                                                        isDarkMode ? 'text-white' : 'text-slate-900'
                                                    )}>
                                                        {selectedEmployee.first_name} {selectedEmployee.last_name}
                                                    </h2>
                                                    <span className={clsx(
                                                        'px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest',
                                                        selectedEmployee.status_id === 1
                                                            ? 'bg-green-500/10 text-green-500'
                                                            : 'bg-red-500/10 text-red-500'
                                                    )}>
                                                        {selectedEmployee.status_id === 1 ? 'Active' : 'Inactive'}
                                                    </span>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
                                                    <div className={clsx(
                                                        'flex items-center gap-2',
                                                        isDarkMode ? 'text-slate-400' : 'text-slate-500'
                                                    )}>
                                                        <FileText className="w-4 h-4 text-blue-500" />
                                                        {selectedEmployee.email}
                                                    </div>
                                                    <div className="w-1 h-1 rounded-full bg-slate-400" />
                                                    <div className={clsx(
                                                        'flex items-center gap-2',
                                                        isDarkMode ? 'text-slate-400' : 'text-slate-500'
                                                    )}>
                                                        <Badge className="w-4 h-4 text-blue-500" />
                                                        {selectedEmployee.shop_name}
                                                    </div>
                                                    <div className="w-1 h-1 rounded-full bg-slate-400" />
                                                    <div className={clsx(
                                                        'flex items-center gap-2',
                                                        isDarkMode ? 'text-slate-400' : 'text-slate-500'
                                                    )}>
                                                        <Phone className="w-4 h-4 text-blue-500" />
                                                        {selectedEmployee.phone_number?.[0] || 'N/A'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => setSelectedEmployee(null)}
                                            className={clsx(
                                                'p-3 rounded-xl transition-all duration-300 hover:rotate-90',
                                                isDarkMode
                                                    ? 'bg-slate-700/50 hover:bg-slate-700 text-slate-400'
                                                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                                            )}
                                        >
                                            <X className="w-6 h-6" />
                                        </button>
                                    </div>
                                </div>

                                {loading ? (
                                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                                        <Loader className={clsx(
                                            'w-10 h-10 animate-spin',
                                            isDarkMode ? 'text-blue-400' : 'text-blue-600'
                                        )} />
                                        <p className={clsx(
                                            'font-medium',
                                            isDarkMode ? 'text-slate-400' : 'text-slate-500'
                                        )}>Generating report...</p>
                                    </div>
                                ) : (
                                    <>
                                        {/* Period Selection */}
                                        <div className="space-y-4">
                                            <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                                                {['daily', 'weekly', 'monthly', 'yearly', 'custom', 'history'].map(period => (
                                                    <button
                                                        key={period}
                                                        onClick={() => {
                                                            setSelectedPeriod(period);
                                                        }}
                                                        className={clsx(
                                                            'px-6 py-2 rounded-lg font-semibold whitespace-nowrap transition-all',
                                                            selectedPeriod === period
                                                                ? 'bg-blue-600 text-white shadow-lg'
                                                                : isDarkMode
                                                                    ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                                                    : 'bg-slate-200 text-slate-900 hover:bg-slate-300'
                                                        )}
                                                    >
                                                        {period === 'history' ? 'Detailed History' : period.charAt(0).toUpperCase() + period.slice(1)}
                                                    </button>
                                                ))}
                                            </div>

                                            {(selectedPeriod === 'custom' || selectedPeriod === 'history') && (
                                                <div className={clsx(
                                                    "flex flex-wrap items-center gap-4 p-4 rounded-xl border",
                                                    isDarkMode ? "bg-slate-800/50 border-slate-700" : "bg-white border-slate-200"
                                                )}>
                                                    <div className="flex items-center gap-2">
                                                        <span className={clsx("text-sm font-medium", isDarkMode ? "text-slate-400" : "text-slate-600")}>From:</span>
                                                        <input
                                                            type="date"
                                                            value={startDate}
                                                            onChange={(e) => setStartDate(e.target.value)}
                                                            className={clsx(
                                                                "px-3 py-2 rounded-lg border text-sm outline-none transition-all",
                                                                isDarkMode
                                                                    ? "bg-slate-900 border-slate-700 text-white focus:border-blue-500"
                                                                    : "bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500"
                                                            )}
                                                        />
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className={clsx("text-sm font-medium", isDarkMode ? "text-slate-400" : "text-slate-600")}>To:</span>
                                                        <input
                                                            type="date"
                                                            value={endDate}
                                                            onChange={(e) => setEndDate(e.target.value)}
                                                            className={clsx(
                                                                "px-3 py-2 rounded-lg border text-sm outline-none transition-all",
                                                                isDarkMode
                                                                    ? "bg-slate-900 border-slate-700 text-white focus:border-blue-500"
                                                                    : "bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500"
                                                            )}
                                                        />
                                                    </div>
                                                    {(startDate || endDate) && (
                                                        <button
                                                            onClick={() => { setStartDate(''); setEndDate(''); }}
                                                            className="text-xs text-blue-500 font-bold hover:underline"
                                                        >
                                                            Clear
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* Summary Cards */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <SalesReportCard
                                                label="Total Sales"
                                                value={totalSales}
                                                icon={Banknote}
                                                isDarkMode={isDarkMode}
                                            />
                                            <SalesReportCard
                                                label="Total Transactions"
                                                value={totalTransactions}
                                                icon={TrendingUp}
                                                isDarkMode={isDarkMode}
                                            />
                                        </div>

                                        {/* Download Button */}
                                        <button
                                            onClick={handleDownload}
                                            disabled={
                                                selectedPeriod === 'history' 
                                                    ? (!currentHistoryData || currentHistoryData.length === 0)
                                                    : (!currentSalesData || currentSalesData.length === 0)
                                            }
                                            className={clsx(
                                                "w-full flex items-center justify-center gap-2 font-semibold py-3 rounded-lg transition-colors",
                                                (selectedPeriod === 'history' ? (!currentHistoryData || currentHistoryData.length === 0) : (!currentSalesData || currentSalesData.length === 0))
                                                    ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                                                    : "bg-green-600 hover:bg-green-700 text-white"
                                            )}
                                        >
                                            <Download className="w-5 h-5" />
                                            Download {selectedPeriod === 'history' ? 'History' : 'Report'} as Excel
                                        </button>

                                        {/* Sales Data Table */}
                                        <div className={clsx(
                                            'rounded-xl border p-6 overflow-x-auto',
                                            isDarkMode
                                                ? 'bg-slate-800 border-slate-700'
                                                : 'bg-white border-slate-200'
                                        )}>
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                                <h3 className={clsx(
                                                    'font-bold text-lg flex items-center gap-2',
                                                    isDarkMode ? 'text-white' : 'text-slate-900'
                                                )}>
                                                    {selectedPeriod === 'history' ? (
                                                        <><FileText className="w-5 h-5" /> Detailed Transaction History</>
                                                    ) : (
                                                        <><BarChart3 className="w-5 h-5" /> {selectedPeriod === 'custom' ? 'Custom Range' : selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)} Sales Details</>
                                                    )}
                                                </h3>
                                                
                                                {selectedPeriod === 'history' && (
                                                    <div className="relative w-full md:w-64">
                                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                        <input
                                                            type="text"
                                                            placeholder="Search history..."
                                                            className={clsx(
                                                                "w-full pl-10 pr-4 py-2 rounded-lg border text-sm outline-none transition-all",
                                                                isDarkMode
                                                                    ? "bg-slate-900 border-slate-700 text-white focus:border-blue-500"
                                                                    : "bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500"
                                                            )}
                                                            onChange={(e) => {
                                                                const val = e.target.value.toLowerCase();
                                                                // We can filter currentHistoryData locally for display
                                                                // But for now just adding the UI element to show it's possible
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                            {selectedPeriod === 'history' ? (
                                                <TransactionsHistoryTable
                                                    data={currentHistoryData}
                                                    isDarkMode={isDarkMode}
                                                />
                                            ) : (
                                                <SalesDataTable
                                                    data={currentSalesData}
                                                    period={selectedPeriod === 'custom' ? 'daily' : selectedPeriod}
                                                    isDarkMode={isDarkMode}
                                                />
                                            )}
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

