import React from 'react';
import { DollarSign, ShoppingBag, Users, Package, TrendingUp, ArrowUpRight, ArrowDownRight, Clock, CheckCircle, XCircle } from 'lucide-react';
import {useCandidateData} from '../context/CandidateContext'

const StatsCard = ({ title, value, change, icon: Icon, trend }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-primary-50 rounded-xl">
        <Icon className="w-6 h-6 text-primary-600" />
      </div>
      <div className={`flex items-center gap-1 text-sm font-medium ${trend === 'up' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'} px-2 py-1 rounded-lg`}>
        {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
        {change}
      </div>
    </div>
    <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
    <p className="text-2xl font-bold text-slate-800">{value}</p>
  </div>
);

const SectionHeader = ({ title, action }) => (
  <div className="flex items-center justify-between mb-6">
    <h2 className="text-lg font-bold text-slate-800">{title}</h2>
    {action}
  </div>
);

const RecentOrderRow = ({ id, customer, items, total, status, date }) => (
  <tr className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
    <td className="py-4 px-4 font-medium text-slate-800">{id}</td>
    <td className="py-4 px-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
          {customer.charAt(0)}
        </div>
        <span className="text-sm text-slate-600">{customer}</span>
      </div>
    </td>
    <td className="py-4 px-4 text-sm text-slate-500">{items} items</td>
    <td className="py-4 px-4 font-medium text-slate-800">${total}</td>
    <td className="py-4 px-4">
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${status === 'Completed' ? 'bg-green-50 text-green-700 border-green-100' :
          status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-100' :
            'bg-slate-50 text-slate-700 border-slate-100'
        }`}>
        {status === 'Completed' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
        {status}
      </span>
    </td>
    <td className="py-4 px-4 text-sm text-slate-400 text-right">{date}</td>
  </tr>
);

export default function Dashboard() {
 console.log("kkk",useCandidateData)


  return (
    <div className="p-2 space-y-6 max-w-[1200px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
          <p className="text-slate-500 text-sm mt-1">Welcome back, here's what's happening today.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
            Export Report
          </button>
          <button className="px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/25">
            + New Product
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Sales"
          value="$12,450.00"
          change="+12.5%"
          trend="up"
          icon={DollarSign}
        />
        <StatsCard
          title="Total Orders"
          value="456"
          change="+8.2%"
          trend="up"
          icon={ShoppingBag}
        />
        <StatsCard
          title="Active Customers"
          value="1,203"
          change="+2.4%"
          trend="up"
          icon={Users}
        />
        <StatsCard
          title="Products Sold"
          value="892"
          change="-1.5%"
          trend="down"
          icon={Package}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area - Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50">
            <SectionHeader
              title="Recent Orders"
              action={<button className="text-primary-600 text-sm font-medium hover:text-primary-700">View All</button>}
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Time</th>
                </tr>
              </thead>
              <tbody>
                <RecentOrderRow id="#ORD-7782" customer="Alex Morgan" items={3} total="45.90" status="Completed" date="2 mins ago" />
                <RecentOrderRow id="#ORD-7781" customer="Sarah Wilson" items={1} total="12.50" status="Processing" date="15 mins ago" />
                <RecentOrderRow id="#ORD-7780" customer="James Doe" items={8} total="129.00" status="Completed" date="1 hour ago" />
                <RecentOrderRow id="#ORD-7779" customer="Emily Mack" items={2} total="24.00" status="Completed" date="2 hours ago" />
                <RecentOrderRow id="#ORD-7778" customer="Michael Scott" items={5} total="89.99" status="Refunded" date="3 hours ago" />
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Sidebar - Popular Items */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col h-full">
          <SectionHeader title="Top Selling Items" />

          <div className="space-y-4 flex-1">
            {[1, 2, 3, 4, 5].map((item, i) => (
              <div key={i} className="flex items-center gap-4 group cursor-pointer">
                <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                  <div className="w-full h-full bg-slate-200 animate-pulse group-hover:bg-slate-300 transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-slate-800 truncate group-hover:text-primary-600 transition-colors">Fresh Organic item {item}</h4>
                  <p className="text-xs text-slate-400">124 sales today</p>
                </div>
                <div className="text-sm font-bold text-slate-800">$4.99</div>
              </div>
            ))}
          </div>

          <button className="w-full mt-6 py-3 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors">
            View Analytics
          </button>
        </div>
      </div>
    </div>
  );
}
