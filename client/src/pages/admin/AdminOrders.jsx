import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { ShoppingBag, Eye, Truck, CheckCircle2, Clock, X, Search, ExternalLink, Loader2, PackageCheck } from 'lucide-react';
import { orderAPI, shippingAPI } from '../../services/api';
import { formatPrice } from '../../utils/formatCurrency';

export const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [search, setSearch] = useState('');
  const [dispatchingOrderId, setDispatchingOrderId] = useState(null);

  // Status update modal
  const [newStatus, setNewStatus] = useState('Placed');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [courierPartner, setCourierPartner] = useState('iThink Logistics Express');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await orderAPI.getAllOrders();
      if (Array.isArray(res.orders)) {
        // Strictly show only verified completed paid orders (never pending or failed)
        setOrders(res.orders.filter(o => o.paymentStatus === 'completed'));
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

  const handleShipWithIThink = async (ord) => {
    if (!window.confirm(`Generate iThink Logistics shipment and AWB for Order #${ord.orderNumber}?`)) return;
    setDispatchingOrderId(ord._id);
    try {
      const res = await shippingAPI.generateAWB(ord._id);
      if (res.success) {
        const waybill = res.waybill || res.trackingNumber;
        const courier = res.courier || 'iThink Logistics Express';
        toast.success(`Shipment booked!\nAWB: ${waybill}\nCourier: ${courier}`);
        setOrders(prev => prev.map(o => o._id === ord._id ? {
          ...o,
          orderStatus: 'Shipped',
          trackingNumber: waybill,
          courierPartner: courier
        } : o));
      } else {
        toast.error('iThink Logistics notice: ' + (res.message || 'Unable to book shipment. Check pincode or credentials.'));
      }
    } catch (err) {
      toast.error('iThink Logistics booking error: ' + (err.message || 'Server error'));
    } finally {
      setDispatchingOrderId(null);
    }
  };

  const openStatusModal = (ord) => {
    setSelectedOrder(ord);
    setNewStatus(ord.orderStatus || 'Placed');
    setTrackingNumber(ord.trackingNumber || '');
    setCourierPartner(ord.courierPartner || 'iThink Logistics Express');
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
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-12 text-center text-gray-400">
                    <ShoppingBag className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p className="font-medium text-xs">No customer orders recorded yet.</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
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
                      {ord.trackingNumber ? (
                        <div className="flex flex-col items-end gap-1">
                          <a
                            href={`https://my.ithinklogistics.com/track/${ord.trackingNumber}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10.5px] font-bold shadow-2xs transition-colors"
                            title="Track live shipment on iThink Logistics"
                          >
                            <Truck className="w-3 h-3 text-emerald-600" />
                            <span>AWB: {ord.trackingNumber}</span>
                            <ExternalLink className="w-2.5 h-2.5 text-gray-500" />
                          </a>
                          <button
                            onClick={() => openStatusModal(ord)}
                            className="text-[10px] text-gray-400 hover:text-brand-green font-semibold underline cursor-pointer"
                          >
                            Edit Status
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleShipWithIThink(ord)}
                            disabled={dispatchingOrderId === ord._id}
                            className="px-3 py-1.5 rounded-xl bg-[#002E6E] hover:bg-[#001D47] text-white text-[11px] font-bold flex items-center gap-1.5 shadow-xs cursor-pointer transition-all disabled:opacity-50"
                            title="Generate AWB tracking code directly via iThink Logistics"
                          >
                            {dispatchingOrderId === ord._id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Truck className="w-3 h-3 text-amber-400" />
                            )}
                            <span>Ship with iThink</span>
                          </button>
                          <button
                            onClick={() => openStatusModal(ord)}
                            className="px-2.5 py-1.5 rounded-xl border border-gray-200 hover:bg-gray-100 text-gray-700 font-semibold text-[11px] cursor-pointer"
                          >
                            Manual
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
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

              {/* Quick Auto-AWB via iThink Logistics button */}
              <div className="bg-blue-50/70 p-3 rounded-2xl border border-blue-200/80">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-gray-900 text-xs flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-[#002E6E]" /> iThink Logistics Auto-Shipment
                  </span>
                  <span className="text-[10px] text-blue-700 font-bold bg-blue-100 px-2 py-0.5 rounded-full">
                    Recommended
                  </span>
                </div>
                <p className="text-[11px] text-gray-600 mb-2.5">
                  1-click me iThink Logistics API se real AWB number aur courier generate karein.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    handleShipWithIThink(selectedOrder);
                    setSelectedOrder(null);
                  }}
                  className="w-full py-2 bg-[#002E6E] hover:bg-[#001D47] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <PackageCheck className="w-4 h-4 text-amber-400" />
                  <span>Generate AWB with iThink Logistics</span>
                </button>
              </div>

              <div>
                <label className="font-bold block mb-1">Manual Courier Partner</label>
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

