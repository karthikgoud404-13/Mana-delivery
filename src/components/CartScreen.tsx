import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Trash2, Plus, Minus, FileText, ChevronRight, ShoppingBag, ShieldCheck, Heart } from 'lucide-react';

export const CartScreen: React.FC = () => {
  const { cart, updateCartQuantity, removeFromCart, clearCart, cartTotal, goBack, setScreen } = useApp();
  const [deliveryTip, setDeliveryTip] = useState<number>(0);
  const [instructions, setInstructions] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState('');

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-500 p-6 font-sans">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4 border border-slate-200 animate-bounce">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <p className="font-extrabold text-slate-800 text-lg">Your Cart is Empty</p>
        <p className="text-xs text-slate-400 text-center max-w-xs mt-1 mb-6">
          Add fresh, delicious dishes or daily grocery essentials from your favorite local outlets!
        </p>
        <button 
          onClick={() => setScreen('home')} 
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-3 rounded-2xl shadow-lg shadow-purple-500/25 transition-all cursor-pointer"
        >
          Browse Restaurants & Stores
        </button>
      </div>
    );
  }

  const isFood = cart[0].type === 'food';
  const storeName = cart[0].storeName;
  const deliveryFee = 1.99;
  const tax = Number((cartTotal * 0.08).toFixed(2));
  
  // Promo code discounts
  const discountAmount = appliedPromo === 'FIRST50' ? Number((cartTotal * 0.5).toFixed(2)) : 0;
  const grandTotal = Number((cartTotal + deliveryFee + tax + deliveryTip - discountAmount).toFixed(2));

  const handleApplyPromo = () => {
    setPromoError('');
    if (promoCode.toUpperCase() === 'FIRST50') {
      setAppliedPromo('FIRST50');
      setPromoCode('');
    } else {
      setPromoError('Invalid promo code. Try "FIRST50"');
    }
  };

  return (
    <div id="cart-screen" className="pb-28 bg-slate-50 min-h-screen text-slate-800 font-sans">
      {/* Sticky Header */}
      <div className="bg-white border-b border-slate-100 px-5 py-4 sticky top-0 z-30 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={goBack} 
            className="p-1.5 hover:bg-slate-100 rounded-full text-slate-600 cursor-pointer transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Your Cart</h2>
            <p className="text-xs text-slate-500">Items from <span className="font-semibold text-slate-700">{storeName}</span></p>
          </div>
        </div>

        <button 
          onClick={clearCart}
          className="p-2 hover:bg-red-50 text-red-500 rounded-xl transition-all cursor-pointer"
          title="Clear Cart"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="p-5 space-y-6">
        
        {/* Cart items list */}
        <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Itemized list</h3>
          
          {cart.map((item, index) => (
            <div 
              key={item.id} 
              className={`flex gap-4 items-center ${
                index !== cart.length - 1 ? 'border-b border-slate-100 pb-4' : ''
              }`}
            >
              <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover shrink-0" />
              
              <div className="flex-1 min-w-0">
                <h4 className="font-extrabold text-slate-900 text-sm truncate">{item.name}</h4>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  ${item.price.toFixed(2)} {item.unit ? `• ${item.unit}` : ''}
                </p>
              </div>

              {/* Counter Controls */}
              <div className="flex items-center gap-2.5 bg-slate-100 rounded-xl p-1.5">
                <button
                  onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                  className="p-0.5 hover:bg-white rounded-md text-slate-700 transition-all cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs font-black text-slate-900 w-4 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                  className="p-0.5 hover:bg-white rounded-md text-slate-700 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Promo Code section */}
        <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm space-y-3">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Promo Coupon</h3>
          
          {appliedPromo ? (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl p-3 flex justify-between items-center font-bold">
              <span>Code "FIRST50" Applied (50% Off!)</span>
              <button 
                onClick={() => setAppliedPromo(null)}
                className="text-emerald-600 hover:underline cursor-pointer text-[10px]"
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Try code: FIRST50"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-bold uppercase placeholder-slate-400 focus:outline-none focus:border-slate-300"
                />
                <button
                  onClick={handleApplyPromo}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
                >
                  Apply
                </button>
              </div>
              {promoError && <p className="text-[10px] text-red-500 font-bold pl-1">{promoError}</p>}
            </div>
          )}
        </div>

        {/* Special Instructions */}
        <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm space-y-3">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <FileText className="w-4 h-4 text-slate-400" />
            <span>Special Delivery Notes</span>
          </h3>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="e.g. Please leave packages at the front door, don't ring the bell, etc..."
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs font-semibold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/10 focus:border-purple-500 min-h-[70px]"
          />
        </div>

        {/* Delivery Partner Tip selector */}
        <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Tip your delivery hero</h3>
            <span className="text-[10px] text-slate-400 font-bold">100% of tips go to driver</span>
          </div>

          <p className="text-xs text-slate-500">Support your delivery partner to deliver your items in heavy rain or peak hours.</p>

          <div className="flex gap-2.5">
            {[0, 1, 2, 3, 5].map((tipVal) => (
              <button
                key={tipVal}
                onClick={() => setDeliveryTip(tipVal)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  deliveryTip === tipVal
                    ? (isFood ? 'border-purple-500 bg-purple-50 text-purple-900 font-extrabold' : 'border-emerald-600 bg-emerald-50 text-emerald-900 font-extrabold')
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {tipVal === 0 ? 'Not now' : `$${tipVal}`}
              </button>
            ))}
          </div>
        </div>

        {/* Secure Ledger Receipt Summary */}
        <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm space-y-3 text-xs font-semibold text-slate-600">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">Receipt ledger</h3>
          
          <div className="flex justify-between">
            <span>Basket Subtotal</span>
            <span className="text-slate-800">${cartTotal.toFixed(2)}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between text-emerald-600 font-bold">
              <span>Promo Discount (FIRST50)</span>
              <span>-${discountAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Instant Express Delivery Fee</span>
            <span className="text-slate-800">${deliveryFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Estimated Local Taxes (8%)</span>
            <span className="text-slate-800">${tax.toFixed(2)}</span>
          </div>
          {deliveryTip > 0 && (
            <div className="flex justify-between text-slate-700">
              <span>Driver Reward Tip</span>
              <span className="text-slate-800">${deliveryTip.toFixed(2)}</span>
            </div>
          )}
          
          <div className="border-t border-dashed border-slate-100 pt-3 flex justify-between items-center text-sm font-black text-slate-900">
            <span>Grand Total</span>
            <span className={isFood ? 'text-purple-600' : 'text-emerald-600'}>${grandTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Trust Badge and checkout action sticky banner */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 shadow-xl z-20 flex flex-col gap-2">
          <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            <ShieldCheck className="w-4.5 h-4.5 text-slate-400 fill-slate-50" />
            <span>Encrypted Checkout Protocol Guaranteed</span>
          </div>
          
          <button
            onClick={() => setScreen('checkout')}
            className={`w-full text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg transition-all cursor-pointer flex justify-between items-center ${
              isFood 
                ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/20' 
                : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
            }`}
          >
            <div className="text-left">
              <span className="text-[10px] font-bold block uppercase opacity-80">Proceeding with Cart</span>
              <span className="text-sm font-black">${grandTotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-1 font-bold">
              <span>Review Details</span>
              <ChevronRight className="w-5 h-5" />
            </div>
          </button>
        </div>

      </div>
    </div>
  );
};
