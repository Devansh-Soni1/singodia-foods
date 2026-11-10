import React, { useState } from 'react';
import { 
  X, MapPin, Check, Plus, ShieldCheck, 
  Home, Building2, Phone, User, CheckCircle2, Loader2, Sparkles
} from 'lucide-react';
import { shippingAPI } from '../../services/api';

export const AddressSelectModal = ({
  isOpen,
  onClose,
  addresses = [],
  selectedAddressId,
  onSelectAddress,
  onSaveNewAddress,
  onSetDefault
}) => {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [pincodeMessage, setPincodeMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // New address form state
  const [newAddr, setNewAddr] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    landmark: '',
    city: '',
    district: '',
    pincode: '',
    state: 'Rajasthan',
    isDefault: false
  });

  if (!isOpen) return null;

  const handlePincodeChange = async (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setNewAddr(prev => ({ ...prev, pincode: val }));
    setPincodeMessage('');
    setErrorMsg('');

    if (val.length === 6) {
      setPincodeLoading(true);
      try {
        const details = await shippingAPI.lookupPincode(val);
        if (details && details.state) {
          setNewAddr(prev => ({
            ...prev,
            city: details.city || prev.city || '',
            district: details.district || prev.district || '',
            state: details.state,
            landmark: prev.landmark || ''
          }));
          setPincodeMessage(`✓ ${details.city || details.district}, ${details.district} (${details.state})`);
        } else {
          setPincodeMessage('');
        }
      } catch {
        // Fallback
      } finally {
        setPincodeLoading(false);
      }
    }
  };

  const handleCreateAddress = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Strict validation - all fields required
    if (!newAddr.fullName.trim()) {
      setErrorMsg('कृपया प्राप्तकर्ता का पूरा नाम दर्ज करें।');
      return;
    }

    const cleanPhone = newAddr.phone.replace(/\D/g, '').slice(-10);
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setErrorMsg('कृपया 10-अंकों का मान्य मोबाइल नंबर (उदा. 9876543210) दर्ज करें।');
      return;
    }

    if (!/^\d{6}$/.test(newAddr.pincode.trim())) {
      setErrorMsg('कृपया 6-अंकों का मान्य पिनकोड दर्ज करें।');
      return;
    }

    if (!newAddr.addressLine1.trim()) {
      setErrorMsg('कृपया फ्लैट / मकान नं. और बिल्डिंग का नाम दर्ज करें।');
      return;
    }

    if (!newAddr.addressLine2.trim()) {
      setErrorMsg('कृपया सड़क / गली / मोहल्ला / क्षेत्र दर्ज करें।');
      return;
    }

    if (!newAddr.landmark.trim()) {
      setErrorMsg('कृपया कोई लैंडमार्क (उदा. जैन मंदिर के पास / मुख्य बाजार) दर्ज करें।');
      return;
    }

    if (!newAddr.city.trim()) {
      setErrorMsg('कृपया शहर या कस्बा (City / Town) दर्ज करें।');
      return;
    }

    if (!newAddr.district.trim()) {
      setErrorMsg('कृपया अपना ज़िला (District) दर्ज करें।');
      return;
    }

    if (!newAddr.state.trim()) {
      setErrorMsg('कृपया राज्य दर्ज करें।');
      return;
    }

    try {
      const payload = {
        ...newAddr,
        phone: cleanPhone,
        district: newAddr.district.trim(),
        isDefault: newAddr.isDefault || addresses.length === 0
      };
      await onSaveNewAddress(payload);
      setIsAddingNew(false);
      setNewAddr({
        fullName: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        landmark: '',
        city: '',
        district: '',
        pincode: '',
        state: 'Rajasthan',
        isDefault: false
      });
    } catch (err) {
      setErrorMsg(err.message || 'पता सहेजने में विफल। कृपया पुनः प्रयास करें।');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 font-sans">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-cream-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-cream-200 bg-[#FFFDF9]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-cream-100 flex items-center justify-center text-brand-green">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-charcoal font-serif">
                {isAddingNew ? 'नया पता जोड़ें (Add Address)' : 'डिलीवरी पता चुनें (Select Address)'}
              </h3>
              <p className="text-[11px] text-earth-brown">
                {isAddingNew ? 'डिलीवरी और कूरियर हेतु सभी विवरण भरें' : 'सहेजे गए पतों में से चुनें या नया पता जोड़ें'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-cream-100 hover:bg-cream-200 text-charcoal flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 max-h-[72vh] overflow-y-auto space-y-4">
          
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          {!isAddingNew ? (
            <>
              {/* Address List */}
              {addresses.length === 0 ? (
                <div className="text-center py-8 space-y-3">
                  <div className="w-14 h-14 rounded-full bg-cream-100 text-earth-brown flex items-center justify-center mx-auto">
                    <Home className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-charcoal">कोई सहेजा गया पता नहीं मिला</h4>
                    <p className="text-xs text-earth-brown mt-0.5">
                      ऑर्डर प्राप्त करने के लिए नीचे बटन पर क्लिक करके नया पता जोड़ें।
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {addresses.map((addr) => {
                    const isSelected = selectedAddressId === addr._id || (!selectedAddressId && addr.isDefault);
                    return (
                      <div
                        key={addr._id}
                        onClick={() => onSelectAddress(addr)}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-brand-green bg-cream-50/70 shadow-xs ring-1 ring-brand-green/20'
                            : 'border-cream-200 bg-white hover:border-cream-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 min-w-0">
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                              isSelected ? 'border-brand-green bg-brand-green text-white' : 'border-gray-300'
                            }`}>
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>

                            <div className="min-w-0 space-y-1 text-xs">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-charcoal text-sm">{addr.fullName}</span>
                                {addr.isDefault && (
                                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                                    DEFAULT / मुख्य पता
                                  </span>
                                )}
                              </div>
                              <p className="text-earth-brown font-semibold flex items-center gap-1.5">
                                <Phone className="w-3.5 h-3.5 text-brand-green shrink-0" />
                                <span>+91 {addr.phone}</span>
                              </p>
                              <p className="text-gray-700 leading-relaxed pt-1">
                                {addr.addressLine1}
                                {addr.addressLine2 && `, ${addr.addressLine2}`}
                                {addr.landmark && `, निकट ${addr.landmark}`}
                              </p>
                              <p className="font-bold text-brand-green">
                                {addr.city}{addr.district && addr.district !== addr.city ? `, ज़िला ${addr.district}` : ''}, {addr.state} — {addr.pincode}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-cream-200/60 flex items-center justify-between text-xs">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectAddress(addr);
                            }}
                            className="font-bold text-brand-green hover:underline"
                          >
                            ✓ यह पता चुनें (Deliver Here)
                          </button>

                          {!addr.isDefault && onSetDefault && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onSetDefault(addr._id);
                              }}
                              className="text-[11px] text-gray-500 hover:text-charcoal"
                            >
                              मुख्य पता बनाएं (Set as Default)
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Add New Address Button */}
              <button
                type="button"
                onClick={() => setIsAddingNew(true)}
                className="w-full py-3.5 px-4 rounded-2xl bg-cream-100 hover:bg-cream-200/80 border-2 border-dashed border-brand-green/40 text-brand-green font-bold text-xs flex items-center justify-center gap-2 transition-all mt-4"
              >
                <Plus className="w-4 h-4" />
                <span>+ नया डिलीवरी पता जोड़ें (Add New Address)</span>
              </button>
            </>
          ) : (
            /* Add New Address Form */
            <form onSubmit={handleCreateAddress} className="space-y-3.5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-charcoal block mb-1">
                    पूरा नाम (Full Name) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Chandra"
                    value={newAddr.fullName}
                    onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-cream-50 border border-cream-300 rounded-xl focus:outline-none focus:border-brand-green"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-charcoal block mb-1">
                    मोबाइल नंबर (10-Digit Mobile) <span className="text-red-500">*</span>
                  </label>
                  <div className="flex rounded-xl overflow-hidden border border-cream-300 bg-cream-50">
                    <span className="px-2.5 py-2 bg-cream-200/60 text-xs font-bold text-gray-700 border-r border-cream-300">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="9876543210"
                      value={newAddr.phone}
                      onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                      className="w-full px-3 py-2 text-xs bg-transparent focus:outline-none font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* Address Line 1 */}
              <div>
                <label className="text-xs font-bold text-charcoal block mb-1">
                  मकान / फ्लैट नं., बिल्डिंग / अपार्टमेंट का नाम <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flat 302, Prem Niwas, Tower B"
                  value={newAddr.addressLine1}
                  onChange={(e) => setNewAddr({ ...newAddr, addressLine1: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-cream-50 border border-cream-300 rounded-xl focus:outline-none focus:border-brand-green"
                />
              </div>

              {/* Address Line 2 */}
              <div>
                <label className="text-xs font-bold text-charcoal block mb-1">
                  सड़क / गली / मोहल्ला / कॉलोनी (Street / Area) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bagreche Bass, Near Station Road"
                  value={newAddr.addressLine2}
                  onChange={(e) => setNewAddr({ ...newAddr, addressLine2: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-cream-50 border border-cream-300 rounded-xl focus:outline-none focus:border-brand-green"
                />
              </div>

              {/* Landmark */}
              <div>
                <label className="text-xs font-bold text-charcoal block mb-1">
                  प्रसिद्ध लैंडमार्क (Landmark / पहचान) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Near Jain Mandir / Old Post Office"
                  value={newAddr.landmark}
                  onChange={(e) => setNewAddr({ ...newAddr, landmark: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-cream-50 border border-cream-300 rounded-xl focus:outline-none focus:border-brand-green"
                />
              </div>

              {/* City & District (Separated into distinct fields) */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-charcoal block mb-1">
                    शहर / कस्बा (City / Town) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sujangarh"
                    value={newAddr.city}
                    onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-cream-50 border border-cream-300 rounded-xl focus:outline-none focus:border-brand-green font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-charcoal block mb-1">
                    ज़िला (District) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Churu / Jaipur"
                    value={newAddr.district}
                    onChange={(e) => setNewAddr({ ...newAddr, district: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-cream-50 border border-cream-300 rounded-xl focus:outline-none focus:border-brand-green font-medium"
                  />
                </div>
              </div>

              {/* PIN Code & State (Placed next to City & District) */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-charcoal block mb-1">
                    पिनकोड (PIN Code) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="e.g. 331507"
                      value={newAddr.pincode}
                      onChange={handlePincodeChange}
                      className="w-full px-3.5 py-2 text-xs bg-cream-50 border border-cream-300 rounded-xl focus:outline-none focus:border-brand-green font-bold tracking-wider"
                    />
                    {pincodeLoading && (
                      <div className="absolute right-3 top-2 text-brand-green">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      </div>
                    )}
                  </div>
                  {pincodeMessage && (
                    <p className={`text-[10.5px] mt-0.5 font-semibold ${
                      pincodeMessage.startsWith('✓') ? 'text-emerald-700' : 'text-amber-700'
                    }`}>
                      {pincodeMessage}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-charcoal block mb-1">
                    राज्य (State) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajasthan"
                    value={newAddr.state}
                    onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-cream-50 border border-cream-300 rounded-xl focus:outline-none focus:border-brand-green font-medium"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-charcoal">
                  <input
                    type="checkbox"
                    checked={newAddr.isDefault}
                    onChange={(e) => setNewAddr({ ...newAddr, isDefault: e.target.checked })}
                    className="w-4 h-4 accent-brand-green rounded"
                  />
                  <span>इस पते को मुख्य पता (Default Address) बनाएं</span>
                </label>
              </div>

              {/* Form Action Buttons */}
              <div className="flex items-center gap-2.5 pt-3 border-t border-cream-200">
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="flex-1 py-3 px-4 rounded-xl border border-cream-300 text-charcoal font-bold text-xs hover:bg-cream-100 transition-colors"
                >
                  रद्द करें (Back)
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-xl bg-brand-green hover:bg-brand-green-dark text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>सहेजें और चुनें (Save & Select)</span>
                </button>
              </div>

            </form>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-cream-50/80 border-t border-cream-200 text-center text-[11px] text-earth-brown">
          🔒 आपका पता 100% सुरक्षित है एवं केवल कूरियर डिलीवरी हेतु उपयोग किया जाएगा।
        </div>

      </div>
    </div>
  );
};

export default AddressSelectModal;

