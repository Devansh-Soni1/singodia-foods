import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, FileText, ArrowLeft, Mail, Phone, MapPin, Clock } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

export const TermsPage = () => {
  useSEO({
    title: 'Terms & Conditions (नियम एवं शर्तें) | Singodia Foods',
    description: 'Terms and conditions governing orders, payments, shipping, intellectual property, and jurisdiction on Singodia Foods (singodiafoodstore.in).',
    url: '/terms'
  });
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
            <span className="font-semibold text-charcoal">Terms & Conditions</span>
          </div>
        </div>

        {/* Title Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-cream-200 shadow-card mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-cream-100 text-brand-green mb-4">
            <FileText className="w-6 h-6 text-brand-green" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal font-serif">
            Terms & Conditions (नियम एवं शर्तें)
          </h1>
          <p className="text-xs sm:text-sm text-earth-brown mt-2 leading-relaxed">
            अंतिम अपडेट (Last Updated): {new Date().toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
          <p className="text-xs sm:text-sm text-charcoal/80 mt-3 leading-relaxed">
            Welcome to <strong>Singodia Foods</strong> (singodiafoodstore.in). By accessing our website, browsing our handcrafted pickle collection, or placing an order, you agree to comply with and be bound by the following terms and conditions. Please review them carefully.
          </p>
        </div>

        {/* Content Body */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-cream-200 shadow-card space-y-8 text-xs sm:text-sm text-earth-brown leading-relaxed">
          
          {/* Section 1 */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-charcoal font-serif flex items-center gap-2">
              <span className="text-brand-green">1.</span>
              <span>General Information & Ownership (सामान्य जानकारी)</span>
            </h2>
            <p>
              The platform <a href="https://singodiafoodstore.in" className="text-brand-green font-semibold hover:underline">singodiafoodstore.in</a> is owned and operated by <strong>Singodia Foods</strong>, having its artisanal manufacturing kitchen and registered operational address at <strong>Sujangarh, Rajasthan 331507, India</strong>.
            </p>
            <p>
              Throughout the site, the terms "we", "us", and "our" refer to Singodia Foods. Singodia Foods offers this website, including all information, tools, and services available from this site to you, the user, conditioned upon your acceptance of all terms, conditions, policies, and notices stated here.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-charcoal font-serif flex items-center gap-2">
              <span className="text-brand-green">2.</span>
              <span>Authentic Food Products & Preparation (खाद्य उत्पाद एवं तैयारी)</span>
            </h2>
            <p>
              All pickles, chutneys, and food preparations sold on this store are prepared strictly by hand using traditional recipes in our hygienic, FSSAI-compliant kitchen in Sujangarh, Rajasthan.
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
              <li>Our pickles are 100% natural and matured under natural sunlight in ceramic martabans (barnis).</li>
              <li>Because these are artisanal natural goods, slight natural variations in colour, oil texture, spice pungency, and seasonal tanginess are normal and represent genuine homemade quality.</li>
              <li>We do NOT use synthetic acetic acid, artificial food colourings, or chemical preservatives.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-charcoal font-serif flex items-center gap-2">
              <span className="text-brand-green">3.</span>
              <span>Pricing & Orders (मूल्य एवं ऑर्डर)</span>
            </h2>
            <p>
              All prices listed on the website are in <strong>Indian Rupees (INR ₹)</strong> and are inclusive of applicable goods and service taxes. We reserve the right to revise prices or discontinue products at any time without prior notice.
            </p>
            <p>
              An order confirmation email and SMS/WhatsApp alert will be automatically generated once your 100% online prepaid payment is successfully verified. Singodia Foods reserves the right to decline or cancel any order if there is an error in pricing, inventory unavailability, or unserviceable pincode.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-charcoal font-serif flex items-center gap-2">
              <span className="text-brand-green">4.</span>
              <span>100% Secure Prepaid Payments (सुरक्षित ऑनलाइन भुगतान)</span>
            </h2>
            <p>
              All orders are strictly 100% prepaid. Online transactions are securely processed via leading RBI-authorized and PCI-DSS compliant payment gateways (Razorpay, supporting UPI like Google Pay, PhonePe, Paytm, BHIM, Net Banking, and Debit/Credit Cards).
            </p>
            <p>
              <strong>Cash on Delivery (COD) is not offered or accepted anywhere on Singodia Foods.</strong>
            </p>
            <p>
              Singodia Foods does not store, record, or have access to your sensitive banking details, CVV, or card PINs. All financial communication is encrypted using 256-bit SSL protocols.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-charcoal font-serif flex items-center gap-2">
              <span className="text-brand-green">5.</span>
              <span>Shipping & Delivery (शिपिंग एवं डिलीवरी)</span>
            </h2>
            <p>
              We deliver pan-India to 26,000+ pin codes in partnership with reputed logistics services (including Blue Dart, Delhivery, DTDC, Xpressbees, and India Post). Orders are dispatched within 24 to 48 business hours from Sujangarh.
            </p>
            <p>
              Estimated delivery timeline is 2 to 5 business days for Rajasthan and major metropolitan cities, and 4 to 7 business days for other regional destinations. Please refer to our detailed <Link to="/shipping-policy" className="text-brand-green font-semibold hover:underline">Shipping & Delivery Policy</Link> for full details.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-charcoal font-serif flex items-center gap-2">
              <span className="text-brand-green">6.</span>
              <span>Cancellations, Returns & Replacements (कैंसलेशन एवं रिप्लेसमेंट नीति)</span>
            </h2>
            <p>
              Given that pickles are perishable artisanal consumable food items, opened or consumed jars cannot be returned for safety and hygiene reasons under FSSAI regulations. <strong>We maintain a strict No Cash Refund policy.</strong>
            </p>
            <p>
              <strong>Order Cancellation:</strong> Orders can ONLY be cancelled before dispatch by placing a direct phone call to <a href="tel:+917597966707" className="text-brand-green font-bold hover:underline">+91 75979 66707</a>. Once handed over to the courier (dispatched), an order cannot be cancelled.
            </p>
            <p>
              <strong>100% Free Replacement on Continuous Unboxing Video:</strong> If your order arrives damaged, leaking in transit, or if an incorrect item was delivered, we provide a <strong>100% Free Replacement (नया जar)</strong>. The customer must record a clear, continuous unboxing video while opening the parcel showing the shipping label and the damage, and share it with us via WhatsApp (<a href="https://wa.me/917597966707" className="text-brand-green font-bold hover:underline">+91 75979 66707</a>) within 48 hours of delivery. Please read our complete <Link to="/refund-policy" className="text-brand-green font-semibold hover:underline">Replacement & Cancellation Policy</Link>.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-charcoal font-serif flex items-center gap-2">
              <span className="text-brand-green">7.</span>
              <span>Intellectual Property (बौद्धिक संपदा)</span>
            </h2>
            <p>
              All content on this website, including product photographs, logos, brand titles ("Singodia Foods"), text, graphics, and culinary descriptions, are the intellectual property of Singodia Foods and are protected under Indian Copyright and Trademark laws. Unauthorized reproduction or commercial use is strictly prohibited.
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-charcoal font-serif flex items-center gap-2">
              <span className="text-brand-green">8.</span>
              <span>Governing Law & Legal Jurisdiction (कानूनी क्षेत्राधिकार)</span>
            </h2>
            <p>
              These Terms and Conditions and any agreements whereby we provide you goods shall be governed by and construed in accordance with the laws of <strong>India</strong>. Any legal dispute or claim arising out of these terms shall be subject exclusively to the competent courts of <strong>Sujangarh / Churu District, Rajasthan, India</strong>.
            </p>
          </section>

          {/* Grievance & Contact Section */}
          <section className="pt-4 border-t border-cream-200">
            <h3 className="text-sm font-bold text-charcoal font-serif mb-3">
              Grievance Officer & Customer Support (सहायता एवं संपर्क):
            </h3>
            <div className="bg-cream-50/70 p-4 rounded-2xl border border-cream-200 space-y-2 text-xs">
              <p className="font-bold text-charcoal">Singodia Foods Care Desk</p>
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-brand-green flex-shrink-0" />
                <span>Sujangarh, Rajasthan 331507</span>
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

export default TermsPage;

