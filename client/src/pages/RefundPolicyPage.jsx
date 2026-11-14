import React from 'react';
import { Link } from 'react-router-dom';
import { 
  RotateCcw, 
  ShieldCheck, 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Phone, 
  Mail, 
  MapPin, 
  Video, 
  Ban, 
  CreditCard 
} from 'lucide-react';

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
            <span className="font-semibold text-charcoal">Replacement & Cancellation Policy</span>
          </div>
        </div>

        {/* Title Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-cream-200 shadow-card mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-cream-100 text-brand-green mb-4">
            <RotateCcw className="w-6 h-6 text-brand-green" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal font-serif">
            Replacement & Cancellation Policy (रिप्लेसमेंट एवं कैंसलेशन नीति)
          </h1>
          <p className="text-xs sm:text-sm text-earth-brown mt-2 leading-relaxed">
            अंतिम अपडेट (Last Updated): {new Date().toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
          <p className="text-xs sm:text-sm text-charcoal/80 mt-3 leading-relaxed">
            सिंगोदिया फूड्स में हम परंपरागत मारवाड़ी स्वाद, शुद्ध देसी मसालों और 100% स्वच्छता के साथ प्रामाणिक घरेलू अचार तैयार करते हैं। खाद्य सुरक्षा नियमों (Food Safety Norms) के अनुसार हमारे यहाँ <strong>कैश रिफंड (पैसा वापसी) की सुविधा नहीं है</strong>। किसी भी खराबी या नुकसान की स्थिति में <strong>अनबॉक्सिंग वीडियो (Unboxing Video) के आधार पर निशुल्क रिप्लेसमेंट (नया पार्सल)</strong> उपलब्ध कराया जाता है।
          </p>

          {/* Quick Policy Highlights Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-6 pt-6 border-t border-cream-200">
            <div className="p-3 bg-red-50/70 rounded-2xl border border-red-200 text-xs">
              <div className="font-bold text-red-800 flex items-center gap-1.5 mb-1">
                <Ban className="w-4 h-4 text-red-600 shrink-0" />
                <span>No Cash Refund</span>
              </div>
              <p className="text-[11px] text-red-950">
                खाद्य उत्पाद होने के कारण कैश रिफंड उपलब्ध नहीं है।
              </p>
            </div>

            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs">
              <div className="font-bold text-emerald-800 flex items-center gap-1.5 mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Replacement Only</span>
              </div>
              <p className="text-[11px] text-emerald-950">
                डैमेज/लीकेज होने पर नया फ्रेश जार तुरंत भेजा जाएगा।
              </p>
            </div>

            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs">
              <div className="font-bold text-amber-900 flex items-center gap-1.5 mb-1">
                <Video className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Unboxing Video Must</span>
              </div>
              <p className="text-[11px] text-amber-950">
                पार्सल खोलते समय की बिना कट वाली वीडियो अनिवार्य है।
              </p>
            </div>

            <div className="p-3 bg-blue-50 rounded-2xl border border-blue-200 text-xs">
              <div className="font-bold text-blue-900 flex items-center gap-1.5 mb-1">
                <Phone className="w-4 h-4 text-blue-700 shrink-0" />
                <span>Call to Cancel</span>
              </div>
              <p className="text-[11px] text-blue-950">
                डिस्पैच से पहले केवल कॉल करके ही ऑर्डर रद्द हो सकता है।
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-cream-200 shadow-card space-y-8 text-xs sm:text-sm text-earth-brown leading-relaxed">
          
          {/* Section 1: Cancellation Policy */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-charcoal font-serif flex items-center gap-2">
              <span className="text-brand-green">1.</span>
              <span>Order Cancellation Policy (ऑर्डर कैंसलेशन नियम - केवल कॉल द्वारा)</span>
            </h2>
            <div className="space-y-3">
              <div className="p-4 bg-cream-50 rounded-2xl border border-cream-200 space-y-2">
                <p className="font-bold text-charcoal flex items-center gap-2">
                  <Phone className="w-4 h-4 text-brand-green" />
                  <span>डिस्पैच से पहले कैंसलेशन (Before Dispatch Cancellation):</span>
                </p>
                <p>
                  आप अपना ऑर्डर सुजानगढ़ स्थित हमारी रसोई से <strong>डिस्पैच (कूरियर को सौंपे जाने) से पहले</strong> रद्द करवा सकते हैं।
                </p>
                <p className="text-charcoal font-semibold bg-white p-3 rounded-xl border border-cream-300">
                  ⚠️ <strong>महत्वपूर्ण निर्देश (Only Call to Cancel):</strong> ऑर्डर कैंसल करवाने के लिए आपको हमारे कस्टमर केयर नंबर <a href="tel:+917597966707" className="text-brand-green font-bold underline hover:text-brand-green-light">+91 75979 66707</a> पर <strong>सीधे फोन कॉल (Phone Call)</strong> करनी होगी। ईमेल या मैसेज में देरी होने पर ऑर्डर डिस्पैच हो सकता है, इसलिए केवल समय पर आई हुई फोन कॉल ही कैंसलेशन हेतु मान्य होगी।
                </p>
              </div>

              <div className="p-4 bg-red-50/50 rounded-2xl border border-red-200 space-y-1 text-red-950">
                <p className="font-bold text-red-900 flex items-center gap-2">
                  <Ban className="w-4 h-4 text-red-600" />
                  <span>डिस्पैच के बाद कैंसलेशन नहीं होगा (No Cancellation After Dispatch):</span>
                </p>
                <p className="text-xs">
                  एक बार ऑर्डर कूरियर कंपनी को सौंप दिया गया और AWB ट्रैकिंग नंबर जनरेट हो गया, उसके बाद पार्सल रास्ते (in-transit) में किसी भी स्थिति में रद्द (cancel) नहीं किया जा सकता।
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: Strict No Refund Policy */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-charcoal font-serif flex items-center gap-2">
              <span className="text-brand-green">2.</span>
              <span>Strict No Cash Refund Policy (कोई कैश रिफंड नहीं)</span>
            </h2>
            <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl text-xs space-y-2 text-amber-950">
              <p className="font-bold text-amber-900 flex items-center gap-1.5 text-sm">
                <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0" />
                <span>खाद्य सुरक्षा एवं शुद्धता नियम (FSSAI Food Safety Regulations):</span>
              </p>
              <p>
                सिंगोदिया फूड्स के सभी उत्पाद प्राकृतिक, बिना किसी केमिकल प्रिजर्वेटिव के बने ताजे खाद्य पदार्थ (Artisanal Homemade Food Items) हैं। स्वास्थ्य, स्वच्छता और खाद्य सुरक्षा मानकों के तहत <strong>डिलीवर किए गए खाद्य उत्पादों पर कोई कैश रिफंड (पैसा वापसी) प्रदान नहीं किया जाता है</strong>।
              </p>
              <p>
                यदि पार्सल में कोई टूट-फूट, खराबी या लीकेज पाई जाती है, तो उसके बदले <strong>100% फ्री रिप्लेसमेंट (नया जार)</strong> भेजा जाता है।
              </p>
            </div>
          </section>

          {/* Section 3: Replacement Policy & Mandatory Unboxing Video */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-charcoal font-serif flex items-center gap-2">
              <span className="text-brand-green">3.</span>
              <span>100% Free Replacement Policy (निशुल्क रिप्लेसमेंट नीति)</span>
            </h2>
            <p>
              यद्यपि हम सभी जार को इंडक्शन सील और हेवी-ड्यूटी बबल प्रोटेक्शन में पैक करते हैं, फिर भी कूरियर परिवहन के दौरान किसी भी प्रकार की क्षति होने पर ग्राहक पूरी तरह सुरक्षित है:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
              <li><strong>ट्रांजिट में डैमेज या जार टूटना:</strong> डिलीवरी के समय जार चटका या टूटा हुआ मिला हो।</li>
              <li><strong>तेल का गंभीर लीकेज:</strong> परिवहन के दौरान जार से तेल बाहर बह गया हो।</li>
              <li><strong>गलत उत्पाद की प्राप्ति:</strong> आपके द्वारा ऑर्डर किए गए अचार के अलावा कोई दूसरा अचार या गलत वजन पहुंच गया हो।</li>
              <li><strong>पैकेज में सामान कम होना:</strong> कॉम्बो पैक में से कोई जार गायब हो।</li>
            </ul>

            {/* Mandatory Unboxing Video Box */}
            <div className="p-5 bg-emerald-50/90 border-2 border-emerald-400 rounded-2xl space-y-3 text-emerald-950">
              <div className="font-bold flex items-center gap-2 text-emerald-900 text-sm font-serif">
                <Video className="w-5 h-5 text-emerald-700" />
                <span>अनिवार्य शर्त: पार्सल खोलते समय की अनबॉक्सिंग वीडियो (Mandatory Continuous Unboxing Video):</span>
              </div>
              <p className="text-xs text-emerald-900 leading-relaxed font-medium">
                रिप्लेसमेंट केवल तभी प्रदान किया जाएगा जब ग्राहक पार्सल खोलते समय की पूरी <strong>अनबॉक्सिंग वीडियो (Unboxing Video)</strong> बनाकर हमारे साथ साझा करेगा। कृपया निम्नलिखित नियमों का पालन करें:
              </p>
              <ol className="list-decimal pl-5 space-y-1.5 text-xs text-emerald-950 font-semibold">
                <li>
                  <strong>वीडियो शुरुआत से बनाएं:</strong> पार्सल खोलने से पहले वीडियो शुरू करें, जिसमें पार्सल पर लगा हुआ कूरियर शिपिंग लेबल (ग्राहक का नाम व ट्रैकिंग नंबर) साफ दिखाई दे।
                </li>
                <li>
                  <strong>वीडियो बिना किसी कट या पॉज के होनी चाहिए:</strong> वीडियो में कोई कट, एडिटिंग या पॉज नहीं होना चाहिए। पार्सल को कैमरे के सामने खोलते हुए दिखाएं।
                </li>
                <li>
                  <strong>खराबी/डैमेज साफ दिखाएं:</strong> यदि जार टूटा है, लीक हुआ है या गलत उत्पाद है, तो उसे कैमरे के सामने स्पष्ट रूप से दिखाएं।
                </li>
                <li>
                  <strong>48 घंटे के भीतर भेजें:</strong> डिलीवरी मिलने के <strong>48 घंटों के भीतर</strong> यह वीडियो अपने आर्डर नंबर के साथ हमारे WhatsApp नंबर <a href="https://wa.me/917597966707" target="_blank" rel="noopener noreferrer" className="underline font-bold text-emerald-800">+91 75979 66707</a> या ईमेल <a href="mailto:premsingodiya861@gmail.com" className="underline font-bold text-emerald-800">premsingodiya861@gmail.com</a> पर भेजें।
                </li>
              </ol>
              <div className="p-3 bg-white/90 rounded-xl border border-emerald-300 text-[11px] text-emerald-950">
                ⚡ <strong>त्वरित कार्रवाई:</strong> अनबॉक्सिंग वीडियो सत्यापित होते ही हमारी टीम <strong>24 घंटे के भीतर नया फ्रेश जार (Free Replacement)</strong> आपके पते पर बिना किसी अतिरिक्त शुल्क के रवाना कर देगी।
                <br />
                <span className="text-red-700 font-bold mt-1 block">
                  *नोट: बिना स्पष्ट अनबॉक्सिंग वीडियो के किसी भी डैमेज या रिप्लेसमेंट का दावा स्वीकार नहीं किया जाएगा।
                </span>
              </div>
            </div>
          </section>

          {/* Section 4: 100% Secure Online Prepaid Payment Only (No COD) */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-charcoal font-serif flex items-center gap-2">
              <span className="text-brand-green">4.</span>
              <span>100% Secure Online Payment (केवल ऑनलाइन भुगतान - नो कैश ऑन डिलीवरी)</span>
            </h2>
            <div className="p-4 bg-cream-50 rounded-2xl border border-cream-200 text-xs space-y-2">
              <p className="flex items-center gap-2 font-bold text-charcoal">
                <CreditCard className="w-4 h-4 text-brand-green" />
                <span>100% प्रीपेड सुरक्षित भुगतान (All Orders are 100% Prepaid):</span>
              </p>
              <p>
                सिंगोदिया फूड्स पर सभी ऑर्डर्स केवल <strong>100% सुरक्षित ऑनलाइन भुगतान (Razorpay)</strong> द्वारा ही स्वीकार किए जाते हैं।
              </p>
              <p>
                आप UPI (Google Pay, PhonePe, Paytm, BHIM), Debit/Credit Cards और Net Banking से तुरंत भुगतान कर सकते हैं। <strong>कैश ऑन डिलीवरी (Cash on Delivery - COD) की सुविधा पूरी वेबसाइट पर बंद है।</strong>
              </p>
            </div>
          </section>

          {/* Section 5: Support & Contact */}
          <section className="pt-4 border-t border-cream-200">
            <h3 className="text-sm font-bold text-charcoal font-serif mb-3">
              Customer Support & Grievance Contact (सहायता एवं संपर्क केंद्र):
            </h3>
            <div className="bg-cream-50/70 p-4 rounded-2xl border border-cream-200 space-y-2 text-xs">
              <p className="font-bold text-charcoal">Singodia Foods Care Desk</p>
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-brand-green flex-shrink-0" />
                <span>Sujangarh, Rajasthan 331507</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-brand-green flex-shrink-0" />
                <span>
                  कैंसलेशन व सहायता के लिए कॉल करें:{' '}
                  <a href="tel:+917597966707" className="text-brand-green font-bold hover:underline">+91 75979 66707</a>
                </span>
              </p>
              <p className="flex items-center gap-2">
                <Video className="w-3.5 h-3.5 text-brand-green flex-shrink-0" />
                <span>
                  अनबॉक्सिंग वीडियो भेजने के लिए WhatsApp:{' '}
                  <a href="https://wa.me/917597966707" target="_blank" rel="noopener noreferrer" className="text-brand-green font-bold hover:underline">+91 75979 66707</a>
                </span>
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
