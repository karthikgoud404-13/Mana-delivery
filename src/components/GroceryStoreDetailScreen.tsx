import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Star, Clock, ShoppingBag, Plus, Minus, ShieldCheck } from 'lucide-react';

export const GroceryStoreDetailScreen: React.FC = () => {
  const { selectedGroceryStore, cart, addToCart, updateCartQuantity, setScreen, setSelectedProduct, goBack } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  if (!selectedGroceryStore) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-500">
        <p className="font-semibold mb-4">No Grocery Store Selected</p>
        <button onClick={goBack} className="bg-emerald-600 text-white font-bold px-4 py-2 rounded-xl">
          Go Back
        </button>
      </div>
    );
  }

  const handleProductClick = (item: typeof selectedGroceryStore.items[0]) => {
    setSelectedProduct({ item: item, store: selectedGroceryStore, type: 'grocery' });
    setScreen('product-details');
  };

  const filteredItems = selectedCategory
    ? selectedGroceryStore.items.filter((i) => i.category === selectedCategory)
    : selectedGroceryStore.items;

  return (
    <div id="grocery-store-detail-screen" className="pb-24 bg-slate-50 min-h-screen text-slate-800 font-sans">
      {/* Cover image banner */}
      <div className="relative h-52 w-full bg-slate-100">
        <img src={selectedGroceryStore.image} alt={selectedGroceryStore.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-900/30" />

        <button 
          onClick={goBack} 
          className="absolute top-5 left-5 w-10 h-10 bg-white/95 hover:bg-white rounded-full flex items-center justify-center text-slate-700 shadow cursor-pointer transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Floating title block */}
        <div className="absolute bottom-5 left-5 right-5 text-white">
          <h1 className="text-xl font-black drop-shadow tracking-tight">{selectedGroceryStore.name}</h1>
          <p className="text-xs text-slate-200 drop-shadow mt-0.5">Express delivery under 10 minutes</p>
        </div>
      </div>

      {/* Stats row info */}
      <div className="bg-white p-3.5 border-b border-slate-100 shadow-sm flex justify-around text-xs font-semibold text-slate-500 text-center">
        <div className="space-y-1">
          <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg text-emerald-900 mx-auto w-fit">
            <Star className="w-3.5 h-3.5 fill-emerald-600 stroke-none" />
            <span className="font-extrabold">{selectedGroceryStore.rating}</span>
          </div>
          <p className="text-[10px] text-slate-400 uppercase">Reviews</p>
        </div>

        <div className="space-y-1 border-x border-slate-100 px-10">
          <p className="text-slate-800 font-black text-sm">{selectedGroceryStore.deliveryTime}</p>
          <p className="text-[10px] text-slate-400 uppercase">Duration</p>
        </div>

        <div className="space-y-1">
          <p className="text-emerald-600 font-black text-sm">
            {selectedGroceryStore.deliveryFee === 0 ? 'Free' : `$${selectedGroceryStore.deliveryFee}`}
          </p>
          <p className="text-[10px] text-slate-400 uppercase">Delivery fee</p>
        </div>
      </div>

      {/* Category selector slider */}
      <div className="p-5 pb-1 space-y-3">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Browse Store Aisles</h3>
        
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
              selectedCategory === null 
                ? 'bg-emerald-600 text-white shadow-sm' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Aisles
          </button>
          {selectedGroceryStore.categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                selectedCategory === cat 
                  ? 'bg-emerald-600 text-white shadow-sm' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Items list */}
      <div className="p-5 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {filteredItems.map((item) => {
            const cartItem = cart.find((ci) => ci.id === item.id);
            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-3 border border-slate-100 shadow-sm flex flex-col justify-between"
              >
                {/* Image + Info */}
                <div 
                  onClick={() => handleProductClick(item)}
                  className="space-y-2.5 cursor-pointer"
                >
                  <div className="h-28 rounded-2xl overflow-hidden bg-slate-50 relative">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    {item.isPopular && (
                      <span className="absolute top-2 left-2 bg-emerald-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-md">
                        BESTSELLER
                      </span>
                    )}
                  </div>

                  <div>
                    <h5 className="font-extrabold text-slate-900 text-xs line-clamp-2 min-h-[2rem] leading-tight">
                      {item.name}
                    </h5>
                    <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wide">{item.unit}</p>
                  </div>
                </div>

                {/* Pricing & Add to Cart */}
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-50">
                  <div>
                    <p className="text-xs font-extrabold text-emerald-600">${item.price}</p>
                    <p className="text-[9px] text-slate-400">Stock: {item.stock}</p>
                  </div>

                  {cartItem ? (
                    <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-xl px-2 py-1">
                      <button
                        onClick={() => updateCartQuantity(item.id, cartItem.quantity - 1)}
                        className="p-0.5 hover:bg-white rounded-md text-emerald-600 cursor-pointer transition-all"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-emerald-950 w-3.5 text-center">{cartItem.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.id, cartItem.quantity + 1)}
                        className="p-0.5 hover:bg-white rounded-md text-emerald-600 cursor-pointer transition-all"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(item, selectedGroceryStore, 'grocery')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer flex items-center gap-0.5 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
