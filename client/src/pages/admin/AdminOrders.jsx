import React, { useState, useEffect } from 'react';
import { ShoppingBag, Eye, Truck, CheckCircle2, Clock, X, Search } from 'lucide-react';
import { orderAPI } from '../../services/api';
import { formatPrice } from '../../utils/formatCurrency';

export const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [search, setSearch] = useState('');

  // Status update modal
  const [newStatus, setNewStatus] = useState('Placed');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [courierPartner, setCourierPartner] = useState('Delhivery');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await orderAPI.getAllOrders();
      if (Array.isArray(res.orders)) {
        setOrders(res.orders);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.warn('Orders fetch error:', err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const openStatusModal = (ord) => {
    setSelectedOrder(ord);
    setNewStatus(ord.orderStatus || 'Placed');
    setTrackingNumber(ord.trackingNumber || '');
    setCourierPartner(ord.courierPartner || 'Delhivery');
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;

    try {
      await orderAPI.updateOrderStatus(selectedOrder._id, {
        orderStatus: newStatus,
        trackingNumber,
        courierPartner
      });

      setOrders(orders.map(o => 
        (o._id === selectedOrder._id || o.orderNumber === selectedOrder.orderNumber)
          ? { ...o, orderStatus: newStatus, trackingNumber, courierPartner }
          : o
      ));
      setSelectedOrder(null);
    } catch (err) {
      // Local UI update
      setOrders(orders.map(o => 
        (o._id === selectedOrder._id || o.orderNumber === selectedOrder.orderNumber)
          ? { ...o, orderStatus: newStatus, trackingNumber, courierPartner }
          : o
      ));
      setSelectedOrder(null);
    }
  };

  const filteredOrders = orders.filter(o =>
    o.orderNumber?.toLowerCase().includes(search.toLowerCase()) ||
    o.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
    o.customer?.phone?.includes(search)
  );

  return (
    <div className="space-y-6 max-w-7xl">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 font-serif">Customer Orders & Shipments</h1>
        <p className="text-xs text-gray-500 mt-1">
          Monitor incoming customer orders, manage fulfilment statuses, and assign courier tracking numbers.
        </p>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex items-center justify-between gap-4 bg-white p-3.5 rounded-2xl border border-gray-200">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Order #, Customer Name, or Phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-green"
          />
        </div>
        <span className="text-xs text-gray-500 font-semibold">
          Total: <strong>{orders.length}</strong> Orders
        </span>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider text-[10px] border-b border-gray-200">
              <tr>
                <th className="p-4">Order #</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Items</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((ord) => (
                <tr key={ord._id || ord.orderNumber} className="hover:bg-gray-50">
                  <td className="p-4 font-bold text-brand-green">
                    {ord.orderNumber}
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-gray-900">{ord.customer?.name}</div>
                    <div className="text-[11px] text-gray-500">{ord.customer?.phone}</div>
                    <div className="text-[10px] text-gray-400">{ord.shippingAddress?.city}, {ord.shippingAddress?.state}</div>
                  </td>
                  <td className="p-4">
                    <span className="font-semibold">{ord.items?.length || 1} Jar(s)</span>
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
                  <td className="p-4 text-right">
                    <button
                      onClick={() => openStatusModal(ord)}
                      className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-brand-green hover:text-white font-bold text-[11px] transition-colors"
                    >
                      Update Status
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status Update Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="text-base font-bold text-gray-900 font-serif">
                Manage Order #{selectedOrder.orderNumber}
              </h3>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateStatus} className="space-y-4 text-xs">
              <div>
                <label className="font-bold block mb-1">Update Fulfilment Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-300 font-semibold"
                >
                  <option value="Placed">Placed (ऑर्डर मिला)</option>
                  <option value="Processing">Processing (पैकिंग जारी)</option>
                  <option value="Shipped">Shipped (कूरियर को सौंपा)</option>
                  <option value="Delivered">Delivered (डिलीवर हो गया)</option>
                  <option value="Cancelled">Cancelled (रद्द किया गया)</option>
                </select>
              </div>

              <div>
                <label className="font-bold block mb-1">Courier Partner</label>
                <input
                  type="text"
                  value={courierPartner}
                  onChange={(e) => setCourierPartner(e.target.value)}
                  placeholder="e.g. Delhivery / Bluedart"
                  className="w-full p-2.5 rounded-xl border border-gray-300"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Tracking Number (AWB)</label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="e.g. DEL12345678"
                  className="w-full p-2.5 rounded-xl border border-gray-300"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-green text-white font-bold"
                >
                  Save Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminOrders;

