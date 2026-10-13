import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { SAMPLE_FAQS } from '../../utils/sampleData';

export const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="py-16 sm:py-24 bg-white border-t border-cream-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-mustard-dark uppercase tracking-widest mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-charcoal font-serif">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-earth-brown mt-2">
            Everything you need to know about our traditional preparation, ingredients, and delivery.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3.5">
          {SAMPLE_FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="border border-cream-200 rounded-2xl overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className={`w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm transition-colors ${
                    isOpen ? 'bg-cream-100 text-brand-green' : 'bg-cream-50/50 text-charcoal hover:bg-cream-50'
                  }`}
                  aria-expanded={isOpen}
                >
                  <span className="font-serif">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-earth-brown flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-brand-green' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="p-4 sm:p-5 bg-white border-t border-cream-200 text-xs sm:text-sm text-earth-brown leading-relaxed animate-in fade-in duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default FaqSection;

