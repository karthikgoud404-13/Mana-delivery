import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GROCERY_STORES } from '../data';
import { ArrowLeft, Star, Clock, Search, SlidersHorizontal, Plus, Minus, ArrowRight } from 'lucide-react';
import { GroceryItem, GroceryStore } from '../types';

export const GroceryListScreen: React.FC = () => {
  const { setScreen, setSelectedGroceryStore, goBack, cart, addToCart, updateCartQuantity } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStore, setSelectedStore] = useState<GroceryStore | null>(null);

  const handleStoreSelect = (store: GroceryStore) => {
    setSelectedGroceryStore(store);
    setSelectedStore(store);
  };

  const activeStoreList = selectedStore ? [selectedStore] : GROCERY_STORES;

  return (
    <div id="grocery-list-screen" className="pb-24 bg-slate-50 min-h-screen text-slate-800 font-sans">
      {/* Sticky Header */}
      <div className="bg-white border-b border-slate-100 px-5 py-4 sticky top-0 z-30 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={goBack} 
              className="p-1.5 hover:bg-slate-100 rounded-full text-slate-600 cursor-pointer transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Blinkit Groceries</h2>
              <p className="text-xs text-slate-500">Delivered in 10-15 minutes max</p>
            </div>
          </div>

          {selectedStore && (
            <button 
              onClick={() => setSelectedStore(null)}
              className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg cursor-pointer"
            >
              All Stores
            </button>
          )}
        </div>

        {/* Search Input */}
        <div className="relative rounded-2xl bg-slate-50 border border-slate-200">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4.5 h-4.5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search groceries, milk, fruits, household..."
            className="w-full bg-transparent border-none py-3 pl-11 pr-4 text-xs font-semibold focus:outline-none text-slate-800"
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-5 space-y-6">
        
        {/* Stores Horizontal Selector if viewing all stores */}
        {!selectedStore && (
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Select Grocery Partner</h3>
            <div className="flex gap-3 overflow-x-auto no-scrollbar py-1">
              {GROCERY_STORES.map((store) => (
                <div
                  key={store.id}
                  onClick={() => handleStoreSelect(store)}
                  className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm shrink-0 w-44 flex items-center gap-3 cursor-pointer hover:border-emerald-500 hover:shadow transition-all"
                >
                  <img src={store.image} alt={store.name} className="w-12 h-12 rounded-xl object-cover" />
                  <div className="overflow-hidden">
                    <p className="text-xs font-extrabold text-slate-900 truncate">{store.name}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span className="text-[10px] font-bold text-slate-600">{store.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Catalog List grouped by Active Stores */}
        <div className="space-y-6">
          {activeStoreList.map((store) => {
            // Filter store items matching search query
            const filteredItems = store.items.filter((item) =>
              item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.category.toLowerCase().includes(searchQuery.toLowerCase())
            );

            if (filteredItems.length === 0) return null;

            return (
              <div key={store.id} className="space-y-4">
                {/* Store Header bar */}
                <div className="flex justify-between items-center bg-slate-100/75 p-3 rounded-2xl border border-slate-200/50">
                  <div className="flex items-center gap-2.5">
                    <img src={store.image} alt={store.name} className="w-8 h-8 rounded-lg object-cover" />
                    <div>
                      <h4 className="font-extrabold text-xs text-slate-900">{store.name}</h4>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 font-semibold">
                        <span className="flex items-center gap-0.5">
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                          {store.rating}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5">
                          <Clock className="w-3 h-3" />
                          {store.deliveryTime}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedGroceryStore(store);
                      setScreen('groceries');
                    }}
                    className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 cursor-pointer hover:underline"
                  >
                    <span>Store Page</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Grid of grocery catalog items */}
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
                          onClick={() => {
                            setSelectedGroceryStore(store);
                            setScreen('groceries');
                          }}
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
                              onClick={() => addToCart(item, store, 'grocery')}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-2.5 py-1.5 rounded-xl cursor-pointer flex items-center gap-0.5 transition-all"
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
            );
          })}
        </div>

      </div>
    </div>
  );
};
