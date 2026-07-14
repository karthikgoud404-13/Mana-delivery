import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, MapPin, CreditCard, ChevronRight, CheckCircle2, ShieldCheck, Heart, Sparkles, RefreshCw } from 'lucide-react';

export const CheckoutScreen: React.FC = () => {
  const { user, cartTotal, placeOrder, goBack, cart } = useApp();
  const [addressType, setAddressType] = useState<'home' | 'work' | 'custom'>('home');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod'>('upi');
  const [deliverySlot, setDeliverySlot] = useState<'express' | 'later'>('express');
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [customAddress, setCustomAddress] = useState(user?.address || '102 Pine Street, Apt 4B');

  const isFood = cart.length > 0 ? cart[0].type === 'food' : true;
  const deliveryFee = 1.99;
  const tax = Number((cartTotal * 0.08).toFixed(2));
  const total = Number((cartTotal + deliveryFee + tax).toFixed(2));

  const handlePlaceOrder = () => {
    setIsAuthorizing(true);
    setTimeout(() => {
      setIsAuthorizing(false);
      const methodLabel = paymentMethod === 'upi' ? 'UPI Gateway' : paymentMethod === 'card' ? 'Visa •••• 9842' : 'Cash on Delivery';
      placeOrder(methodLabel);
    }, 2000); // Simulate secure credit card processor authorization
  };

  return (
    <div id="checkout-screen" className="pb-24 bg-slate-50 min-h-screen text-slate-800 font-sans">
      {/* Sticky Top Header */}
      <div className="bg-white border-b border-slate-100 px-5 py-4 sticky top-0 z-30 shadow-sm flex items-center gap-3">
        <button 
          onClick={goBack} 
          className="p-1.5 hover:bg-slate-100 rounded-full text-slate-600 cursor-pointer transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-lg font-extrabold text-slate-900">Secure Checkout</h2>
          <p className="text-xs text-slate-500">Confirm details to place your order</p>
        </div>
      </div>

      <div className="p-5 space-y-6">

        {/* 1. Delivery Address Block */}
        <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Delivery Target Location</h3>
            <div className="flex gap-1 bg-slate-100 p-0.5 rounded-lg">
              <button
                onClick={() => setAddressType('home')}
                className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                  addressType === 'home' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => setAddressType('work')}
                className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                  addressType === 'work' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
                }`}
              >
                Work
              </button>
            </div>
          </div>

          <div className="flex gap-3.5 items-start">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              isFood ? 'bg-purple-50 text-purple-600' : 'bg-emerald-50 text-emerald-600'
            }`}>
              <MapPin className="w-5 h-5" />
            </div>
            <div className="flex-1 space-y-2">
              <input
                type="text"
                value={customAddress}
                onChange={(e) => setCustomAddress(e.target.value)}
                placeholder="Enter complete address, floor, flat etc."
                className="w-full bg-slate-50 border border-slate-200 focus:border-slate-300 rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none"
              />
              <p className="text-[10px] text-slate-400 font-bold">
                Assigned deliveree: <span className="text-slate-700">{user?.name} • {user?.phone}</span>
              </p>
            </div>
          </div>
        </div>

        {/* 2. Dispatch Timeslot Block */}
        <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Scheduled Delivery Speed</h3>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setDeliverySlot('express')}
              className={`p-3.5 rounded-2xl text-left border-2 transition-all cursor-pointer ${
                deliverySlot === 'express'
                  ? (isFood ? 'border-purple-500 bg-purple-50/20' : 'border-emerald-600 bg-emerald-50/20')
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <p className="text-xs font-extrabold text-slate-900 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Instant Express</span>
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">As soon as possible (10-20 min)</p>
            </button>
            
            <button
              onClick={() => setDeliverySlot('later')}
              className={`p-3.5 rounded-2xl text-left border-2 transition-all cursor-pointer ${
                deliverySlot === 'later'
                  ? (isFood ? 'border-purple-500 bg-purple-50/20' : 'border-emerald-600 bg-emerald-50/20')
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <p className="text-xs font-extrabold text-slate-900">Schedule Slot</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Deliver in evening slot (6-8 PM)</p>
            </button>
          </div>
        </div>

        {/* 3. Secure Payment Selector */}
        <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Select Payment Protocol</h3>

          <div className="space-y-2.5">
            {[
              { id: 'upi', label: 'Instant UPI (GPay, PhonePe)', icon: '⚡' },
              { id: 'card', label: 'Credit / Debit Card (Visa, MasterCard)', icon: '💳' },
              { id: 'cod', label: 'Cash / Pay on Delivery (COD)', icon: '💵' },
            ].map((method) => {
              const isSelected = paymentMethod === method.id;
              return (
                <div
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id as any)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? (isFood ? 'border-purple-500 bg-purple-50/10' : 'border-emerald-600 bg-emerald-50/10')
                      : 'border-slate-100 bg-white hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{method.icon}</span>
                    <span className="text-xs font-extrabold text-slate-800">{method.label}</span>
                  </div>
                  <div className={`w-5.5 h-5.5 rounded-full border flex items-center justify-center ${
                    isSelected
                      ? (isFood ? 'bg-purple-600 border-purple-600 text-white' : 'bg-emerald-600 border-emerald-600 text-white')
                      : 'border-slate-300 bg-transparent'
                  }`}>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. Payment processing overlay block / Summary */}
        <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm space-y-3 text-xs font-semibold text-slate-500">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">Receipt ledger</h3>
          <div className="flex justify-between">
            <span>Basket Subtotal</span>
            <span className="text-slate-800">${cartTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Express Delivery Fee</span>
            <span className="text-slate-800">${deliveryFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Estimated Local Taxes (8%)</span>
            <span className="text-slate-800">${tax.toFixed(2)}</span>
          </div>
          <div className="border-t border-dashed border-slate-100 pt-3 flex justify-between items-center text-sm font-black text-slate-900">
            <span>Grand Total Due</span>
            <span className={isFood ? 'text-purple-600' : 'text-emerald-600'}>${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Proceed & confirm order sticky trigger */}
        <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 -mx-5 mt-4 z-20 flex flex-col gap-2">
          <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-slate-400" />
            <span>Secured via standard 256-bit bank encryption</span>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={isAuthorizing}
            className={`w-full text-white font-bold py-4 px-6 rounded-2xl shadow-lg transition-all flex justify-center items-center gap-2 cursor-pointer ${
              isFood 
                ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/20' 
                : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
            }`}
          >
            {isAuthorizing ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Authorizing Security Gateway...</span>
              </>
            ) : (
              <>
                <span>Place Order & Authorize ${total.toFixed(2)}</span>
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
