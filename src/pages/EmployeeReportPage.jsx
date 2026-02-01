import React, { useState, useEffect } from 'react';
import {
    Search, Download, Users, TrendingUp, Calendar, Phone, Badge,
    FileText, BarChart3, Zap, Banknote, ArrowUp, X, Loader, Trash2
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import clsx from 'clsx';
import { API_ROUTES } from '../config/apiConfig';
import * as XLSX from 'xlsx';

// Demo Data for Easy Understanding
const DEMO_EMPLOYEES = [
    {
        casior_id: 1,
        first_name: "Rohit",
        last_name: "Perera",
        email: "rohit@example.com",
        shop_name: "Main Branch Store",
        status_id: 1,
        create_at: "2024-06-15T10:30:00Z",
        candidate: {
            phone_number: [771234567],
            nic: "123456789V",
            address: "123 Main Street",
            district: "Colombo",
            province: "Western"
        }
    },
    {
        casior_id: 2,
        first_name: "Priya",
        last_name: "Silva",
        email: "priya@example.com",
        shop_name: "Downtown Mall",
        status_id: 1,
        create_at: "2024-07-20T14:15:00Z",
        candidate: {
            phone_number: [772345678],
            nic: "234567890V",
            address: "456 Park Road",
            district: "Galle",
            province: "Southern"
        }
    },
    {
        casior_id: 3,
        first_name: "Kasun",
        last_name: "Jayawardena",
        email: "kasun@example.com",
        shop_name: "Airport Terminal Store",
        status_id: 1,
        create_at: "2024-08-10T09:45:00Z",
        candidate: {
            phone_number: [773456789],
            nic: "345678901V",
            address: "789 Airport Avenue",
            district: "Negombo",
            province: "Western"
        }
    },
    {
        casior_id: 4,
        first_name: "Amara",
        last_name: "Fernando",
        email: "amara@example.com",
        shop_name: "Kandy Shopping Center",
        status_id: 1,
        create_at: "2024-09-05T11:20:00Z",
        candidate: {
            phone_number: [774567890],
            nic: "456789012V",
            address: "321 Temple Road",
            district: "Kandy",
            province: "Central"
        }
    },
    {
        casior_id: 5,
        first_name: "Sandun",
        last_name: "Jayasena",
        email: "sandun@example.com",
        shop_name: "Beach Road Outlet",
        status_id: 1,
        create_at: "2024-10-12T15:30:00Z",
        candidate: {
            phone_number: [775678901],
            nic: "567890123V",
            address: "654 Beach Avenue",
            district: "Matara",
            province: "Southern"
        }
    },
    {
        casior_id: 6,
        first_name: "Chaminda",
        last_name: "Gunarathne",
        email: "chaminda@example.com",
        shop_name: "Jaffna Central",
        status_id: 0,
        create_at: "2024-11-03T08:00:00Z",
        candidate: {
            phone_number: [776789012],
            nic: "678901234V",
            address: "987 Market Street",
            district: "Jaffna",
            province: "Northern"
        }
    },
    {
        casior_id: 7,
        first_name: "Dilini",
        last_name: "Abeysekara",
        email: "dilini@example.com",
        shop_name: "City Center Store",
        status_id: 1,
        create_at: "2024-05-22T13:45:00Z",
        candidate: {
            phone_number: [777890123],
            nic: "789012345V",
            address: "147 City Road",
            district: "Colombo",
            province: "Western"
        }
    },
    {
        casior_id: 8,
        first_name: "Nuwan",
        last_name: "Dissanayake",
        email: "nuwan@example.com",
        shop_name: "Ratnapura Branch",
        status_id: 1,
        create_at: "2024-04-18T10:15:00Z",
        candidate: {
            phone_number: [778901234],
            nic: "890123456V",
            address: "258 Gem Street",
            district: "Ratnapura",
            province: "Sabaragamuwa"
        }
    }
];

// Generate mock sales data
const generateSalesData = (employeeId) => {
    const baseAmount = 5000 + Math.random() * 10000;

    // Daily data (last 30 days)
    const dailyData = [];
    for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        dailyData.push({
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            fullDate: date.toISOString().split('T')[0],
            sales: baseAmount + Math.random() * 5000,
            transactions: Math.floor(10 + Math.random() * 30)
        });
    }

    // Weekly data
    const weeklyData = [];
    for (let i = 11; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - (i * 7));
        weeklyData.push({
            week: `Week ${12 - i}`,
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            sales: baseAmount * 7 + Math.random() * 15000,
            transactions: Math.floor(70 + Math.random() * 100)
        });
    }

    // Monthly data
    const monthlyData = [];
    for (let i = 11; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        monthlyData.push({
            month: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
            sales: baseAmount * 30 + Math.random() * 50000,
            transactions: Math.floor(300 + Math.random() * 400)
        });
    }

    // Yearly data
    const yearlyData = [];
    for (let i = 4; i >= 0; i--) {
        const year = new Date().getFullYear() - i;
        yearlyData.push({
            year: year.toString(),
            sales: baseAmount * 365 + Math.random() * 200000,
            transactions: Math.floor(3600 + Math.random() * 2000)
        });
    }

    return {
        daily: dailyData,
        weekly: weeklyData,
        monthly: monthlyData,
        yearly: yearlyData
    };
};

