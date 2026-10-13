import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { CheckCircle, Package, Truck, Calendar, MapPin, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';
import { orderAPI } from '../services/api';
import { formatPrice } from '../utils/formatCurrency';

export const OrderConfirmationPage = () => {
  const { orderNumber } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);

  useEffect(() => {
    if (!order && orderNumber) {
      const fetchOrder = async () => {
        try {
          const res = await orderAPI.getOrderById(orderNumber);
          if (res.order) {
            setOrder(res.order);
          }
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchOrder();
    }
  }, [order, orderNumber]);

  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 4);
  const formattedDeliveryDate = estimatedDelivery.toLocaleDateString('en-IN', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  if (loading) {
    return (
      <div className="py-24 text-center min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="py-12 sm:py-20 bg-[#FAF6EF] min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Success Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-cream-200 shadow-card text-center space-y-4 mb-8">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle className="w-10 h-10" />
          </div>

          <span className="inline-block text-xs font-bold text-mustard-dark uppercase tracking-widest">
            Order Confirmed! धन्यवाद
          </span>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-charcoal font-serif">
            Thank You For Your Order!
          </h1>

          <p className="text-xs sm:text-sm text-earth-brown max-w-md mx-auto">
            Your handmade Rajasthani pickles are being prepared and carefully packed at our Jaipur kitchen.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <div className="bg-cream-100 px-4 py-2 rounded-xl text-xs font-semibold text-charcoal">
              Order Number: <strong className="text-brand-green font-bold">{order?.orderNumber || orderNumber}</strong>
            </div>
            <div className="bg-cream-100 px-4 py-2 rounded-xl text-xs font-semibold text-charcoal">
              Payment: <strong className="capitalize font-bold">{order?.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Paid Online (Razorpay)'}</strong>
            </div>
          </div>
        </div>

        {/* Order Details Receipt Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-card space-y-6 mb-8">
          
          {/* Estimated Delivery Notice */}
          <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 text-xs">
            <Calendar className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div>
              <p className="font-bold">Estimated Delivery: {formattedDeliveryDate}</p>
              <p className="text-emerald-700">We will notify you via SMS & WhatsApp when your parcel ships.</p>
            </div>
          </div>

          {/* Delivery Address */}
          <div>
            <h3 className="text-xs font-bold text-charcoal uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-brand-green" /> Delivery Destination:
            </h3>
            <div className="p-4 bg-cream-50 rounded-2xl text-xs text-earth-brown space-y-0.5">
              <p className="font-bold text-charcoal">{order?.customer?.name}</p>
              <p>{order?.shippingAddress?.addressLine1}</p>
              {order?.shippingAddress?.addressLine2 && <p>{order?.shippingAddress?.addressLine2}</p>}
              {order?.shippingAddress?.landmark && <p>Landmark: {order?.shippingAddress?.landmark}</p>}
              <p>
                {order?.shippingAddress?.city}, {order?.shippingAddress?.state} — {order?.shippingAddress?.pincode}
              </p>
              <p className="pt-1 font-semibold text-charcoal">Contact: {order?.customer?.phone} | {order?.customer?.email}</p>
            </div>
          </div>

          {/* Items Purchased List */}
          <div>
            <h3 className="text-xs font-bold text-charcoal uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Package className="w-4 h-4 text-brand-green" /> Items in Parcel:
            </h3>
            <div className="divide-y divide-cream-100 border border-cream-200 rounded-2xl overflow-hidden">
              {order?.items?.map((item, idx) => (
                <div key={idx} className="p-3.5 flex items-center justify-between text-xs bg-cream-50/50">
                  <div className="flex items-center gap-3">
                    {item.image && (
                      <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-lg border border-cream-200" />
                    )}
                    <div>
                      <p className="font-bold text-charcoal">{item.name}</p>
                      <p className="text-[11px] text-earth-brown">{item.weight} × {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-brand-green">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Summary Breakdown */}
          <div className="space-y-1.5 text-xs text-charcoal pt-3 border-t border-cream-200">
            <div className="flex justify-between">
              <span className="text-earth-brown">Subtotal:</span>
              <span className="font-semibold">{formatPrice(order?.subtotal || 0)}</span>
            </div>
            {order?.discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Discount ({order?.couponCode}):</span>
                <span>-{formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-earth-brown">Shipping:</span>
              <span className="font-bold text-brand-green">
                {order?.shippingFee === 0 ? 'FREE' : formatPrice(order?.shippingFee)}
              </span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-charcoal pt-2 border-t border-cream-200">
              <span>Total Amount:</span>
              <span className="text-brand-green">{formatPrice(order?.totalAmount || 0)}</span>
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/shop"
            className="bg-brand-green hover:bg-brand-green-light text-white text-xs font-bold px-8 py-3.5 rounded-xl shadow-xs transition-all text-center flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Continue Shopping Pickles</span>
          </Link>
          <Link
            to="/account"
            className="bg-white hover:bg-cream-100 text-charcoal border border-cream-300 text-xs font-bold px-8 py-3.5 rounded-xl transition-all text-center"
          >
            <span>View My Order History</span>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default OrderConfirmationPage;

