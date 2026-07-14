import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Star, Clock, ShoppingBag, Plus, Minus, Search } from 'lucide-react';

export const RestaurantDetailScreen: React.FC = () => {
  const { selectedRestaurant, cart, addToCart, updateCartQuantity, setScreen, setSelectedProduct, goBack } = useApp();

  if (!selectedRestaurant) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-500">
        <p className="font-semibold mb-4">No Restaurant Selected</p>
        <button onClick={goBack} className="bg-purple-600 text-white font-bold px-4 py-2 rounded-xl">
          Go Back
        </button>
      </div>
    );
  }

  const handleProductClick = (dish: typeof selectedRestaurant.featuredDishes[0]) => {
    setSelectedProduct({ item: dish, store: selectedRestaurant, type: 'food' });
    setScreen('product-details');
  };

  return (
    <div id="restaurant-detail-screen" className="pb-24 bg-slate-50 min-h-screen text-slate-800 font-sans">
      {/* Cover Image banner */}
      <div className="relative h-56 w-full bg-slate-100">
        <img src={selectedRestaurant.image} alt={selectedRestaurant.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-900/30" />

        <button 
          onClick={goBack} 
          className="absolute top-5 left-5 w-10 h-10 bg-white/95 hover:bg-white rounded-full flex items-center justify-center text-slate-700 shadow cursor-pointer transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Floating title block */}
        <div className="absolute bottom-5 left-5 right-5 text-white">
          <h1 className="text-xl font-black drop-shadow tracking-tight">{selectedRestaurant.name}</h1>
          <p className="text-xs text-slate-200 drop-shadow mt-0.5">{selectedRestaurant.cuisine}</p>
        </div>
      </div>

      {/* Stats row info */}
      <div className="bg-white p-4 border-b border-slate-100 shadow-sm flex justify-around text-xs font-semibold text-slate-500 text-center">
        <div className="space-y-1">
          <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg text-amber-900">
            <Star className="w-3.5 h-3.5 fill-amber-500 stroke-none" />
            <span className="font-extrabold">{selectedRestaurant.rating}</span>
          </div>
          <p className="text-[10px] text-slate-400 uppercase">Reviews ({selectedRestaurant.reviewsCount})</p>
        </div>

        <div className="space-y-1 border-x border-slate-100 px-8">
          <p className="text-slate-800 font-black text-sm">{selectedRestaurant.deliveryTime}</p>
          <p className="text-[10px] text-slate-400 uppercase">Duration</p>
        </div>

        <div className="space-y-1">
          <p className="text-purple-600 font-black text-sm">
            {selectedRestaurant.deliveryFee === 0 ? 'Free' : `$${selectedRestaurant.deliveryFee}`}
          </p>
          <p className="text-[10px] text-slate-400 uppercase">Delivery fee</p>
        </div>
      </div>

      {/* Menu list */}
      <div className="p-5 space-y-4">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">House Specialties Menu</h3>

        <div className="space-y-4">
          {selectedRestaurant.featuredDishes.map((dish) => {
            const cartItem = cart.find((ci) => ci.id === dish.id);
            return (
              <div
                key={dish.id}
                className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex gap-4 hover:shadow-md transition-all"
              >
                {/* Dish Photo */}
                <div 
                  onClick={() => handleProductClick(dish)}
                  className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 shrink-0 cursor-pointer"
                >
                  <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
                </div>

                {/* Dish Info */}
                <div className="flex-1 flex flex-col justify-between overflow-hidden">
                  <div onClick={() => handleProductClick(dish)} className="cursor-pointer">
                    <div className="flex justify-between items-start gap-1">
                      <h4 className="font-extrabold text-slate-950 text-sm truncate">{dish.name}</h4>
                      <span className="text-xs font-extrabold text-purple-600 shrink-0">${dish.price}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{dish.description}</p>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-50">
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase">
                      {dish.isVeg ? (
                        <span className="text-green-600 font-extrabold">🟢 VEG</span>
                      ) : (
                        <span className="text-red-500 font-extrabold">🔴 NON-VEG</span>
                      )}
                    </div>

                    {/* Quantity selectors */}
                    {cartItem ? (
                      <div className="flex items-center gap-2 bg-purple-50 border border-purple-200 rounded-xl px-2 py-1">
                        <button
                          onClick={() => updateCartQuantity(dish.id, cartItem.quantity - 1)}
                          className="p-1 hover:bg-white rounded-lg text-purple-600 cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-purple-900 w-4 text-center">{cartItem.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(dish.id, cartItem.quantity + 1)}
                          className="p-1 hover:bg-white rounded-lg text-purple-600 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(dish, selectedRestaurant, 'food')}
                        className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 cursor-pointer transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
