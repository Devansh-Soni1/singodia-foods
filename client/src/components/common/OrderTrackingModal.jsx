import React, { useState, useEffect } from 'react';
import { 
  X, Truck, Package, CheckCircle2, Copy, Check, Loader2, 
  ExternalLink, MapPin, Calendar, CreditCard, ChevronRight, Sparkles
} from 'lucide-react';
import { shippingAPI } from '../../services/api';
import { formatPrice } from '../../utils/formatCurrency';

export const OrderTrackingModal = ({ order, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('tracking'); // 'tracking' | 'details'
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const waybill = order?.trackingNumber || order?.shipping?.trackingNumber || '';
  const carrierName = trackingData?.courierName || order?.courierPartner || order?.carrier || 'Delhivery';

  // Format date-time like "Fri, 09 Oct, 1:06 AM" matching screenshot
  const formatDateTime = (dateInput) => {
    if (!dateInput) return '';
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return String(dateInput);

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const dayStr = days[d.getDay()];
    const dateStr = String(d.getDate()).padStart(2, '0');
    const monthStr = months[d.getMonth()];

    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;

    return `${dayStr}, ${dateStr} ${monthStr}, ${hours}:${minutes} ${ampm}`;
  };

  useEffect(() => {
    if (!isOpen || !order) return;

    let isMounted = true;
    const fetchTracking = async () => {
      setLoading(true);
      try {
        if (waybill) {
          const res = await shippingAPI.trackShipment(waybill);
          if (isMounted) {
            setTrackingData(res && res.success ? res : null);
          }
        } else {
          if (isMounted) setTrackingData(null);
        }
      } catch (err) {
        if (isMounted) setTrackingData(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchTracking();

    return () => {
      isMounted = false;
    };
  }, [isOpen, order, waybill]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen || !order) return null;

  const handleCopyAwb = (e) => {
    e.stopPropagation();
    if (!waybill) return;
    navigator.clipboard.writeText(waybill);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Determine order status & active timeline index (0 to 4)
  const currentStatusLower = String(
    trackingData?.currentStatus || order?.orderStatus || 'Placed'
  ).toLowerCase();

  let activeStep = 0;
  let statusTitle = 'Order Placed';
  let statusBadgeText = '✨ Order confirmed & in preparation';

  if (currentStatusLower.includes('deliver') && !currentStatusLower.includes('out')) {
    activeStep = 4;
    statusTitle = 'Order Delivered';
    statusBadgeText = '🎉 1 day early delivery!';
  } else if (currentStatusLower.includes('out')) {
    activeStep = 3;
    statusTitle = 'Out for Delivery';
    statusBadgeText = '🚚 Arriving today by courier';
  } else if (
    currentStatusLower.includes('way') ||
    currentStatusLower.includes('transit') ||
    currentStatusLower.includes('shipped') ||
    currentStatusLower.includes('dispatch')
  ) {
    activeStep = 2;
    statusTitle = 'On the Way';
    statusBadgeText = trackingData?.expectedDeliveryDate 
      ? `🕒 Expected: ${trackingData.expectedDeliveryDate}` 
      : '🚚 In transit to destination hub';
  } else if (currentStatusLower.includes('pack') || currentStatusLower.includes('process') || waybill) {
    activeStep = 1;
    statusTitle = 'Picked Up';
    statusBadgeText = '📦 Handed over to courier partner';
  } else {
    activeStep = 0;
    statusTitle = 'Order Placed';
    statusBadgeText = '✨ Order placed & verified';
  }

  // Construct milestone dates based on order timeline
  const orderCreatedAt = order.createdAt ? new Date(order.createdAt) : new Date();
  const pickedUpDate = new Date(orderCreatedAt.getTime() + 10 * 3600 * 1000);
  const onTheWayDate = new Date(orderCreatedAt.getTime() + 34 * 3600 * 1000);
  const outForDeliveryDate = new Date(orderCreatedAt.getTime() + 68 * 3600 * 1000);
  const deliveredDate = new Date(orderCreatedAt.getTime() + 74 * 3600 * 1000);

  const timelineMilestones = [
    {
      title: 'Order Placed',
      date: formatDateTime(orderCreatedAt),
      subtext: 'We have received your order'
    },
    {
      title: 'Picked Up',
      date: formatDateTime(pickedUpDate),
      subtext: 'Package picked up from Sujangarh warehouse'
    },
    {
      title: 'On the Way',
      date: formatDateTime(onTheWayDate),
      subtext: 'In transit to destination delivery hub'
    },
    {
      title: 'Out for Delivery',
      date: formatDateTime(outForDeliveryDate),
      subtext: 'Delivery executive is out with your parcel'
    },
    {
      title: 'Delivered',
      date: formatDateTime(deliveredDate),
      subtext: 'Your order has been delivered'
    }
  ];

  // Primary product summary
  const primaryItemName = order.items?.[0]?.name || 'Rajasthani Desi Homemade Pickle';
  const additionalItemsCount = (order.items?.length || 1) - 1;
  const itemsSummary = additionalItemsCount > 0 
    ? `${primaryItemName} (+${additionalItemsCount} more item${additionalItemsCount > 1 ? 's' : ''})`
    : primaryItemName;

  const officialTrackingUrl = order?.shipping?.trackingUrl || trackingData?.trackingUrl || (waybill
    ? `https://www.ithinklogistics.co.in/postship/tracking/${waybill}`
    : 'https://www.ithinklogistics.co.in/');

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto cursor-pointer"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-[420px] bg-white rounded-3xl shadow-2xl overflow-hidden my-auto border border-gray-200 flex flex-col cursor-default font-sans animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Delhivery / Singodia Brand Bar */}
        <div className="bg-black text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-black text-base tracking-widest text-white uppercase font-sans">
              DELHIVERY
            </span>
            <span className="text-[10px] text-gray-400 font-medium">| Singodia Foods</span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-5 overflow-y-auto max-h-[82vh] space-y-4">
          
          {/* Green Status Hero Card (Matching Delhivery/Meesho Screenshot) */}
          <div className="bg-[#0e8a50] rounded-2xl p-5 text-white shadow-sm relative overflow-hidden">
            {/* Top Row: Title + Circle Check */}
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                <span>{statusTitle}</span>
                {activeStep === 4 ? (
                  <CheckCircle2 className="w-6 h-6 fill-white text-[#0e8a50]" />
                ) : activeStep >= 2 ? (
                  <Truck className="w-5 h-5 text-white animate-pulse" />
                ) : (
                  <Package className="w-5 h-5 text-white" />
                )}
              </h2>
            </div>

            {/* Sub-badge: e.g. "🎉 1 day early delivery!" */}
            <div className="mt-2.5">
              <span className="inline-flex items-center gap-1.5 bg-black/25 text-white text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-xs">
                {statusBadgeText}
              </span>
            </div>

            {/* Divider */}
            <div className="border-t border-white/20 my-3.5" />

            {/* Brand & Item Info */}
            <div className="space-y-1">
              <p className="text-xs font-medium text-white/90">
                Singodia Foods
              </p>
              <p className="text-sm font-bold text-white uppercase tracking-wide truncate">
                {itemsSummary}
              </p>
            </div>

            {/* AWB with Copy Button */}
            {waybill && (
              <div className="mt-2 flex items-center justify-between text-xs text-white/90">
                <span className="font-mono tracking-wider">
                  AWB #{waybill}
                </span>
                <button
                  type="button"
                  onClick={handleCopyAwb}
                  className="p-1 hover:bg-white/20 rounded-md transition-colors text-white cursor-pointer inline-flex items-center gap-1"
                  title="Copy AWB"
                >
                  {copied ? (
                    <span className="text-[10px] bg-white text-[#0e8a50] font-bold px-1.5 py-0.5 rounded">
                      Copied!
                    </span>
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Segmented Control / Tab Switcher (Matching Screenshot) */}
          <div className="bg-[#F2F2F2] p-1 rounded-full flex max-w-[280px] mx-auto border border-gray-200">
            <button
              type="button"
              onClick={() => setActiveTab('tracking')}
              className={`flex-1 py-1.5 px-4 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'tracking'
                  ? 'bg-black text-white shadow-xs'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              Tracking
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('details')}
              className={`flex-1 py-1.5 px-4 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'details'
                  ? 'bg-black text-white shadow-xs'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              Order Details
            </button>
          </div>

          {/* TAB 1: Tracking Timeline (Exact Delhivery Minimalist Vertical Style) */}
          {activeTab === 'tracking' && (
            <div className="pt-2 px-2 sm:px-3">
              {loading ? (
                <div className="py-12 text-center space-y-2">
                  <Loader2 className="w-6 h-6 animate-spin text-[#0e8a50] mx-auto" />
                  <p className="text-xs text-gray-500 font-medium">लाइव ट्रैकिंग लोड हो रही है...</p>
                </div>
              ) : (
                <div className="relative space-y-6">
                  {/* Vertical continuous line */}
                  <div 
                    className="absolute top-2 bottom-3 left-[5px] w-[2px] bg-[#0e8a50]" 
                    style={{
                      background: `linear-gradient(to bottom, #0e8a50 ${(activeStep / 4) * 100}%, #E5E7EB ${(activeStep / 4) * 100}%)`
                    }}
                  />

                  {timelineMilestones.map((st, idx) => {
                    const isPassedOrCurrent = idx <= activeStep;
                    const isFinalDelivered = idx === 4;

                    return (
                      <div key={idx} className="relative flex items-start gap-4 pl-0">
                        {/* Dot on line */}
                        <div 
                          className={`w-3 h-3 rounded-full shrink-0 mt-1 transition-all z-10 ${
                            isPassedOrCurrent 
                              ? 'bg-[#0e8a50] ring-4 ring-[#0e8a50]/20' 
                              : 'bg-gray-300'
                          }`} 
                        />

                        {/* Event Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-baseline gap-1.5">
                            <span className={`text-sm font-bold ${
                              isPassedOrCurrent ? 'text-gray-900' : 'text-gray-400'
                            }`}>
                              {st.title}
                            </span>
                            
                            {/* Checkmark icon next to Delivered */}
                            {isFinalDelivered && isPassedOrCurrent && (
                              <CheckCircle2 className="w-3.5 h-3.5 fill-[#0e8a50] text-white inline-block -mt-0.5" />
                            )}

                            <span className="text-xs text-gray-400">|</span>

                            <span className={`text-xs ${
                              isPassedOrCurrent ? 'text-gray-500' : 'text-gray-400'
                            }`}>
                              {st.date}
                            </span>
                          </div>

                          {/* Subtitle / Remark below current or delivered milestone */}
                          {(idx === activeStep || (isFinalDelivered && isPassedOrCurrent)) && (
                            <p className="text-xs text-gray-500 mt-0.5">
                              {st.subtext}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Order Details */}
          {activeTab === 'details' && (
            <div className="space-y-4 text-xs text-gray-700 animate-in fade-in duration-150">
              {/* Items List */}
              <div className="bg-gray-50 rounded-2xl p-3.5 border border-gray-200 space-y-2.5">
                <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-[#0e8a50]" />
                  Items in Shipment
                </h4>
                <div className="divide-y divide-gray-200">
                  {order.items?.map((it, idx) => (
                    <div key={idx} className="py-2 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {it.image ? (
                          <img src={it.image} alt={it.name} className="w-9 h-9 object-cover rounded-lg border border-gray-200" />
                        ) : (
                          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#0e8a50] flex items-center justify-center font-bold">
                            🌶️
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-bold text-gray-900 truncate">{it.name}</p>
                          <p className="text-[11px] text-gray-500">{it.weight} × {it.quantity}</p>
                        </div>
                      </div>
                      <span className="font-bold text-gray-900 shrink-0">
                        {formatPrice(it.price * it.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Address Card */}
              <div className="bg-gray-50 rounded-2xl p-3.5 border border-gray-200 space-y-1">
                <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#0e8a50]" />
                  Delivery Address
                </h4>
                <p className="font-bold text-gray-900">
                  {order.customer?.name || order.shippingAddress?.fullName || 'Customer'}
                </p>
                <p className="text-gray-600 leading-relaxed">
                  {order.shippingAddress?.addressLine1}
                  {order.shippingAddress?.addressLine2 && `, ${order.shippingAddress.addressLine2}`}
                  {order.shippingAddress?.landmark && `, Near ${order.shippingAddress.landmark}`}
                </p>
                <p className="text-gray-600">
                  {order.shippingAddress?.city}, {order.shippingAddress?.state} — <strong className="text-gray-900">{order.shippingAddress?.pincode}</strong>
                </p>
                {order.customer?.phone && (
                  <p className="text-gray-500 pt-1">
                    Phone: +91 {order.customer.phone}
                  </p>
                )}
              </div>

              {/* Payment Summary */}
              <div className="bg-gray-50 rounded-2xl p-3.5 border border-gray-200 space-y-1.5">
                <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-[#0e8a50]" />
                  Payment Summary
                </h4>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-bold text-gray-900 uppercase">
                    {order.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Prepaid (Online)'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Payment Status:</span>
                  <span className="font-bold text-emerald-700 capitalize">
                    {order.paymentStatus || 'Completed'}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-gray-200 text-sm">
                  <span className="font-bold text-gray-900">Total Paid:</span>
                  <span className="font-bold text-[#0e8a50]">{formatPrice(order.totalAmount)}</span>
                </div>
              </div>
            </div>
          )}

          {/* External Courier Website Link */}
          <div className="pt-2 text-center">
            <a
              href={officialTrackingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-black transition-colors"
            >
              <span>View full updates on Delhivery tracking</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OrderTrackingModal;
