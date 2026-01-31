import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle
} from 'lucide-react';
import { useCandidateData } from '../context/CandidateContext';
import config from '../helper/config';

// ----------------- Stats Card -----------------
const StatsCard = ({ title, value, change, icon: Icon, trend }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-primary-50 rounded-xl">
        <Icon className="w-6 h-6 text-primary-600" />
      </div>
      <div
        className={`flex items-center gap-1 text-sm font-medium ${
          trend === 'up' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
        } px-2 py-1 rounded-lg`}
      >
        {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
        {change}
      </div>
    </div>
    <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
    <p className="text-2xl font-bold text-slate-800">{value}</p>
  </div>
);

// ----------------- Section Header -----------------
const SectionHeader = ({ title, action }) => (
  <div className="flex items-center justify-between mb-6">
    <h2 className="text-lg font-bold text-slate-800">{title}</h2>
    {action}
  </div>
);

// ----------------- Recent Order Row -----------------
const RecentOrderRow = ({ id, customer, itemsText, total, status, date }) => (
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
    <td className="py-4 px-4 text-sm text-slate-500">{itemsText}</td>
    <td className="py-4 px-4 font-medium text-slate-800">${total}</td>
    <td className="py-4 px-4">
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
          status === 'Completed'
            ? 'bg-green-50 text-green-700 border-green-100'
            : status === 'Pending'
            ? 'bg-amber-50 text-amber-700 border-amber-100'
            : 'bg-slate-50 text-slate-700 border-slate-100'
        }`}
      >
        {status === 'Completed' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
        {status}
      </span>
    </td>
    <td className="py-4 px-4 text-sm text-slate-400 text-right">{date}</td>
  </tr>
);

// ----------------- Dashboard -----------------
const Dashboard = () => {
  const { candidateData, loading, error } = useCandidateData();
  const [items, setItems] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (candidateData?.data) {
      setItems(candidateData.data.items || []);
      setCustomers(candidateData.data.customers || []);
      setOrders(candidateData.data.orders || []);
    }
  }, [candidateData]);

  if (loading) return <div>Loading candidate data...</div>;
  if (error) return <div>Error loading candidate data</div>;
  if (!candidateData?.data) return <div>No candidate data found</div>;

  // ------------------ Helper to format order items ------------------
  const getOrderItemsText = (orderItems) => {
  // Sum the quantities of all items
  return orderItems.reduce((total, item) => total + (item.quantity || 1), 0);
};


  return (
    <div className="p-2 space-y-6 max-w-[1200px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
          <p className="text-slate-500 text-sm mt-1">Welcome back, here's what's happening today.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Sales" value={`Rs.${orders.reduce((sum, o) => sum + (o.order_process.total_amount || 0), 0)}`} change="+12.5%" trend="up" icon={DollarSign} />
        <StatsCard title="Total Orders" value={orders.length} change="+8.2%" trend="up" icon={ShoppingBag} />
        <StatsCard title="Active Customers" value={customers.length} change="+2.4%" trend="up" icon={Users} />
        <StatsCard title="Products Sold" value={items.length} change="-1.5%" trend="down" icon={Package} />
      </div>

      {/* Orders Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                {orders.length > 0 ? (
                  orders.map((orderWrapper) => {
                    const { order_process, items: orderItems } = orderWrapper;
                    const customerName = customers.find(c => c.customer_id === order_process.customer_id)?.first_name || '-';
                    const itemsText = getOrderItemsText(orderItems);
                    const totalPrice = order_process.total_amount || orderItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
                    const status = order_process.status_id === 1 ? 'Completed' : 'Pending';
                    const date = new Date(order_process.created_at).toLocaleString();

                    return (
                      <RecentOrderRow
                        key={order_process.order_process_id}
                        id={`#ORD-${order_process.order_process_id}`}
                        customer={customerName}
                        itemsText={itemsText}
                        total={totalPrice}
                        status={status}
                        date={date}
                      />
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="py-4 px-4 text-center text-slate-500">
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Selling Items */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col h-full">
          <SectionHeader title="Top Selling Items" />
          <div className="space-y-4 flex-1">
            {items.length > 0 ? (
              items.map((item, i) => (
                <div key={i} className="flex items-center gap-4 group cursor-pointer">
                  <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                    <img  src={`${config.pos_api_url}/static/images/products/${item.image_code || ''}`} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-slate-800 truncate group-hover:text-primary-600 transition-colors">
                      {item.item_name}
                    </h4>
                    <p className="text-xs text-slate-400">{item.current_quantity || 0} sales today</p>
                  </div>
                  <div className="text-sm font-bold text-slate-800">Rs.{item.sale_price || 0}</div>
                </div>
              ))
            ) : (
              <p className="text-center text-slate-400">No items found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
