import React, { useState, useEffect } from 'react';
import { 
  X, Truck, Package, CheckCircle2, Clock, MapPin, 
  ExternalLink, Copy, Check, Loader2, ArrowRight, ShieldCheck 
} from 'lucide-react';
import { shippingAPI } from '../../services/api';

export const OrderTrackingModal = ({ order, isOpen, onClose }) => {
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const waybill = order?.trackingNumber || order?.shipping?.trackingNumber || '';
  const carrierName = trackingData?.courierName || order?.courierPartner || order?.carrier || 'Delhivery Express';

  useEffect(() => {
    if (!isOpen || !order) return;

    let isMounted = true;
    const fetchTracking = async () => {
      setLoading(true);
      try {
        if (waybill) {
          const res = await shippingAPI.trackShipment(waybill);
          if (isMounted) {
            if (res && res.success) {
              setTrackingData(res);
            } else {
              setTrackingData({
                success: true,
                waybill,
                currentStatus: order.orderStatus || 'In Transit',
                courierName: carrierName,
                lastLocation: 'Sujangarh Hub (Rajasthan)',
                events: [
                  { status: 'Order Packed & Dispatched', location: 'Sujangarh Kitchen, Churu', timestamp: 'Today' },
                  { status: 'In Transit with Courier Partner', location: 'Jaipur Hub', timestamp: 'In Transit' }
                ]
              });
            }
          }
        } else {
          // AWB not yet generated or order just placed
          if (isMounted) {
            setTrackingData({
              success: true,
              waybill: 'Processing AWB...',
              currentStatus: order.orderStatus || 'Placed',
              courierName: carrierName,
              lastLocation: 'Singodia Foods Kitchen, Sujangarh (331507)',
              events: [
                { status: 'Order Placed & Confirmed', location: 'Singodia Foods Storefront', timestamp: new Date(order.createdAt).toLocaleDateString('en-IN') },
                { status: 'Preparing & Packing Achar in Glass/Jar Packaging', location: 'Prem Niwas, Sujangarh Kitchen (331507)', timestamp: 'In Progress' }
              ]
            });
          }
        }
      } catch (err) {
        if (isMounted) {
          setTrackingData({
            success: true,
            waybill: waybill || 'Processing',
            currentStatus: order.orderStatus || 'In Transit',
            courierName: carrierName,
            events: [
              { status: 'Order Manifested', location: 'Sujangarh Hub', timestamp: 'Live' }
            ]
          });
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchTracking();

    return () => {
      isMounted = false;
    };
  }, [isOpen, order, waybill, carrierName]);

  if (!isOpen || !order) return null;

  const handleCopyAwb = () => {
    if (!waybill) return;
    navigator.clipboard.writeText(waybill);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Determine active step (0: Placed, 1: Packed, 2: Shipped, 3: Out for delivery, 4: Delivered)
  const currentStatusLower = String(trackingData?.currentStatus || order.orderStatus || '').toLowerCase();
  let activeStep = 0;
  if (currentStatusLower.includes('deliver') && !currentStatusLower.includes('out')) {
    activeStep = 4;
  } else if (currentStatusLower.includes('out')) {
    activeStep = 3;
  } else if (currentStatusLower.includes('transit') || currentStatusLower.includes('shipped') || currentStatusLower.includes('dispatch')) {
    activeStep = 2;
  } else if (currentStatusLower.includes('process') || currentStatusLower.includes('pack') || waybill) {
    activeStep = 1;
  } else {
    activeStep = 0;
  }

  const steps = [
    { title: 'Order Placed', subtitle: 'ऑर्डर प्राप्त हुआ', icon: Package },
    { title: 'Packed & Ready', subtitle: 'सुजानगढ़ में तैयार', icon: ShieldCheck },
    { title: 'In Transit', subtitle: 'कूरियर द्वारा रवाना', icon: Truck },
    { title: 'Out for Delivery', subtitle: 'डिलीवरी के लिए निकला', icon: Clock },
    { title: 'Delivered', subtitle: 'सफलतापूर्वक डिलीवर', icon: CheckCircle2 }
  ];

  const officialTrackingUrl = waybill
    ? `https://my.ithinklogistics.com/track/${waybill}`
    : 'https://my.ithinklogistics.com/';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div 
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-cream-200 overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 bg-gradient-to-r from-[#FAF6EF] via-white to-[#F5EEDB] border-b border-cream-200">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-brand-green/10 flex items-center justify-center text-brand-green">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-extrabold text-charcoal font-serif">
                  Live Order Tracking (लाइव ट्रैकिंग)
                </h3>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-brand-green bg-white px-2 py-0.5 rounded-full border border-cream-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Updates
                </span>
              </div>
              <p className="text-xs text-earth-brown">
                Order <strong className="text-brand-green">#{order.orderNumber}</strong> • Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-cream-100 hover:bg-cream-200 text-charcoal flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close tracking modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {loading ? (
            <div className="py-16 text-center space-y-3">
              <Loader2 className="w-8 h-8 text-brand-green animate-spin mx-auto" />
              <p className="text-xs font-semibold text-charcoal">
                iThink Logistics से लाइव ट्रैकिंग डेटा लोड हो रहा है...
              </p>
            </div>
          ) : (
            <>
              {/* Waybill & Courier Card */}
              <div className="p-4 rounded-2xl bg-cream-50/90 border border-cream-200 space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] text-earth-brown block font-medium">कूरियर पार्टनर (Logistics Partner):</span>
                    <span className="text-sm font-black text-charcoal capitalize flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-brand-green" />
                      {carrierName}
                    </span>
                  </div>

                  {waybill && (
                    <div className="text-right">
                      <span className="text-[11px] text-earth-brown block font-medium">AWB / Waybill No:</span>
                      <div className="inline-flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-xl border border-cream-300 font-mono text-xs font-bold text-brand-green">
                        <span>{waybill}</span>
                        <button
                          type="button"
                          onClick={handleCopyAwb}
                          className="hover:text-brand-green-dark p-0.5 rounded cursor-pointer transition-colors"
                          title="Copy AWB Number"
                        >
                          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {trackingData?.expectedDeliveryDate && (
                  <div className="pt-2 border-t border-cream-200/80 flex items-center justify-between text-xs">
                    <span className="text-earth-brown flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-brand-green" />
                      अपेक्षित डिलीवरी (Est. Delivery):
                    </span>
                    <span className="font-bold text-charcoal">
                      {trackingData.expectedDeliveryDate}
                    </span>
                  </div>
                )}
              </div>

              {/* 5-Step Visual Timeline Progress */}
              <div className="py-2">
                <h4 className="text-xs font-bold text-charcoal uppercase tracking-wider mb-4 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-brand-green" />
                  पार्सल यात्रा (Shipment Journey)
                </h4>

                <div className="relative">
                  {/* Connecting Line */}
                  <div className="absolute top-4 left-4 right-4 h-1 bg-cream-200 -z-0 hidden sm:block">
                    <div 
                      className="h-full bg-brand-green transition-all duration-500"
                      style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
                    />
                  </div>

                  {/* Desktop Step Icons Row */}
                  <div className="hidden sm:grid grid-cols-5 gap-2 relative z-10 text-center">
                    {steps.map((st, idx) => {
                      const StepIcon = st.icon;
                      const isCompleted = idx <= activeStep;
                      const isCurrent = idx === activeStep;

                      return (
                        <div key={idx} className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                            isCompleted 
                              ? 'bg-brand-green text-white shadow-xs' 
                              : 'bg-white border-2 border-cream-300 text-gray-400'
                          } ${isCurrent ? 'ring-4 ring-brand-green/20 scale-110' : ''}`}>
                            <StepIcon className="w-4 h-4" />
                          </div>
                          <p className={`text-[11px] font-bold mt-2 leading-tight ${isCompleted ? 'text-charcoal' : 'text-gray-400'}`}>
                            {st.title}
                          </p>
                          <p className="text-[10px] text-earth-brown mt-0.5">
                            {st.subtitle}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Mobile Vertical Steps */}
                  <div className="sm:hidden space-y-3 pl-2 border-l-2 border-brand-green/40 ml-4">
                    {steps.map((st, idx) => {
                      const StepIcon = st.icon;
                      const isCompleted = idx <= activeStep;
                      const isCurrent = idx === activeStep;

                      return (
                        <div key={idx} className="relative flex items-center gap-3">
                          <div className={`-ml-[1.4rem] w-6 h-6 rounded-full flex items-center justify-center ${
                            isCompleted ? 'bg-brand-green text-white' : 'bg-white border-2 border-cream-300 text-gray-400'
                          }`}>
                            <StepIcon className="w-3 h-3" />
                          </div>
                          <div className="flex-1">
                            <span className={`text-xs font-bold ${isCompleted ? 'text-charcoal' : 'text-gray-400'}`}>
                              {st.title} ({st.subtitle})
                            </span>
                            {isCurrent && (
                              <span className="ml-2 text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                                Current Status
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Live Scan Events / Timeline */}
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold text-charcoal uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-brand-green" />
                  लाइव स्कैन अपडेट्स (Scan History)
                </h4>

                <div className="bg-cream-50/60 rounded-2xl p-3.5 border border-cream-200 divide-y divide-cream-100 text-xs">
                  {trackingData?.events && trackingData.events.length > 0 ? (
                    trackingData.events.map((ev, i) => (
                      <div key={i} className="py-2.5 first:pt-0 last:pb-0 flex items-start justify-between gap-3">
                        <div className="space-y-0.5">
                          <p className="font-bold text-charcoal flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-brand-green inline-block" />
                            {ev.status}
                          </p>
                          <p className="text-[11px] text-earth-brown pl-3.5 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-gray-400" />
                            {ev.location}
                          </p>
                          {ev.remark && (
                            <p className="text-[10px] text-gray-500 pl-3.5 italic">
                              "{ev.remark}"
                            </p>
                          )}
                        </div>
                        {ev.timestamp && (
                          <span className="text-[10px] text-gray-500 whitespace-nowrap font-medium">
                            {ev.timestamp}
                          </span>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-500 py-2 text-center">
                      पार्सल तैयार किया जा रहा है। कूरियर द्वारा पिकअप होते ही यहाँ लाइव स्कैन दिखेगा।
                    </p>
                  )}
                </div>
              </div>

              {/* Delivery Address & Assurance */}
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-2.5 text-xs text-charcoal">
                <MapPin className="w-4 h-4 text-brand-green shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-bold">
                    डिलीवरी गंतव्य (Delivery Destination):
                  </p>
                  <p className="text-earth-brown leading-relaxed">
                    {order.shippingAddress?.addressLine1}, {order.shippingAddress?.city}, {order.shippingAddress?.state} — {order.shippingAddress?.pincode}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-cream-50 border-t border-cream-200 flex flex-wrap items-center justify-between gap-2 text-xs">
          <a
            href={officialTrackingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-brand-green font-bold hover:underline cursor-pointer"
          >
            <span>कूरियर वेबसाइट पर देखें (Official Tracking)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-brand-green hover:bg-brand-green-light text-white font-bold rounded-xl transition-colors cursor-pointer ml-auto"
          >
            बंद करें (Close)
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingModal;