// Professional Employee Card Component
const EmployeeCardSelector = ({ employee, isSelected, isDarkMode, onClick }) => (
    <div
        onClick={onClick}
        className={clsx(
            'rounded-xl border-2 p-6 cursor-pointer transition-all duration-300 transform hover:scale-105',
            isSelected
                ? isDarkMode
                    ? 'bg-gradient-to-br from-blue-900 to-slate-800 border-blue-500 shadow-lg shadow-blue-500/20'
                    : 'bg-gradient-to-br from-blue-50 to-white border-blue-500 shadow-lg shadow-blue-500/20'
                : isDarkMode
                    ? 'bg-slate-800 border-slate-700 hover:border-slate-600'
                    : 'bg-white border-slate-200 hover:border-slate-300'
        )}
    >
        <div className="flex items-center gap-4">
            <div className={clsx(
                'w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold',
                isSelected
                    ? 'bg-gradient-to-br from-blue-400 to-blue-600 text-white'
                    : isDarkMode
                        ? 'bg-slate-700 text-slate-300'
                        : 'bg-slate-100 text-slate-900'
            )}>
                {employee.first_name[0]}{employee.last_name[0]}
            </div>
            <div className="flex-1">
                <h3 className={clsx(
                    'font-bold text-lg',
                    isDarkMode ? 'text-white' : 'text-slate-900'
                )}>
                    {employee.first_name} {employee.last_name}
                </h3>
                <p className={clsx(
                    'text-sm',
                    isDarkMode ? 'text-slate-400' : 'text-slate-500'
                )}>
                    {employee.email}
                </p>
                <div className="flex items-center gap-2 mt-2">
                    <Badge className="w-3 h-3" />
                    <span className={clsx(
                        'text-xs font-medium',
                        isDarkMode ? 'text-slate-400' : 'text-slate-600'
                    )}>
                        {employee.shop_name}
                    </span>
                </div>
            </div>
            <div className="flex flex-col items-end gap-2">
                <span className={clsx(
                    'px-3 py-1 rounded-full text-xs font-semibold',
                    employee.status_id === 1
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                )}>
                    {employee.status_id === 1 ? 'Active' : 'Inactive'}
                </span>
                {isSelected && (
                    <div className="text-blue-500">
                        <Zap className="w-5 h-5 fill-current" />
                    </div>
                )}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(employee.casior_id);
                    }}
                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-all"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
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
                        ? `RS ${value.toLocaleString('en-US', { maximumFractionDigits: 2 })}`
                        : typeof value === 'number'
                            ? value.toLocaleString()
                            : value
                    }
                </p>
                {trend && (
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
                                    RS {item.sales.toLocaleString('en-US', { maximumFractionDigits: 2 })}
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
                                    RS {avgTransaction.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default function EmployeeReportPage() {
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';

    const [employees, setEmployees] = useState(DEMO_EMPLOYEES);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [selectedPeriod, setSelectedPeriod] = useState('monthly');
    const [salesData, setSalesData] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);

    // Update sales data when employee changes
    useEffect(() => {
        if (selectedEmployee) {
            setLoading(true);
            // Simulate API call
            setTimeout(() => {
                setSalesData(generateSalesData(selectedEmployee.casior_id));
                setLoading(false);
            }, 500);
        }
    }, [selectedEmployee]);

    const handleDeleteEmployee = (id) => {
        if (window.confirm('Remove this employee from the system?')) {
            setEmployees(prev => prev.filter(emp => emp.casior_id !== id));
            if (selectedEmployee?.casior_id === id) setSelectedEmployee(null);
            // Add API call here 
        }
    };

    const filteredEmployees = employees.filter(emp =>
        emp.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.shop_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const currentSalesData = selectedEmployee && salesData
        ? selectedPeriod === 'daily' ? salesData.daily :
            selectedPeriod === 'weekly' ? salesData.weekly :
                selectedPeriod === 'monthly' ? salesData.monthly : salesData.yearly
        : [];

    // Calculate totals
    const calculateTotals = () => {
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
        if (!currentSalesData || currentSalesData.length === 0) return;

        const reportData = currentSalesData.map((item) => {
            const dateLabel = selectedPeriod === 'daily' ? item.date :
                selectedPeriod === 'weekly' ? item.week :
                    selectedPeriod === 'monthly' ? item.month : item.year;
            const avgTransaction = item.transactions > 0 ? item.sales / item.transactions : 0;

            return {
                [selectedPeriod === 'daily' ? 'Date' :
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
        const fileName = `${selectedEmployee.first_name}_${selectedEmployee.last_name}_${selectedPeriod}_report.xlsx`;
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
                            'rounded-xl border p-6 sticky top-6',
                            isDarkMode
                                ? 'bg-slate-800 border-slate-700'
                                : 'bg-white border-slate-200'
                        )}>
                            <h2 className={clsx(
                                'text-xl font-bold mb-4 flex items-center gap-2',
                                isDarkMode ? 'text-white' : 'text-slate-900'
                            )}>
                                <Users className="w-5 h-5" />
                                Employees
                            </h2>

                            {/* Search */}
                            <div className="relative mb-4">
                                <Search className={clsx(
                                    'absolute left-3 top-3 w-4 h-4',
                                    isDarkMode ? 'text-slate-500' : 'text-slate-400'
                                )} />
                                <input
                                    type="text"
                                    placeholder="Search employees..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className={clsx(
                                        'w-full pl-10 pr-4 py-2 rounded-lg border text-sm outline-none transition-colors',
                                        isDarkMode
                                            ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-500 focus:border-blue-500'
                                            : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                                    )}
                                />
                            </div>

                            {/* Employee List */}
                            <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                                {filteredEmployees.map(emp => (
                                    <EmployeeCardSelector
                                        key={emp.casior_id}
                                        employee={emp}
                                        isSelected={selectedEmployee?.casior_id === emp.casior_id}
                                        isDarkMode={isDarkMode}
                                        onClick={() => setSelectedEmployee(emp)}
                                        onDelete={handleDeleteEmployee}
                                    />
                                ))}
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
                                {/* Employee Header */}
                                <div className={clsx(
                                    'rounded-xl border p-6',
                                    isDarkMode
                                        ? 'bg-gradient-to-r from-blue-900/30 to-slate-800 border-slate-700'
                                        : 'bg-gradient-to-r from-blue-50 to-white border-slate-200'
                                )}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={clsx(
                                                'w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold',
                                                isDarkMode
                                                    ? 'bg-blue-900/50 text-blue-300'
                                                    : 'bg-blue-100 text-blue-700'
                                            )}>
                                                {selectedEmployee.first_name[0]}{selectedEmployee.last_name[0]}
                                            </div>
                                            <div>
                                                <h2 className={clsx(
                                                    'text-2xl font-bold',
                                                    isDarkMode ? 'text-white' : 'text-slate-900'
                                                )}>
                                                    {selectedEmployee.first_name} {selectedEmployee.last_name}
                                                </h2>
                                                <p className={clsx(
                                                    'text-sm',
                                                    isDarkMode ? 'text-slate-400' : 'text-slate-600'
                                                )}>
                                                    {selectedEmployee.email} • {selectedEmployee.shop_name}
                                                </p>
                                                <div className="flex items-center gap-3 mt-2">
                                                    <Phone className="w-4 h-4" />
                                                    <span className={clsx(
                                                        'text-sm',
                                                        isDarkMode ? 'text-slate-400' : 'text-slate-600'
                                                    )}>
                                                        {selectedEmployee.candidate?.phone_number?.[0] || 'N/A'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setSelectedEmployee(null)}
                                            className={clsx(
                                                'p-2 rounded-lg transition-colors',
                                                isDarkMode
                                                    ? 'hover:bg-slate-700 text-slate-400'
                                                    : 'hover:bg-slate-200 text-slate-600'
                                            )}
                                        >
                                            <X className="w-6 h-6" />
                                        </button>
                                    </div>
                                </div>

                                {loading ? (
                                    <div className="flex items-center justify-center py-12">
                                        <Loader className={clsx(
                                            'w-8 h-8 animate-spin',
                                            isDarkMode ? 'text-blue-400' : 'text-blue-600'
                                        )} />
                                    </div>
                                ) : (
                                    <>
                                        {/* Period Selection */}
                                        <div className="flex gap-2 overflow-x-auto pb-2">
                                            {['daily', 'weekly', 'monthly', 'yearly'].map(period => (
                                                <button
                                                    key={period}
                                                    onClick={() => setSelectedPeriod(period)}
                                                    className={clsx(
                                                        'px-6 py-2 rounded-lg font-semibold whitespace-nowrap transition-all',
                                                        selectedPeriod === period
                                                            ? 'bg-blue-600 text-white shadow-lg'
                                                            : isDarkMode
                                                                ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                                                : 'bg-slate-200 text-slate-900 hover:bg-slate-300'
                                                    )}
                                                >
                                                    {period.charAt(0).toUpperCase() + period.slice(1)}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Summary Cards */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <SalesReportCard
                                                label="Total Sales"
                                                value={totalSales}
                                                trend={8.5}
                                                icon={Banknote}
                                                isDarkMode={isDarkMode}
                                            />
                                            <SalesReportCard
                                                label="Total Transactions"
                                                value={totalTransactions}
                                                trend={12.3}
                                                icon={TrendingUp}
                                                isDarkMode={isDarkMode}
                                            />
                                        </div>

                                        {/* Download Button */}
                                        <button
                                            onClick={handleDownload}
                                            className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors"
                                        >
                                            <Download className="w-5 h-5" />
                                            Download Report as Excel
                                        </button>

                                        {/* Sales Data Table */}
                                        <div className={clsx(
                                            'rounded-xl border p-6 overflow-x-auto',
                                            isDarkMode
                                                ? 'bg-slate-800 border-slate-700'
                                                : 'bg-white border-slate-200'
                                        )}>
                                            <h3 className={clsx(
                                                'font-bold text-lg mb-4 flex items-center gap-2',
                                                isDarkMode ? 'text-white' : 'text-slate-900'
                                            )}>
                                                <BarChart3 className="w-5 h-5" />
                                                {selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)} Sales Details
                                            </h3>
                                            <SalesDataTable
                                                data={currentSalesData}
                                                period={selectedPeriod}
                                                isDarkMode={isDarkMode}
                                            />
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
