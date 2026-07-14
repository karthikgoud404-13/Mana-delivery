import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Star, ShoppingBag, Plus, Minus, Info, Heart, Truck, HelpCircle, ShieldAlert } from 'lucide-react';

export const ProductDetailsScreen: React.FC = () => {
  const { selectedProduct, cart, addToCart, updateCartQuantity, goBack } = useApp();
  const [isLiked, setIsLiked] = useState(false);
  const [selectedSize, setSelectedSize] = useState<'standard' | 'large'>('standard');
  const [addOns, setAddOns] = useState<string[]>([]);

  if (!selectedProduct) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-500">
        <p className="font-semibold mb-4">No product selected</p>
        <button onClick={goBack} className="bg-purple-600 text-white font-bold px-4 py-2 rounded-xl">
          Go Back
        </button>
      </div>
    );
  }

  const { item, store, type } = selectedProduct;
  const cartItem = cart.find((ci) => ci.id === item.id);

  const toggleAddOn = (addon: string) => {
    setAddOns((prev) =>
      prev.includes(addon) ? prev.filter((a) => a !== addon) : [...prev, addon]
    );
  };

  const isFood = type === 'food';
  const sizeSurcharge = selectedSize === 'large' ? (isFood ? 2.50 : 1.99) : 0;
  const addonsCost = addOns.length * (isFood ? 1.50 : 0.99);
  const finalPrice = item.price + sizeSurcharge + addonsCost;

  return (
    <div id="product-details-screen" className="pb-24 bg-slate-50 min-h-screen text-slate-800 font-sans">
      {/* Top Hero Image Banner */}
      <div className="relative h-72 sm:h-96 w-full bg-slate-100">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        
        {/* Soft dark gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-slate-900/40" />

        {/* Back and favorite buttons overlay */}
        <div className="absolute top-5 left-5 right-5 flex justify-between items-center">
          <button 
            onClick={goBack} 
            className="w-10 h-10 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full flex items-center justify-center text-slate-700 shadow transition-all cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <button 
            onClick={() => setIsLiked(!isLiked)} 
            className="w-10 h-10 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full flex items-center justify-center shadow transition-all cursor-pointer"
          >
            <Heart className={`w-5 h-5 transition-all ${isLiked ? 'text-red-500 fill-red-500 scale-110' : 'text-slate-600'}`} />
          </button>
        </div>

        {/* Dynamic Category Overlay badge */}
        <div className="absolute bottom-5 left-5 right-5 flex justify-between items-end text-white">
          <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider shadow-md ${
            isFood ? 'bg-purple-600' : 'bg-emerald-600'
          }`}>
            {isFood ? '🍽️ Restaurant Delicacy' : '🥦 Express Grocery'}
          </span>
          <div className="bg-black/40 backdrop-blur-sm border border-white/20 px-2.5 py-1 rounded-xl flex items-center gap-1">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-xs font-bold">{item.rating} Rating</span>
          </div>
        </div>
      </div>

      {/* Details Container */}
      <div className="p-5 space-y-6">
        
        {/* Title Block */}
        <div>
          <div className="flex justify-between items-start">
            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-tight max-w-[75%]">{item.name}</h1>
            <p className={`text-lg font-black shrink-0 ${isFood ? 'text-purple-600' : 'text-emerald-600'}`}>
              ${item.price.toFixed(2)}
            </p>
          </div>

          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1.5 flex items-center gap-1.5">
            <span>By {store.name}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
            <span>{isFood ? 'Cuisine:' : 'Catalog:'} {item.category}</span>
          </p>

          <p className="text-sm text-slate-600 mt-3 leading-relaxed font-medium">
            {item.description}
          </p>
        </div>

        {/* Delivery speed badge */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              isFood ? 'bg-purple-50 text-purple-600' : 'bg-emerald-50 text-emerald-600'
            }`}>
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-extrabold text-slate-900">⚡ Super Instant Delivery</p>
              <p className="text-[11px] text-slate-500">Estimated duration: {store.deliveryTime}</p>
            </div>
          </div>
          <span className="text-xs font-bold text-slate-400">⚡ Fast</span>
        </div>

        {/* Interactive Customizations: Food Size or Grocery Quality options */}
        <div className="space-y-4">
          <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Choose serving scale</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setSelectedSize('standard')}
              className={`p-3.5 rounded-2xl text-left border-2 transition-all cursor-pointer ${
                selectedSize === 'standard'
                  ? (isFood ? 'border-purple-500 bg-purple-50/20' : 'border-emerald-600 bg-emerald-50/20')
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <p className="text-xs font-extrabold text-slate-900">Standard Pack</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Regular size serving</p>
            </button>
            <button
              onClick={() => setSelectedSize('large')}
              className={`p-3.5 rounded-2xl text-left border-2 transition-all cursor-pointer ${
                selectedSize === 'large'
                  ? (isFood ? 'border-purple-500 bg-purple-50/20' : 'border-emerald-600 bg-emerald-50/20')
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <p className="text-xs font-extrabold text-slate-900">
                Large Premium Sized
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">+{isFood ? '$2.50' : '$1.99'} premium tier</p>
            </button>
          </div>
        </div>

        {/* Custom optional Add-ons */}
        <div className="space-y-4">
          <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Add Special Extras</h3>
          <div className="space-y-2.5">
            {(isFood 
              ? ['Double Melted Cheese', 'Crispy Golden Bacon', 'Secret Spicy Sriracha sauce'] 
              : ['Eco-Friendly Shopping Bag', 'Insulated Cool Shield Protection', 'Extended Quality Warranty']
            ).map((addon) => {
              const isSelected = addOns.includes(addon);
              return (
                <div
                  key={addon}
                  onClick={() => toggleAddOn(addon)}
                  className="bg-white p-3 rounded-2xl border border-slate-100 flex items-center justify-between cursor-pointer hover:border-slate-200 transition-all shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                      isSelected 
                        ? (isFood ? 'bg-purple-600 border-purple-600 text-white' : 'bg-emerald-600 border-emerald-600 text-white') 
                        : 'border-slate-300 bg-transparent'
                    }`}>
                      {isSelected && <span className="text-[10px]">✔</span>}
                    </div>
                    <span className="text-xs font-bold text-slate-800">{addon}</span>
                  </div>
                  <span className="text-xs font-extrabold text-slate-500">
                    +{isFood ? '$1.50' : '$0.99'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Safety standards info */}
        <div className="p-3 bg-slate-100/75 border border-slate-200/50 rounded-2xl flex items-start gap-2.5 text-[11px] text-slate-500">
          <ShieldAlert className="w-4.5 h-4.5 text-slate-400 shrink-0 mt-0.5" />
          <p className="leading-normal">
            QuickBite complies strictly with premium kitchen state and safety standard regulations. Food orders are delivered in sealed, sanitized thermal crates.
          </p>
        </div>

        {/* Cart Trigger / Interaction footer bar */}
        <div className="border-t border-slate-100 bg-white p-4 flex items-center justify-between gap-4 sticky bottom-0 left-0 right-0 z-10 shadow-lg -mx-5 mt-4">
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase">Estimated Total</p>
            <p className="text-lg font-black text-slate-900">${finalPrice.toFixed(2)}</p>
          </div>

          <div className="flex-1 flex justify-end">
            {cartItem ? (
              <div className="flex items-center gap-3.5 bg-slate-900 text-white rounded-2xl px-4 py-3.5 shadow-md">
                <button
                  onClick={() => updateCartQuantity(item.id, cartItem.quantity - 1)}
                  className="p-1 hover:bg-white/10 rounded-lg transition-all cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-bold text-sm w-4 text-center">{cartItem.quantity}</span>
                <button
                  onClick={() => updateCartQuantity(item.id, cartItem.quantity + 1)}
                  className="p-1 hover:bg-white/10 rounded-lg transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => addToCart(item, store, type)}
                className={`w-full max-w-[200px] text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg transition-all cursor-pointer flex justify-center items-center gap-2 ${
                  isFood 
                    ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/20' 
                    : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                }`}
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Add to Cart</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
