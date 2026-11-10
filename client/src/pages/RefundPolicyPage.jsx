import React from 'react';
import { Link } from 'react-router-dom';
import { RotateCcw, ShieldCheck, ArrowLeft, CheckCircle2, Clock, AlertTriangle, Phone, Mail, MapPin } from 'lucide-react';

export const RefundPolicyPage = () => {
  return (
    <div className="py-10 sm:py-16 bg-[#FAF6EF] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb & Navigation */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-green hover:underline mb-3"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>वापस होमपेज पर जाएं (Back to Home)</span>
          </Link>
          <div className="flex items-center gap-2 text-xs text-earth-brown">
            <Link to="/" className="hover:underline">Home</Link>
            <span>/</span>
            <span className="font-semibold text-charcoal">Return, Refund & Cancellation Policy</span>
          </div>
        </div>

        {/* Title Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-cream-200 shadow-card mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-cream-100 text-brand-green mb-4">
            <RotateCcw className="w-6 h-6 text-brand-green" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal font-serif">
            Return, Refund & Cancellation Policy (वापसी एवं रिफंड नीति)
          </h1>
          <p className="text-xs sm:text-sm text-earth-brown mt-2 leading-relaxed">
            अंतिम अपडेट (Last Updated): {new Date().toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
          <p className="text-xs sm:text-sm text-charcoal/80 mt-3 leading-relaxed">
            Customer satisfaction and absolute trust in our traditional homemade Rajasthani pickles are our highest priorities. We strive to provide transparent, hassle-free resolution for all orders placed on <strong>Singodia Foods</strong> (singodiafoodstore.in).
          </p>
        </div>

        {/* Content Body */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-cream-200 shadow-card space-y-8 text-xs sm:text-sm text-earth-brown leading-relaxed">
          
          {/* Section 1: Cancellation */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-charcoal font-serif flex items-center gap-2">
              <span className="text-brand-green">1.</span>
              <span>Order Cancellation (ऑर्डर रद्दीकरण)</span>
            </h2>
            <div className="space-y-2">
              <p>
                <strong>Before Dispatch (डिस्पैच होने से पहले):</strong> You may cancel your order at any time before it leaves our kitchen in Sujangarh (usually within 12 to 24 hours of placing the order). To cancel, simply WhatsApp or call our care desk at <a href="tel:+917597966707" className="text-brand-green font-bold hover:underline">+91 75979 66707</a> or email <a href="mailto:premsingodiya861@gmail.com" className="text-brand-green font-bold hover:underline">premsingodiya861@gmail.com</a> with your order number. A <strong>100% full refund</strong> will be initiated immediately.
              </p>
              <p>
                <strong>After Dispatch (डिस्पैच होने के बाद):</strong> Once the order has been handed over to the courier service and an AWB tracking number has been generated, it cannot be canceled in transit.
              </p>
            </div>
          </section>

          {/* Section 2: Returns on Food Items */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-charcoal font-serif flex items-center gap-2">
              <span className="text-brand-green">2.</span>
              <span>Returns Policy for Artisanal Food Items (खाद्य उत्पाद वापसी नीति)</span>
            </h2>
            <p>
              All pickles produced by Singodia Foods are perishable, preservative-free artisanal consumable food items.
            </p>
            <div className="p-3.5 bg-cream-50 border border-cream-200 rounded-xl text-xs space-y-1.5">
              <p className="font-semibold text-charcoal flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>खाद्य सुरक्षा एवं स्वच्छता नियम (FSSAI Food Safety Rules):</span>
              </p>
              <p>
                In strict adherence to food safety, hygiene, and health regulations, <strong>we cannot accept physical returns of jars that have been delivered and opened by the customer</strong>.
              </p>
            </div>
          </section>

          {/* Section 3: Damaged / Defective / Wrong Product Guarantee */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-charcoal font-serif flex items-center gap-2">
              <span className="text-brand-green">3.</span>
              <span>100% Replacement or Refund Guarantee (क्षतिग्रस्त या गलत सामान पर गारंटी)</span>
            </h2>
            <p>
              Even though we pack with high-grade induction seals and heavy-duty bubble cushions, courier mishaps can rarely occur. You are <strong>100% protected</strong> under the following conditions:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
              <li><strong>Transit Damage or Broken Jars:</strong> The outer parcel or inner jar arrives physically damaged or cracked.</li>
              <li><strong>Oil Leakage:</strong> Severe leakage occurred during courier transit.</li>
              <li><strong>Incorrect Product Sent:</strong> You received a pickle variety or jar weight different from what you ordered.</li>
              <li><strong>Missing Items:</strong> A jar or item from your combo pack was missing from the package.</li>
            </ul>

            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2 text-emerald-950">
              <div className="font-bold flex items-center gap-2 text-emerald-800 text-sm font-serif">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>How to Claim Free Replacement / Refund (दावा कैसे करें):</span>
              </div>
              <ol className="list-decimal pl-5 space-y-1.5 text-xs">
                <li>Take 1 or 2 clear photographs or a short video showing the damaged jar / parcel label within <strong>48 hours of delivery</strong>.</li>
                <li>Send them via WhatsApp to <a href="https://wa.me/917597966707" target="_blank" rel="noopener noreferrer" className="font-bold underline">+91 75979 66707</a> or email <a href="mailto:premsingodiya861@gmail.com" className="font-bold underline">premsingodiya861@gmail.com</a> along with your Order ID.</li>
                <li>Our team will verify the details within <strong>2 to 4 business hours</strong> and offer you your choice of:
                  <ul className="list-disc pl-4 mt-1 space-y-0.5 font-semibold text-emerald-900">
                    <li>A <strong>Free Instant Replacement</strong> dispatched on the same/next business day.</li>
                    <li>OR a <strong>100% Full Refund</strong> sent directly to your payment source.</li>
                  </ul>
                </li>
              </ol>
            </div>
          </section>

          {/* Section 4: Refund Process & Timelines */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-charcoal font-serif flex items-center gap-2">
              <span className="text-brand-green">4.</span>
              <span>Refund Timelines & Payment Mode (रिफंड मिलने की समय-सीमा)</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-cream-50 rounded-xl border border-cream-200 space-y-1">
                <span className="font-bold text-charcoal block">Prepaid Orders (ऑनलाइन भुगतान):</span>
                <p>Refunds are credited automatically to the original source account (UPI, Credit/Debit Card, Net Banking) via Razorpay within <strong>3 to 5 business days</strong>.</p>
              </div>
              <div className="p-3.5 bg-cream-50 rounded-xl border border-cream-200 space-y-1">
                <span className="font-bold text-charcoal block">Cash on Delivery (COD) Orders:</span>
                <p>For COD orders, our care desk will request your UPI ID (Google Pay, PhonePe, Paytm) or bank account details and transfer the refund within <strong>24 to 48 hours</strong>.</p>
              </div>
            </div>
          </section>

          {/* Section 5: Support Desk */}
          <section className="pt-4 border-t border-cream-200">
            <h3 className="text-sm font-bold text-charcoal font-serif mb-3">
              Customer Support & Grievance Contact (सहायता केंद्र):
            </h3>
            <div className="bg-cream-50/70 p-4 rounded-2xl border border-cream-200 space-y-2 text-xs">
              <p className="font-bold text-charcoal">Singodia Foods Care Desk</p>
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-brand-green flex-shrink-0" />
                <span>Prem Niwas, Bagreche Bass, Sujangarh, District Churu, Rajasthan – 331507</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-brand-green flex-shrink-0" />
                <a href="tel:+917597966707" className="text-brand-green font-semibold hover:underline">+91 75979 66707</a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-brand-green flex-shrink-0" />
                <a href="mailto:premsingodiya861@gmail.com" className="text-brand-green font-semibold hover:underline">premsingodiya861@gmail.com</a>
              </p>
              <p className="flex items-center gap-2 text-earth-brown">
                <Clock className="w-3.5 h-3.5 text-brand-green flex-shrink-0" />
                <span>सोमवार से शनिवार: प्रातः 9:00 बजे से सायं 8:00 बजे तक</span>
              </p>
            </div>
          </section>

        </div>

      </div>
    </div>
  );
};

export default RefundPolicyPage;
