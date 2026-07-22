import { useState } from 'react';
import { formatINR, formatINRFull } from '../utils/formatCurrency';

export default function PurchaseModal({ vehicle, onClose, onConfirmPurchase, purchasing }) {
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' | 'financing' | 'cash'
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardName, setCardName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');

  const tax = Math.round(vehicle.price * 0.18); // 18% GST / Tax
  const registrationFee = 25000;
  const totalPrice = vehicle.price + tax + registrationFee;

  const defaultImage =
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80';

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await onConfirmPurchase(vehicle.id);
      setOrderId(`INV-${Math.random().toString(36).substring(2, 9).toUpperCase()}`);
      setOrderComplete(true);
    } catch {
      // Error handled by parent
    }
  }

  if (orderComplete) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
        <div className="card p-6 w-full max-w-lg shadow-2xl animate-slide-up bg-white rounded-3xl overflow-hidden text-center border border-slate-100">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-1">Vehicle Booking Confirmed!</h2>
          <p className="text-sm text-slate-500 mb-4">
            Thank you for your purchase. Your vehicle reservation is complete.
          </p>

          {/* Receipt card */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-left mb-6 space-y-2">
            <div className="flex justify-between text-xs text-slate-500 border-b border-slate-200 pb-2">
              <span>Order Reference: <strong className="text-slate-800">{orderId}</strong></span>
              <span>Date: {new Date().toLocaleDateString('en-IN')}</span>
            </div>
            <div className="flex items-center gap-3 pt-1">
              <img
                src={vehicle.imageUrl || defaultImage}
                alt={`${vehicle.make} ${vehicle.model}`}
                className="w-16 h-12 object-cover rounded-xl shadow-sm"
              />
              <div>
                <h4 className="font-bold text-slate-900 text-sm">
                  {vehicle.make} {vehicle.model}
                </h4>
                <span className="badge-indigo text-[10px]">{vehicle.category}</span>
              </div>
            </div>
            <div className="border-t border-slate-200 pt-2 text-xs space-y-1">
              <div className="flex justify-between text-slate-600">
                <span>Ex-Showroom Price:</span>
                <span>{formatINRFull(vehicle.price)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>GST &amp; Taxes (18%):</span>
                <span>{formatINRFull(tax)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Registration &amp; Handling:</span>
                <span>{formatINRFull(registrationFee)}</span>
              </div>
              <div className="flex justify-between font-bold text-slate-900 text-sm pt-1 border-t border-slate-200">
                <span>Total On-Road Price:</span>
                <span className="text-primary-600">{formatINRFull(totalPrice)}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => window.print()}
              className="btn-secondary flex-1 py-2.5 text-sm"
            >
              🖨️ Print Receipt
            </button>
            <button
              onClick={onClose}
              className="btn-primary flex-1 py-2.5 text-sm"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in overflow-y-auto">
      <div className="card w-full max-w-2xl shadow-2xl animate-slide-up bg-white rounded-3xl overflow-hidden my-8 border border-slate-100">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-primary-400 font-semibold">Vehicle Checkout</span>
            <h2 className="text-xl font-bold">{vehicle.make} {vehicle.model}</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Vehicle Image & Price Summary */}
            <div>
              <div className="relative rounded-2xl overflow-hidden shadow-sm mb-4 h-44 bg-slate-100">
                <img
                  src={vehicle.imageUrl || defaultImage}
                  alt={`${vehicle.make} ${vehicle.model}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                  {vehicle.category}
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2 text-sm">
                <h4 className="font-bold text-slate-800 border-b border-slate-200 pb-2">On-Road Price Breakdown</h4>
                <div className="flex justify-between text-slate-600">
                  <span>Ex-Showroom Price</span>
                  <span>{formatINR(vehicle.price)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>GST &amp; Cess (18%)</span>
                  <span>{formatINR(tax)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>RTO &amp; Fastag Fee</span>
                  <span>{formatINR(registrationFee)}</span>
                </div>
                <div className="flex justify-between font-extrabold text-base text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total On-Road</span>
                  <span className="text-primary-600">{formatINR(totalPrice, true)}</span>
                </div>
              </div>
            </div>

            {/* Right: Payment & Delivery Information */}
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 text-sm">Select Payment Method</h4>
              
              {/* Tabs */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'card', label: '💳 UPI / Card' },
                  { id: 'financing', label: '🏦 Bank Loan' },
                  { id: 'cash', label: '💵 Cash' },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id)}
                    className={`py-2 px-2 text-xs font-semibold rounded-xl border text-center transition-all ${
                      paymentMethod === m.id
                        ? 'bg-primary-50 border-primary-500 text-primary-700 shadow-sm'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              {/* Payment Fields */}
              {paymentMethod === 'card' && (
                <div className="space-y-3 pt-1">
                  <div>
                    <label className="label text-xs">Cardholder / UPI Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="input py-2 text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="label text-xs">Card / UPI ID</label>
                    <input
                      type="text"
                      placeholder="4532 •••• •••• 8892 or name@upi"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="input py-2 text-xs"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="label text-xs">Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="input py-2 text-xs"
                        required
                      />
                    </div>
                    <div>
                      <label className="label text-xs">CVV</label>
                      <input
                        type="text"
                        placeholder="123"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="input py-2 text-xs"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'financing' && (
                <div className="p-3.5 bg-indigo-50 border border-indigo-100 rounded-2xl text-xs space-y-2 text-slate-700">
                  <p className="font-semibold text-primary-900">Auto Loan EMI Calculator</p>
                  <div className="flex justify-between">
                    <span>Loan Tenure:</span>
                    <span className="font-bold">60 Months (5 Yrs)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Interest Rate:</span>
                    <span className="font-bold">8.5% p.a.</span>
                  </div>
                  <div className="flex justify-between text-primary-700 font-extrabold text-sm pt-1 border-t border-indigo-200">
                    <span>Estimated Monthly EMI:</span>
                    <span>{formatINR(Math.round(totalPrice / 48))}/mo</span>
                  </div>
                </div>
              )}

              {paymentMethod === 'cash' && (
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-600">
                  Full cash payment will be completed upon vehicle delivery at our showroom.
                </div>
              )}

              {/* Address */}
              <div className="pt-2">
                <label className="label text-xs">Delivery Address in India</label>
                <input
                  type="text"
                  placeholder="Flat No, Building, Street"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="input py-2 text-xs mb-2"
                  required
                />
                <input
                  type="text"
                  placeholder="City, State, Pincode (e.g. Mumbai, MH 400001)"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="input py-2 text-xs"
                  required
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1 py-3 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={purchasing}
              className="btn-primary flex-1 py-3 text-sm font-bold shadow-lg hover:shadow-xl"
            >
              {purchasing ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Reserving Vehicle...
                </span>
              ) : (
                `Complete Booking (${formatINR(totalPrice, true)})`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
