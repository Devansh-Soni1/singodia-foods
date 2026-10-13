import React, { useState } from 'react';
import { MapPin, Phone, Mail, MessageCircle, Send, Check } from 'lucide-react';

export const ContactPage = () => {
  const [sent, setSent] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="py-12 sm:py-20 bg-[#FAF6EF] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-mustard-dark uppercase tracking-widest block mb-2">
            हमसे संपर्क करें
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-charcoal font-serif">
            Get in Touch With Singodhia Foods
          </h1>
          <p className="text-xs sm:text-sm text-earth-brown mt-2">
            Have a question about our ingredients, custom wedding hampers, or order status? We are always happy to help!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Contact Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-card space-y-6">
              <h3 className="text-lg font-bold text-charcoal font-serif pb-3 border-b border-cream-100">
                Contact Details
              </h3>

              <div className="space-y-4 text-xs text-charcoal">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cream-100 flex items-center justify-center text-brand-green flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold">Our Kitchen & Heritage Store</h4>
                    <p className="text-earth-brown mt-0.5">
                      Singodhia Bhawan, Heritage Lane, Jaipur, Rajasthan 302001, India
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cream-100 flex items-center justify-center text-brand-green flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold">Helpline (10 AM - 7 PM IST)</h4>
                    <p className="text-earth-brown mt-0.5">+91 98765 43210</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cream-100 flex items-center justify-center text-brand-green flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold">Email Support</h4>
                    <p className="text-earth-brown mt-0.5">care@singodhiafoods.com</p>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp CTA */}
              <div className="pt-4 border-t border-cream-100">
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Chat With Our Team on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right: Message Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-cream-200 shadow-card">
              <h3 className="text-lg font-bold text-charcoal font-serif mb-2">
                Send Us a Message
              </h3>
              <p className="text-xs text-earth-brown mb-6">
                Fill in the form below and we will respond within 24 business hours.
              </p>

              {sent ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                  <Check className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h4 className="text-sm font-bold text-emerald-900 font-serif">Message Dispatched!</h4>
                  <p className="text-xs text-emerald-700">
                    Thank you! Our customer care representative will reach out to you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-charcoal block mb-1">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-cream-300 text-xs bg-cream-50"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-charcoal block mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-cream-300 text-xs bg-cream-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-charcoal block mb-1">Phone Number (Optional)</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-cream-300 text-xs bg-cream-50"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-charcoal block mb-1">Your Enquiry / Message *</label>
                    <textarea
                      required
                      rows="4"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Ask about flavours, bulk festive hampers, delivery..."
                      className="w-full p-2.5 rounded-xl border border-cream-300 text-xs bg-cream-50"
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-brand-green hover:bg-brand-green-light text-white text-xs font-bold px-8 py-3.5 rounded-xl shadow-xs transition-all flex items-center gap-2"
                  >
                    <span>Send Message</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ContactPage;

