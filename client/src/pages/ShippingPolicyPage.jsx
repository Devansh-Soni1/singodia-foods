import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Truck, 
  Package, 
  Clock, 
  ShieldCheck, 
  ArrowLeft, 
  MapPin, 
  AlertCircle, 
  Phone, 
  Mail, 
  Video, 
  CheckCircle2, 
  Scale, 
  CreditCard 
} from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

export const ShippingPolicyPage = () => {
  useSEO({
    title: 'Shipping & Delivery Policy (शिपिंग एवं डिलीवरी नीति) | Singodia Foods',
    description: 'Pan-India shipping across 26,000+ pincodes via iThink Logistics (Blue Dart, Delhivery, DTDC, Xpressbees). Direct dispatch from Sujangarh, Rajasthan within 24-48 business hours.',
    url: '/shipping-policy'
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
            <strong>Singodia Foods</strong> में हम अपने शुद्ध मारवाड़ी, धूप में पके पारंपरिक अचारों को पूरी स्वच्छता और मजबूत लीक-प्रूफ पैकेजिंग के साथ आपके घर तक सुरक्षित पहुंचाने के लिए प्रतिबद्ध हैं। हमारे सभी पार्सल सीधे हमारी मुख्य रसोई <strong>सुजानगढ़ (राजस्थान) 331507</strong> से तैयार होकर डिस्पैच होते हैं।
          </p>
        </div>

        {/* Content Body */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-cream-200 shadow-card space-y-8 text-xs sm:text-sm text-earth-brown leading-relaxed">
          
          {/* Section 1: Dispatch Origin & Coverage */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-charcoal font-serif flex items-center gap-2">
              <span className="text-brand-green">1.</span>
              <span>Dispatch Origin & Coverage (डिस्पैच केंद्र एवं कवरेज)</span>
            </h2>
            <p>
              हमारे सभी अचार पूर्णतः प्रामाणिक और ताजे होते हैं, जिन्हें सीधे हमारी सुजानगढ़, राजस्थान स्थित रसोई से पैक करके भेजा जाता है।
            </p>
            <p>
              हम भारत के सभी राज्यों और केंद्र शासित प्रदेशों में <strong>26,000+ से अधिक पिनकोड्स</strong> पर प्रमुख प्रीमियम लॉजिस्टिक्स पार्टनर्स (Blue Dart, Delhivery, DTDC, Xpressbees, और India Post) के माध्यम से सुरक्षित डिलीवरी उपलब्ध कराते हैं।
            </p>
          </section>

          {/* Section 2: Shipping Charges & Calculation */}
          <section className="space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-charcoal font-serif flex items-center gap-2">
              <span className="text-brand-green">2.</span>
              <span>Delivery Charges & Calculation (डिलीवरी शुल्क एवं गणना नियम)</span>
            </h2>
            <p>
              सिंगोदिया फूड्स में डिलीवरी शुल्क की गणना पूरी तरह पारदर्शी है। डिलीवरी शुल्क ग्राहक के <strong>पिनकोड (दूरी ज़ोन)</strong> और ऑर्डर के <strong>कुल पार्सल वजन (Weight)</strong> के आधार पर लॉजिस्टिक्स एग्रीगेटर (iThink Logistics) के वास्तविक लाइव रेट्स के अनुसार तय होता है:
            </p>

            {/* Delivery Rates Table */}
            <div className="overflow-x-auto rounded-2xl border border-cream-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-cream-100/70 text-charcoal font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="p-3.5">Destination Zone (स्थान)</th>
                    <th className="p-3.5">Base Rate (0.5 kg तक)</th>
                    <th className="p-3.5">Estimated Transit Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-200 bg-white">
                  <tr>
                    <td className="p-3.5 font-semibold text-charcoal">
                      <span className="block font-bold">Zone A: स्थानीय (Sujangarh / Churu)</span>
                      <span className="text-[11px] text-earth-brown">पिनकोड 331xxx क्षेत्र</span>
                    </td>
                    <td className="p-3.5 text-brand-green font-bold text-sm">₹40</td>
                    <td className="p-3.5 text-charcoal font-medium">1 - 2 Business Days</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-semibold text-charcoal">
                      <span className="block font-bold">Zone B: राजस्थान राज्य (Intra-State)</span>
                      <span className="text-[11px] text-earth-brown">जयपुर, जोधपुर, उदयपुर, बीकानेर आदि</span>
                    </td>
                    <td className="p-3.5 text-brand-green font-bold text-sm">₹50</td>
                    <td className="p-3.5 text-charcoal font-medium">2 - 3 Business Days</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-semibold text-charcoal">
                      <span className="block font-bold">Zone C: उत्तर भारत एवं प्रमुख मेट्रो शहर</span>
                      <span className="text-[11px] text-earth-brown">दिल्ली NCR, हरियाणा, पंजाब, गुजरात, मुंबई</span>
                    </td>
                    <td className="p-3.5 text-brand-green font-bold text-sm">₹65</td>
                    <td className="p-3.5 text-charcoal font-medium">3 - 4 Business Days</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-semibold text-charcoal">
                      <span className="block font-bold">Zone D & E: शेष भारत एवं दूरस्थ क्षेत्र</span>
                      <span className="text-[11px] text-earth-brown">दक्षिण भारत, पूर्वोत्तर (NE), जम्मू-कश्मीर आदि</span>
                    </td>
                    <td className="p-3.5 text-brand-green font-bold text-sm">₹75 – ₹95</td>
                    <td className="p-3.5 text-charcoal font-medium">4 - 6 Business Days</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Key Delivery Policies Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-2xl bg-cream-50 border border-cream-200 space-y-1">
                <span className="font-bold text-charcoal flex items-center gap-1.5 text-xs">
                  <Scale className="w-4 h-4 text-brand-green shrink-0" />
                  वजन के आधार पर शुल्क (Weight Increments)
                </span>
                <p className="text-[11px] text-earth-brown">
                  0.5 kg से अधिक वजन होने पर (जैसे 1 kg, 1.5 kg, 2 kg) कूरियर पार्टनर के नियमानुसार प्रति 500 ग्राम का न्यूनतम शुल्क जुड़ता है। प्रोडक्ट पेज और चेकआउट पर पिनकोड दर्ज करने पर आपको तुरंत वास्तविक डिलीवरी चार्ज दिख जाता है।
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-1">
                <span className="font-bold text-emerald-900 flex items-center gap-1.5 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  मुफ्त डिलीवरी (Free Delivery Option)
                </span>
                <p className="text-[11px] text-emerald-950">
                  जब स्टोर पर विशेष प्रमोशन या फ्री डिलीवरी ऑफर सक्रिय होता है, तो निर्धारित न्यूनतम ऑर्डर राशि पूरी होने पर डिलीवरी शुल्क स्वतः शून्य (₹0 - FREE) हो जाता है।
                </p>
              </div>
            </div>

            <p className="text-[11px] text-earth-brown">
              * <strong>नो हिडन चार्ज:</strong> चेकआउट पर जो शुल्क दिखता है वही अंतिम होता है। कोई भी गुप्त हैंडलिंग फीस, पैकिंग फीस या अतिरिक्त टैक्स नहीं लिया जाता।
            </p>
          </section>

          {/* Section 3: Payment Policy */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-charcoal font-serif flex items-center gap-2">
              <span className="text-brand-green">3.</span>
              <span>Payment Policy: 100% Secure Online Payment (ऑनलाइन भुगतान)</span>
            </h2>
            <p>
              खाद्य सुरक्षा, हाइजीन और तेज़ डिलीवरी सुनिश्चित करने के लिए हमारी वेबसाइट पर <strong>केवल 100% सुरक्षित ऑनलाइन भुगतान (Prepaid)</strong> ही स्वीकार किया जाता है:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
              <li><strong>स्वीकृत माध्यम:</strong> UPI (Google Pay, PhonePe, Paytm, BHIM), सभी प्रमुख डेबिट/क्रेडिट कार्ड और नेट बैंकिंग (Razorpay पेमेंट गेटवे द्वारा सुरक्षित)।</li>
              <li><strong>कैश ऑन डिलीवरी (COD) उपलब्ध नहीं है:</strong> अचार एक संवेदनशील खाद्य उत्पाद है, जिसे ताजा बनाकर कूरियर से भेजा जाता है। इसलिए पूरी वेबसाइट पर COD की सुविधा बंद रखी गई है।</li>
            </ul>
          </section>

          {/* Section 4: Leak-Proof Packaging */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-charcoal font-serif flex items-center gap-2">
              <span className="text-brand-green">4.</span>
              <span>Leak-Proof 3-Layer Packaging (लीक-प्रूफ सुरक्षा पैकेजिंग)</span>
            </h2>
            <p>
              पारंपरिक मारवाड़ी अचार में शुद्ध सरसों का तेल और मसाले होते हैं। सफर के दौरान तेल का रिसाव न हो, इसके लिए हम विशेष 3-स्तरीय पैकेजिंग करते हैं:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-3.5 rounded-xl bg-cream-50 border border-cream-200">
                <span className="font-bold text-charcoal block mb-1 text-xs">1. इंडक्शन सील (Airtight)</span>
                <p className="text-[11px] text-earth-brown">जार के मुंह पर हीट-इंडक्शन एल्युमिनियम फॉयल सील लगाई जाती है ताकि तेल की एक बूंद भी बाहर न निकले।</p>
              </div>
              <div className="p-3.5 rounded-xl bg-cream-50 border border-cream-200">
                <span className="font-bold text-charcoal block mb-1 text-xs">2. शॉक-प्रूफ बबल रैप</span>
                <p className="text-[11px] text-earth-brown">जार को मोटे मल्टी-लेयर बबल रैप से सुरक्षित किया जाता है ताकि किसी भी तरह के झटके से जार सुरक्षित रहे।</p>
              </div>
              <div className="p-3.5 rounded-xl bg-cream-50 border border-cream-200">
                <span className="font-bold text-charcoal block mb-1 text-xs">3. 5-प्लाई मास्टर कार्टन</span>
                <p className="text-[11px] text-earth-brown">मजबूत 5-प्लाई आउटर बॉक्स जिस पर 'Handle With Care / Fragile' का विशेष सुरक्षा लेबल लगा होता है।</p>
              </div>
            </div>
          </section>

          {/* Section 5: Order Tracking */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-charcoal font-serif flex items-center gap-2">
              <span className="text-brand-green">5.</span>
              <span>Live Order Tracking (लाइव ऑर्डर ट्रैकिंग)</span>
            </h2>
            <p>
              जैसे ही आपका पार्सल सुजानगढ़ से कूरियर कंपनी को सौंपा जाता है, आपको SMS और WhatsApp/ईमेल पर ट्रैकिंग विवरण भेजा जाता है जिसमें शामिल होता है:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
              <li>कूरियर पार्टनर का नाम (जैसे Blue Dart, Delhivery, DTDC, Xpressbees)</li>
              <li>यूनिक AWB / Waybill ट्रैकिंग नंबर</li>
              <li>सीधा लाइव ट्रैकिंग लिंक</li>
            </ul>
            <p>
              इसके अलावा आप अपनी वेबसाइट के <Link to="/account?tab=orders" className="text-brand-green font-semibold hover:underline">My Orders डैशबोर्ड</Link> से भी 24x7 कभी भी पार्सल की लाइव स्थिति देख सकते हैं।
            </p>
          </section>

          {/* Section 6: Cancellation Policy Before Dispatch */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-charcoal font-serif flex items-center gap-2">
              <span className="text-brand-green">6.</span>
              <span>Order Cancellation (ऑर्डर कैंसलेशन नीति)</span>
            </h2>
            <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-2xl text-blue-950 text-xs space-y-1.5">
              <p className="font-bold flex items-center gap-1.5 text-blue-900">
                <Phone className="w-4 h-4 text-blue-700 shrink-0" />
                डिस्पैच से पहले केवल कॉल द्वारा कैंसलेशन:
              </p>
              <p>
                यदि आप अपना ऑर्डर कैंसिल करना चाहते हैं, तो कृपया पार्सल सुजानगढ़ से <strong>डिस्पैच होने से पहले</strong> हमारे कस्टमर केयर नंबर <a href="tel:+917597966707" className="font-bold underline">+91 75979 66707</a> पर सीधे कॉल करें।
              </p>
              <p className="text-[11px] text-blue-800">
                * एक बार पार्सल कूरियर पार्टनर को हैंडओवर होने के बाद उसे रास्ते में कैंसिल नहीं किया जा सकता।
              </p>
            </div>
          </section>

          {/* Section 7: Transit Damage & Free Replacement */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-charcoal font-serif flex items-center gap-2">
              <span className="text-brand-green">7.</span>
              <span>Damaged in Transit? 100% Free Replacement (पार्सल क्षति पर निशुल्क रिप्लेसमेंट)</span>
            </h2>
            <p>
              खाद्य सुरक्षा नियमों (FSSAI norms) के अनुसार हमारे यहाँ <strong>कैश रिफंड (पैसा वापसी) की सुविधा नहीं है</strong>। यदि बहुत ही दुर्लभ मामले में पार्सल रास्ते में टूट जाता है या तेल का रिसाव होता है, तो हम <strong>100% फ्री रिप्लेसमेंट (नया पार्सल)</strong> भेजते हैं।
            </p>

            <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl text-amber-950 text-xs space-y-2">
              <p className="font-bold text-amber-900 flex items-center gap-1.5 text-sm">
                <Video className="w-4 h-4 text-amber-700 shrink-0" />
                अनबॉक्सिंग वीडियो नियम (Mandatory Continuous Unboxing Video):
              </p>
              <p>
                पार्सल की क्षति या लीकेज की स्थिति में रिप्लेसमेंट क्लेम करने के लिए:
              </p>
              <ol className="list-decimal pl-5 space-y-1 text-xs">
                <li>पार्सल की डिलीवरी मिलने के बाद, बॉक्स को खोलते समय की <strong>एक बिना कट/पॉज वाली स्पष्ट वीडियो (Unboxing Video)</strong> बनाएं।</li>
                <li>वीडियो में पार्सल पर लगा शिपिंग लेबल (आपका नाम व ट्रैकिंग नंबर) और अंदर की खराबी/डैमेज साफ दिखनी चाहिए।</li>
                <li>डिलीवरी के 48 घंटे के भीतर यह वीडियो हमारे WhatsApp नंबर <a href="https://wa.me/917597966707" target="_blank" rel="noopener noreferrer" className="font-bold underline text-brand-green">+91 75979 66707</a> पर भेजें।</li>
              </ol>
              <p className="font-semibold text-amber-900 pt-1">
                हमारी टीम वीडियो की समीक्षा करके बिना किसी भी अतिरिक्त शुल्क के आपके पते पर तुरंत नया फ्रेश पार्सल डिस्पैच कर देगी।
              </p>
            </div>
          </section>

          {/* Help Contact */}
          <section className="pt-4 border-t border-cream-200">
            <h3 className="text-sm font-bold text-charcoal font-serif mb-2 flex items-center gap-2">
              <Phone className="w-4 h-4 text-brand-green" />
              <span>Shipping & Delivery Support Desk (शिपिंग सहायता):</span>
            </h3>
            <p className="text-xs text-earth-brown">
              डिलीवरी, ट्रैकिंग या पते से संबंधित किसी भी सहायता के लिए आप हमें सीधे कॉल या WhatsApp कर सकते हैं:
            </p>
            <div className="mt-2 flex flex-wrap gap-4 text-xs font-bold text-charcoal">
              <a href="tel:+917597966707" className="hover:text-brand-green flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-brand-green" />
                <span>+91 75979 66707</span>
              </a>
              <a href="mailto:premsingodiya861@gmail.com" className="hover:text-brand-green flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-brand-green" />
                <span>premsingodiya861@gmail.com</span>
              </a>
              <span className="text-earth-brown font-normal flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>सोमवार से शनिवार (9:00 AM – 8:00 PM IST)</span>
              </span>
            </div>
          </section>

        </div>

      </div>
    </div>
  );
};

export default ShippingPolicyPage;
