import React, { useState, useEffect } from 'react';
import { 
  X, Truck, Package, CheckCircle2, Copy, Loader2, 
  ExternalLink, MapPin, CreditCard, ChevronDown, ChevronUp, AlertCircle
} from 'lucide-react';
import { shippingAPI } from '../../services/api';
import { formatPrice } from '../../utils/formatCurrency';

export const OrderTrackingModal = ({ order, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('tracking'); // 'tracking' | 'details'
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showDetailedScans, setShowDetailedScans] = useState(false);

  const waybill = order?.trackingNumber || order?.shipping?.trackingNumber || '';
  const carrierName = trackingData?.courierName || order?.courierPartner || order?.carrier || 'Delhivery';

  // Robust parser for dates including Indian DD-MM-YYYY format
  const parseCustomDate = (dateInput) => {
    if (!dateInput) return null;
    if (dateInput instanceof Date && !isNaN(dateInput.getTime())) return dateInput;
    const str = String(dateInput).trim();

    // Check DD-MM-YYYY or DD/MM/YYYY with optional time
    const dmyMatch = str.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})(?:\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/);
    if (dmyMatch) {
      const [, d, m, y, h = 0, min = 0, s = 0] = dmyMatch;
      return new Date(y, m - 1, d, h, min, s);
    }

    // Check YYYY-MM-DD or YYYY/MM/DD with optional time
    const ymdMatch = str.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})(?:\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/);
    if (ymdMatch) {
      const [, y, m, d, h = 0, min = 0, s = 0] = ymdMatch;
      return new Date(y, m - 1, d, h, min, s);
    }

    const d = new Date(str);
    return isNaN(d.getTime()) ? null : d;
  };

  // Format date-time like "Fri, 09 Oct, 1:06 AM" matching Delhivery style
  const formatDateTime = (dateInput) => {
    if (!dateInput) return '';
    const d = parseCustomDate(dateInput);
    if (!d) return String(dateInput);

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

  // Live status directly from iThink Logistics API, with fallback to order status
  const rawStatus = trackingData?.currentStatus || order?.orderStatus || 'Placed';
  const liveStatusLower = String(rawStatus).toLowerCase();

  let statusTitle = rawStatus;
  let statusBadgeText = '';
  let isDelivered = false;
  let isRtoOrCancelled = false;

  // Determine stage (1 to 5) matching Delhivery's 5 milestones:
  // 1: Order Placed
  // 2: Picked Up
  // 3: On the Way (In Transit)
  // 4: Out for Delivery
  // 5: Delivered
  let currentMilestoneStep = 1;

  if (liveStatusLower.includes('deliver') && !liveStatusLower.includes('out') && !liveStatusLower.includes('undeliver')) {
    statusTitle = 'Order Delivered';
    statusBadgeText = '🎉 Successfully delivered!';
    isDelivered = true;
    currentMilestoneStep = 5;
  } else if (liveStatusLower.includes('out') || liveStatusLower.includes('of_delivery')) {
    statusTitle = 'Out for Delivery';
    statusBadgeText = '🚚 Out for delivery today';
    currentMilestoneStep = 4;
  } else if (liveStatusLower.includes('transit') || liveStatusLower.includes('shipped') || liveStatusLower.includes('way') || liveStatusLower.includes('reach') || liveStatusLower.includes('hub')) {
    statusTitle = 'On the Way';
    statusBadgeText = trackingData?.expectedDeliveryDate 
      ? `🕒 Expected: ${trackingData.expectedDeliveryDate}` 
      : '🚚 In Transit to destination';
    currentMilestoneStep = 3;
  } else if (liveStatusLower.includes('pickup') || liveStatusLower.includes('picked') || liveStatusLower.includes('manifest') || liveStatusLower.includes('pack') || liveStatusLower.includes('dispatch') || waybill) {
    statusTitle = liveStatusLower.includes('picked') ? 'Picked Up' : 'Manifest Generated';
    statusBadgeText = trackingData?.expectedDeliveryDate 
      ? `🕒 Expected: ${trackingData.expectedDeliveryDate}` 
      : '📦 Ready for courier pickup';
    currentMilestoneStep = 2;
  } else if (liveStatusLower.includes('cancel') || liveStatusLower.includes('rto')) {
    statusTitle = liveStatusLower.includes('cancel') ? 'Order Cancelled' : 'RTO Initiated';
    statusBadgeText = '⚠️ Delivery stopped/returned';
    isRtoOrCancelled = true;
    currentMilestoneStep = 1;
  } else {
    statusTitle = 'Order Placed';
    statusBadgeText = '✨ Order confirmed';
    currentMilestoneStep = 1;
  }

  // Primary product summary
  const primaryItemName = order.items?.[0]?.name || 'Rajasthani Homemade Pickle';
  const additionalItemsCount = (order.items?.length || 1) - 1;
  const itemsSummary = additionalItemsCount > 0 
    ? `${primaryItemName} (+${additionalItemsCount} more)`
    : primaryItemName;

  const officialTrackingUrl = order?.shipping?.trackingUrl || trackingData?.trackingUrl || (waybill
    ? `https://www.ithinklogistics.co.in/postship/tracking/${waybill}`
    : 'https://www.ithinklogistics.co.in/');

  const liveScans = Array.isArray(trackingData?.events) ? trackingData.events : [];

  // Build the 5 Delhivery milestones
  // 1: Order Placed
  // 2: Picked Up
  // 3: On the Way
  // 4: Out for Delivery
  // 5: Delivered
  const placedDateStr = formatDateTime(order.createdAt);
  
  // Look for scan events that match pickup, transit, out for delivery, and delivery
  let pickupDateStr = '';
  let transitDateStr = '';
  let outForDeliveryDateStr = '';
  let deliveredDateStr = '';

  liveScans.forEach((ev) => {
    const st = String(ev.status || '').toLowerCase();
    const formatted = formatDateTime(ev.timestamp);
    if ((st.includes('pick') || st.includes('manifest') || st.includes('dispatched')) && !pickupDateStr) {
      pickupDateStr = formatted;
    }
    if ((st.includes('transit') || st.includes('hub') || st.includes('reached') || st.includes('arrived')) && !transitDateStr) {
      transitDateStr = formatted;
    }
    if (st.includes('out') && !outForDeliveryDateStr) {
      outForDeliveryDateStr = formatted;
    }
    if (st.includes('deliver') && !st.includes('out') && !deliveredDateStr) {
      deliveredDateStr = formatted;
    }
  });

  const milestones = isRtoOrCancelled ? [
    {
      step: 1,
      title: 'Order Placed',
      date: placedDateStr || 'Confirmed',
      subtext: 'Your order was received and verified',
      isCompleted: true
    },
    {
      step: 2,
      title: 'Order Cancelled',
      date: formatDateTime(order.updatedAt) || 'Cancelled',
      subtext: 'This order has been cancelled and parcel dispatch has been halted.',
      isCompleted: true
    }
  ] : [
    {
      step: 1,
      title: 'Order Placed',
      date: placedDateStr || 'Confirmed',
      subtext: 'Your order has been received and verified',
      isCompleted: currentMilestoneStep >= 1
    },
    {
      step: 2,
      title: 'Picked Up',
      date: pickupDateStr || (currentMilestoneStep >= 2 ? formatDateTime(order.shipping?.dispatchedAt || order.createdAt) : ''),
      subtext: currentMilestoneStep >= 2 
        ? `Handed over to ${carrierName} at Sujangarh (331507)` 
        : 'Preparing parcel at Singodia Foods Kitchen',
      isCompleted: currentMilestoneStep >= 2
    },
    {
      step: 3,
      title: 'On the Way',
      date: transitDateStr || (currentMilestoneStep >= 3 ? 'In Transit' : ''),
      subtext: currentMilestoneStep >= 3 
        ? (trackingData?.lastLocation ? `Package at ${trackingData.lastLocation}` : 'Package is in transit to destination hub')
        : (trackingData?.expectedDeliveryDate ? `Expected: ${trackingData.expectedDeliveryDate}` : ''),
      isCompleted: currentMilestoneStep >= 3
    },
    {
      step: 4,
      title: 'Out for Delivery',
      date: outForDeliveryDateStr || (currentMilestoneStep >= 4 ? 'Today' : ''),
      subtext: currentMilestoneStep >= 4 
        ? 'Courier delivery agent is out to deliver your package' 
        : '',
      isCompleted: currentMilestoneStep >= 4
    },
    {
      step: 5,
      title: 'Delivered',
      date: deliveredDateStr || (currentMilestoneStep >= 5 ? 'Delivered' : ''),
      subtext: currentMilestoneStep >= 5 
        ? 'Your order has been delivered' 
        : (trackingData?.expectedDeliveryDate ? `Expected by ${trackingData.expectedDeliveryDate}` : ''),
      isCompleted: currentMilestoneStep >= 5
    }
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto cursor-pointer"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden my-auto border border-gray-100 flex flex-col cursor-default font-sans animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="bg-black text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-black text-sm tracking-widest text-white uppercase font-sans">
              {carrierName ? carrierName.toUpperCase() : 'DELHIVERY'}
            </span>
            <span className="text-[11px] text-gray-400 font-medium">| Singodia Foods</span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto max-h-[82vh] space-y-4">
          
          {/* Green Hero Status Card (Matching Delhivery Design) */}
          <div className={`${isRtoOrCancelled ? 'bg-amber-700' : 'bg-[#0e8a50]'} rounded-2xl p-5 text-white shadow-md relative overflow-hidden`}>
            {/* Status Title + Icon */}
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                <span>{statusTitle}</span>
                {isDelivered ? (
                  <CheckCircle2 className="w-6 h-6 fill-white text-[#0e8a50]" />
                ) : isRtoOrCancelled ? (
                  <AlertCircle className="w-6 h-6 text-white" />
                ) : (
                  <Truck className="w-5 h-5 text-white animate-pulse" />
                )}
              </h2>
            </div>

            {/* Sub-badge pill */}
            {statusBadgeText && (
              <div className="mt-2">
                <span className="inline-flex items-center gap-1.5 bg-black/25 text-white text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-xs">
                  {statusBadgeText}
                </span>
              </div>
            )}

            {/* Divider */}
            <div className="border-t border-white/20 my-3" />

            {/* Brand & Product */}
            <div className="space-y-0.5">
              <p className="text-xs font-medium text-white/90">
                Singodia Foods
              </p>
              <p className="text-sm font-bold text-white uppercase tracking-wide truncate">
                {itemsSummary}
              </p>
            </div>

            {/* AWB Number with Copy */}
            {waybill && (
              <div className="mt-2.5 flex items-center justify-between text-xs text-white/90 pt-1.5 border-t border-white/10">
                <span className="font-mono tracking-wider font-semibold">
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

          {/* Simple Segmented Control (Pill Tabs) */}
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

          {/* TAB 1: Tracking Timeline (Matching Screenshot) */}
          {activeTab === 'tracking' && (
            <div className="pt-2 px-1 sm:px-2">
              {loading ? (
                <div className="py-12 text-center space-y-2">
                  <Loader2 className="w-6 h-6 animate-spin text-[#0e8a50] mx-auto" />
                  <p className="text-xs text-gray-500 font-medium">
                    लाइव कूरियर स्टेटस लोड हो रहा है...
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Vertical connecting line container */}
                  <div className="relative pl-6 space-y-6">
                    {/* Vertical line behind dots */}
                    <div className="absolute top-2.5 bottom-2.5 left-[8px] w-[2px] bg-emerald-600" />

                    {milestones.map((ms) => {
                      const isPastOrCurrent = ms.isCompleted;
                      const isDeliveredStep = ms.step === 5 && isDelivered;

                      return (
                        <div key={ms.step} className="relative flex items-start gap-3">
                          {/* Dot on line */}
                          <div 
                            className={`absolute -left-[20px] top-1 w-2.5 h-2.5 rounded-full transition-all z-10 ${
                              isPastOrCurrent 
                                ? 'bg-emerald-600 ring-4 ring-emerald-100' 
                                : 'bg-gray-300'
                            }`} 
                          />

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-baseline gap-1.5">
                              <span className={`text-sm font-bold ${
                                isPastOrCurrent ? 'text-gray-900' : 'text-gray-400'
                              }`}>
                                {ms.title}
                              </span>

                              {isDeliveredStep && (
                                <CheckCircle2 className="w-3.5 h-3.5 fill-[#0e8a50] text-white inline-block -mt-0.5" />
                              )}

                              {ms.date && (
                                <>
                                  <span className="text-xs text-gray-400">|</span>
                                  <span className={`text-xs ${
                                    isPastOrCurrent ? 'text-gray-500 font-normal' : 'text-gray-400'
                                  }`}>
                                    {ms.date}
                                  </span>
                                </>
                              )}
                            </div>

                            {ms.subtext && (
                              <p className={`text-xs mt-0.5 leading-relaxed ${
                                isPastOrCurrent ? 'text-gray-500' : 'text-gray-400'
                              }`}>
                                {ms.subtext}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Expandable detailed iThink location scans if available */}
                  {liveScans.length > 0 && (
                    <div className="pt-2 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => setShowDetailedScans(!showDetailedScans)}
                        className="w-full flex items-center justify-between text-xs font-semibold text-gray-600 hover:text-black py-1.5 px-2 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <span>
                          {showDetailedScans ? 'Hide' : 'View'} courier hub scan activity ({liveScans.length} scans)
                        </span>
                        {showDetailedScans ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {showDetailedScans && (
                        <div className="mt-2.5 space-y-2 bg-gray-50 p-3 rounded-xl border border-gray-200">
                          {liveScans.map((sc, i) => (
                            <div key={i} className="text-[11px] pb-2 last:pb-0 border-b last:border-0 border-gray-200">
                              <div className="flex items-center justify-between font-semibold text-gray-900">
                                <span>{sc.status || 'Courier Activity'}</span>
                                <span className="text-gray-500 font-normal">{formatDateTime(sc.timestamp)}</span>
                              </div>
                              {sc.location && (
                                <p className="text-gray-600 mt-0.5">📍 {sc.location}</p>
                              )}
                              {sc.remark && (
                                <p className="text-gray-500 italic mt-0.5">{sc.remark}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Order Details */}
          {activeTab === 'details' && (
            <div className="space-y-4 text-xs text-gray-700 animate-in fade-in duration-150">
              {/* Items List */}
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 space-y-2.5">
                <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-[#0e8a50]" />
                  Items in Shipment
                </h4>
                <div className="divide-y divide-gray-200">
                  {order.items?.map((it, idx) => (
                    <div key={idx} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {it.image ? (
                          <img src={it.image} alt={it.name} className="w-10 h-10 object-cover rounded-lg border border-gray-200" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-[#0e8a50] flex items-center justify-center font-bold text-base">
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

              {/* Delivery Address */}
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 space-y-1">
                <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#0e8a50]" />
                  Delivery Destination
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
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 space-y-1.5">
                <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-[#0e8a50]" />
                  Payment Summary
                </h4>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Payment Mode:</span>
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
                  <span className="font-bold text-gray-900">Total Amount:</span>
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
              <span>View full updates on {carrierName || 'Courier'} tracking portal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OrderTrackingModal;
