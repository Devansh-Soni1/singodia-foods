import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, Package, Clock, ShieldCheck, ArrowLeft, MapPin, AlertCircle, Phone, Mail } from 'lucide-react';

export const ShippingPolicyPage = () => {
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
            <span className="font-semibold text-charcoal">Shipping & Delivery Policy</span>
          </div>
        </div>

        {/* Title Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-cream-200 shadow-card mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-cream-100 text-brand-green mb-4">
            <Truck className="w-6 h-6 text-brand-green" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal font-serif">
            Shipping & Delivery Policy (शिपिंग एवं डिलीवरी नीति)
          </h1>
          <p className="text-xs sm:text-sm text-earth-brown mt-2 leading-relaxed">
            अंतिम अपडेट (Last Updated): {new Date().toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
          <p className="text-xs sm:text-sm text-charcoal/80 mt-3 leading-relaxed">
            At <strong>Singodia Foods</strong>, we take utmost care in delivering our freshly prepared, sun-aged Rajasthani pickles to your doorstep safely, securely, and without any leakage or transit damage.
          </p>
        </div>

        {/* Content Body */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-cream-200 shadow-card space-y-8 text-xs sm:text-sm text-earth-brown leading-relaxed">
          
          {/* Section 1 */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-charcoal font-serif flex items-center gap-2">
              <span className="text-brand-green">1.</span>
              <span>Dispatch Origin & Coverage (डिस्पैच केंद्र एवं कवरेज)</span>
            </h2>
            <p>
              All orders are prepared and freshly dispatched directly from our traditional artisan kitchen located at <strong>Prem Niwas, Bagreche Bass, Sujangarh, District Churu, Rajasthan – 331507</strong>.
            </p>
            <p>
              We deliver across India covering over <strong>26,000+ postal PIN codes</strong> in all States and Union Territories through tier-1 courier networks (including Blue Dart, Delhivery, DTDC, Xpressbees, and India Post Speed Post).
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-charcoal font-serif flex items-center gap-2">
              <span className="text-brand-green">2.</span>
              <span>Estimated Delivery Timelines (डिलीवरी में लगने वाला समय)</span>
            </h2>
            <p>
              Orders are packaged and dispatched within <strong>24 to 48 business hours</strong> of receipt (excluding Sundays and national holidays).
            </p>
            
            {/* Timeline Table */}
            <div className="overflow-x-auto rounded-2xl border border-cream-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-cream-100/70 text-charcoal font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="p-3.5">Destination Region (स्थान)</th>
                    <th className="p-3.5">Estimated Transit Time</th>
                    <th className="p-3.5">Typical Courier Partner</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-200 bg-white">
                  <tr>
                    <td className="p-3.5 font-semibold text-charcoal">Rajasthan (Local / State)</td>
                    <td className="p-3.5 text-brand-green font-bold">2 - 3 Business Days</td>
                    <td className="p-3.5">Blue Dart / Delhivery Surface</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-semibold text-charcoal">Delhi NCR, Haryana, Punjab, Gujarat</td>
                    <td className="p-3.5 text-brand-green font-bold">3 - 4 Business Days</td>
                    <td className="p-3.5">Blue Dart / Xpressbees Air/Surface</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-semibold text-charcoal">Metro Cities (Mumbai, Bengaluru, Hyderabad, Kolkata, Chennai)</td>
                    <td className="p-3.5 text-brand-green font-bold">4 - 5 Business Days</td>
                    <td className="p-3.5">Delhivery / Blue Dart Express</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-semibold text-charcoal">Rest of India & Remote Locations</td>
                    <td className="p-3.5 text-brand-green font-bold">5 - 7 Business Days</td>
                    <td className="p-3.5">Delhivery / India Post Speed Post</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-earth-brown italic">
              * Note: Delivery timelines may experience minor delays during extreme weather conditions, festive peak seasons (Diwali, Holi), or local administrative restrictions.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-charcoal font-serif flex items-center gap-2">
              <span className="text-brand-green">3.</span>
              <span>Shipping Charges (शिपिंग शुल्क)</span>
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
              <li><strong>Free Shipping:</strong> On all orders above the qualifying threshold (e.g. ₹399 / ₹499 as shown live at checkout).</li>
              <li><strong>Standard Delivery Charge:</strong> A nominal flat fee of ₹60 is applied on orders below the free delivery minimum to cover safe transit packaging.</li>
              <li>There are zero hidden packaging or convenience surcharges at checkout.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-charcoal font-serif flex items-center gap-2">
              <span className="text-brand-green">4.</span>
              <span>Leak-Proof Food Grade Packaging (सुरक्षित एवं लीक-प्रूफ पैकिंग)</span>
            </h2>
            <p>
              Traditional Indian pickles contain rich mustard oil and sun-cured spices that require specialized packaging for courier transit:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-cream-50 border border-cream-200">
                <span className="font-bold text-charcoal block mb-1">1. Induction Sealed</span>
                <p className="text-[11px]">Food-grade airtight induction inner seal prevents any oil seepage during air or road travel.</p>
              </div>
              <div className="p-3 rounded-xl bg-cream-50 border border-cream-200">
                <span className="font-bold text-charcoal block mb-1">2. Cushion Wrap</span>
                <p className="text-[11px]">Multi-layer shock-absorbent protective bubble wrap cushions against drops and vibrations.</p>
              </div>
              <div className="p-3 rounded-xl bg-cream-50 border border-cream-200">
                <span className="font-bold text-charcoal block mb-1">3. Heavy Corrugated Box</span>
                <p className="text-[11px]">Sturdy 5-ply corrugated outer master cartons labeled with 'Handle with Care' fragile stickers.</p>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-charcoal font-serif flex items-center gap-2">
              <span className="text-brand-green">5.</span>
              <span>Order Tracking (लाइव ऑर्डर ट्रैकिंग)</span>
            </h2>
            <p>
              As soon as your parcel is handed over to our courier partner in Sujangarh, you will receive an automatic dispatch notification containing:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
              <li>Courier partner name (e.g. Blue Dart, Delhivery)</li>
              <li>Unique AWB / Waybill tracking number</li>
              <li>Direct live tracking web link</li>
            </ul>
            <p>
              You can also track your order anytime directly from your <Link to="/account?tab=orders" className="text-brand-green font-semibold hover:underline">Singodia Foods Account Dashboard</Link>.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-charcoal font-serif flex items-center gap-2">
              <span className="text-brand-green">6.</span>
              <span>Damaged in Transit? 100% Free Replacement (पार्सल क्षति गारंटी)</span>
            </h2>
            <p>
              In the extremely rare event that your package arrives damaged, broken, or severely leaking:
            </p>
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs font-medium space-y-1">
              <p className="font-bold">सरल रिप्लेसमेंट प्रक्रिया (Simple 2-Step Guarantee):</p>
              <p>1. डिलीवरी मिलने के 48 घंटे के भीतर क्षतिग्रस्त पार्सल की 1-2 तस्वीरें/वीडियो लें।</p>
              <p>2. हमारे WhatsApp नंबर <a href="https://wa.me/917597966707" target="_blank" rel="noopener noreferrer" className="underline font-bold">+91 75979 66707</a> या ईमेल <a href="mailto:premsingodiya861@gmail.com" className="underline font-bold">premsingodiya861@gmail.com</a> पर भेजें।</p>
              <p>हमारी टीम बिना किसी अतिरिक्त शुल्क के तुरंत नया फ्रेश पार्सल डिस्पैच करेगी या पूरा रिफंड जारी करेगी।</p>
            </div>
          </section>

          {/* Help Contact */}
          <section className="pt-4 border-t border-cream-200">
            <h3 className="text-sm font-bold text-charcoal font-serif mb-2">
              Shipping Support Desk (शिपिंग सहायता):
            </h3>
            <p className="text-xs">
              For any delivery inquiries, address updates, or urgent dispatch requests, please call or WhatsApp us directly at <a href="tel:+917597966707" className="text-brand-green font-bold hover:underline">+91 75979 66707</a> (9:00 AM – 8:00 PM IST).
            </p>
          </section>

        </div>

      </div>
    </div>
  );
};

export default ShippingPolicyPage;

