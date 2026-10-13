import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, ShoppingBag, Package, Users, AlertTriangle, 
  ArrowUpRight, Clock, CheckCircle2, Truck 
} from 'lucide-react';
import { adminAPI } from '../../services/api';
import { formatPrice } from '../../utils/formatCurrency';

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    recentOrders: [],
    lowStockProducts: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminAPI.getStats();
        if (res.stats) {
          setStats(res.stats);
        }
      } catch (err) {
        console.error('Failed to load stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Revenue',
      value: formatPrice(stats.totalRevenue),
      desc: '+18% from last month',
      icon: TrendingUp,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      desc: 'Pan-India deliveries',
      icon: ShoppingBag,
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      title: 'Pickle Products',
      value: stats.totalProducts,
      desc: 'Active barni recipes',
      icon: Package,
      color: 'bg-amber-50 text-amber-700 border-amber-200'
    },
    {
      title: 'Registered Customers',
      value: stats.totalCustomers,
      desc: 'Active buyers',
      icon: Users,
      color: 'bg-purple-50 text-purple-700 border-purple-200'
    }
  ];

  return (
    <div className="space-y-8 max-w-7xl">
      
      {/* Top Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 font-serif">Dashboard Overview</h1>
        <p className="text-xs text-gray-500 mt-1">
          Real-time metrics, revenue, and order tracking for Singodhia Foods.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`p-6 rounded-2xl border bg-white shadow-xs space-y-3 transition-transform hover:-translate-y-1 ${card.color}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-600">{card.title}</span>
                <div className="p-2 rounded-xl bg-white shadow-xs">
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-extrabold text-gray-900 block font-sans">
                  {card.value}
                </span>
                <span className="text-[11px] text-gray-500 font-medium">
                  {card.desc}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900 font-serif">Recent Orders</h2>
          <Link
            to="/admin/orders"
            className="text-xs font-bold text-brand-green hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider text-[10px] border-b border-gray-200">
              <tr>
                <th className="p-4">Order #</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stats.recentOrders && stats.recentOrders.length > 0 ? (
                stats.recentOrders.map((ord) => (
                  <tr key={ord._id || ord.orderNumber} className="hover:bg-gray-50">
                    <td className="p-4 font-bold text-brand-green">
                      {ord.orderNumber}
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-gray-900">{ord.customer?.name}</div>
                      <div className="text-[11px] text-gray-500">{ord.customer?.phone}</div>
                    </td>
                    <td className="p-4 font-bold text-gray-900">
                      {formatPrice(ord.totalAmount)}
                    </td>
                    <td className="p-4">
                      <span className="capitalize font-medium">
                        {ord.paymentMethod?.toUpperCase()} ({ord.paymentStatus})
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        ord.orderStatus === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ord.orderStatus === 'Shipped'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {ord.orderStatus}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500">
                      {new Date(ord.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">
                    No recent orders to show.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;

