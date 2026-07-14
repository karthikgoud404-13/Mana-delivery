import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FOOD_CATEGORIES, GROCERY_CATEGORIES, RESTAURANTS, GROCERY_STORES } from '../data';
import { ArrowLeft, ChevronRight, Star, ShoppingBag, Search, Plus, Minus } from 'lucide-react';
import { FoodItem, GroceryItem, Restaurant, GroceryStore } from '../types';

export const CategoriesScreen: React.FC = () => {
  const { 
    selectedCategory, 
    setSelectedCategory, 
    goBack, 
    addToCart, 
    cart, 
    updateCartQuantity,
    setSelectedProduct,
    setScreen 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'food' | 'grocery'>(
    selectedCategory && GROCERY_CATEGORIES.some(c => c.name === selectedCategory) ? 'grocery' : 'food'
  );
  
  const [searchQuery, setSearchQuery] = useState('');

  // Find all items matching the category or filter by search query
  const getMatchingFoodItems = () => {
    let items: { item: FoodItem; restaurant: Restaurant }[] = [];
    RESTAURANTS.forEach((r) => {
      r.featuredDishes.forEach((dish) => {
        const matchesCategory = !selectedCategory || dish.category.toLowerCase() === selectedCategory.toLowerCase();
        const matchesSearch = dish.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              dish.description.toLowerCase().includes(searchQuery.toLowerCase());
        
        if (matchesCategory && matchesSearch) {
          items.push({ item: dish, restaurant: r });
        }
      });
    });
    return items;
  };

  const getMatchingGroceryItems = () => {
    let items: { item: GroceryItem; store: GroceryStore }[] = [];
    GROCERY_STORES.forEach((store) => {
      store.items.forEach((gitem) => {
        const matchesCategory = !selectedCategory || gitem.category.toLowerCase() === selectedCategory.toLowerCase();
        const matchesSearch = gitem.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              gitem.description.toLowerCase().includes(searchQuery.toLowerCase());
        
        if (matchesCategory && matchesSearch) {
          items.push({ item: gitem, store: store });
        }
      });
    });
    return items;
  };

  const foodItems = getMatchingFoodItems();
  const groceryItems = getMatchingGroceryItems();

  const handleProductClick = (item: FoodItem | GroceryItem, store: Restaurant | GroceryStore, type: 'food' | 'grocery') => {
    setSelectedProduct({ item, store, type });
    setScreen('product-details');
  };

  return (
    <div id="categories-screen" className="pb-24 bg-slate-50 min-h-screen text-slate-800 font-sans">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-5 py-4 flex items-center gap-3 sticky top-0 z-30 shadow-sm">
        <button 
          onClick={goBack} 
          className="p-1.5 hover:bg-slate-100 rounded-full text-slate-600 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h2 className="text-lg font-extrabold text-slate-900 truncate">
            {selectedCategory ? `${selectedCategory}` : 'Categories Catalog'}
          </h2>
          <p className="text-xs text-slate-500">
            {activeTab === 'food' ? `${foodItems.length} delicacies found` : `${groceryItems.length} products found`}
          </p>
        </div>
        {selectedCategory && (
          <button 
            onClick={() => setSelectedCategory(null)}
            className="text-xs font-bold text-purple-600 bg-purple-50 px-2.5 py-1.5 rounded-xl cursor-pointer"
          >
            Clear Filter
          </button>
        )}
      </div>

      {/* Main Container */}
      <div className="p-5 space-y-5">
        {/* Search */}
        <div className="relative shadow-sm rounded-2xl bg-white border border-slate-200/80">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search within ${selectedCategory || 'all items'}...`}
            className="w-full bg-transparent border-none py-3.5 pl-11 pr-4 text-sm font-medium focus:outline-none text-slate-800"
          />
        </div>

        {/* Category Pill Sliders if selectedCategory is empty */}
        {!selectedCategory && (
          <div className="space-y-4">
            {/* Catalog tab selector */}
            <div className="flex bg-slate-200/50 p-1 rounded-2xl">
              <button
                onClick={() => setActiveTab('food')}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  activeTab === 'food' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
                }`}
              >
                🍔 Food Menus
              </button>
              <button
                onClick={() => setActiveTab('grocery')}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  activeTab === 'grocery' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
                }`}
              >
                🥦 Groceries & Essentials
              </button>
            </div>

            {/* Render categories grid based on active tab */}
            <div className="grid grid-cols-2 gap-3">
              {(activeTab === 'food' ? FOOD_CATEGORIES : GROCERY_CATEGORIES).map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.name);
                    setActiveTab(cat.type);
                  }}
                  className="bg-white p-3.5 rounded-2xl border border-slate-100 flex items-center gap-3 shadow-sm hover:shadow-md cursor-pointer transition-all"
                >
                  <img src={cat.image} alt={cat.name} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                  <div className="overflow-hidden">
                    <p className="text-xs font-extrabold text-slate-900 truncate">{cat.name}</p>
                    <p className="text-[10px] text-slate-400 capitalize">{cat.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Items Listing */}
        <div className="space-y-4">
          <h3 className="text-sm font-extrabold text-slate-500 uppercase tracking-wider">
            {selectedCategory ? `Items under "${selectedCategory}"` : 'Recommended Products'}
          </h3>

          {activeTab === 'food' ? (
            <div className="grid grid-cols-1 gap-4">
              {foodItems.length > 0 ? (
                foodItems.map(({ item, restaurant }) => {
                  const cartItem = cart.find((ci) => ci.id === item.id);
                  return (
                    <div
                      key={item.id}
                      className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex gap-4"
                    >
                      <div 
                        onClick={() => handleProductClick(item, restaurant, 'food')}
                        className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-50 shrink-0 cursor-pointer"
                      >
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>

                      <div className="flex-1 flex flex-col justify-between overflow-hidden">
                        <div onClick={() => handleProductClick(item, restaurant, 'food')} className="cursor-pointer">
                          <div className="flex justify-between items-start gap-1">
                            <h4 className="font-extrabold text-slate-900 text-sm truncate">{item.name}</h4>
                            <span className="text-xs font-extrabold text-purple-600 shrink-0">${item.price}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{item.description}</p>
                          <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wide">
                            From: {restaurant.name}
                          </p>
                        </div>

                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-50">
                          <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                            <span className="text-xs font-bold text-slate-600">{item.rating}</span>
                          </div>

                          {/* Add to Cart Actions */}
                          {cartItem ? (
                            <div className="flex items-center gap-2 bg-purple-50 border border-purple-200 rounded-xl px-2 py-1">
                              <button
                                onClick={() => updateCartQuantity(item.id, cartItem.quantity - 1)}
                                className="p-1 hover:bg-white rounded-lg text-purple-600 cursor-pointer transition-all"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-bold text-purple-900 w-4 text-center">{cartItem.quantity}</span>
                              <button
                                onClick={() => updateCartQuantity(item.id, cartItem.quantity + 1)}
                                className="p-1 hover:bg-white rounded-lg text-purple-600 cursor-pointer transition-all"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => addToCart(item, restaurant, 'food')}
                              className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 cursor-pointer transition-all"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add to Cart</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-10 bg-white rounded-3xl border border-slate-100 p-6">
                  <p className="text-slate-400 text-sm font-medium">No delicacies found matching your selection.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {groceryItems.length > 0 ? (
                groceryItems.map(({ item, store }) => {
                  const cartItem = cart.find((ci) => ci.id === item.id);
                  return (
                    <div
                      key={item.id}
                      className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex gap-4"
                    >
                      <div 
                        onClick={() => handleProductClick(item, store, 'grocery')}
                        className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-50 shrink-0 cursor-pointer"
                      >
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>

                      <div className="flex-1 flex flex-col justify-between overflow-hidden">
                        <div onClick={() => handleProductClick(item, store, 'grocery')} className="cursor-pointer">
                          <div className="flex justify-between items-start gap-1">
                            <h4 className="font-extrabold text-slate-900 text-sm truncate">{item.name}</h4>
                            <span className="text-xs font-extrabold text-emerald-600 shrink-0">${item.price}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{item.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="bg-slate-100 text-slate-600 text-[9px] px-1.5 py-0.5 rounded-md font-medium">
                              {item.unit}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                              Store: {store.name}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-50">
                          <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                            <span className="text-xs font-bold text-slate-600">{item.rating}</span>
                          </div>

                          {/* Add to Cart Actions */}
                          {cartItem ? (
                            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-2 py-1">
                              <button
                                onClick={() => updateCartQuantity(item.id, cartItem.quantity - 1)}
                                className="p-1 hover:bg-white rounded-lg text-emerald-600 cursor-pointer transition-all"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-bold text-emerald-900 w-4 text-center">{cartItem.quantity}</span>
                              <button
                                onClick={() => updateCartQuantity(item.id, cartItem.quantity + 1)}
                                className="p-1 hover:bg-white rounded-lg text-emerald-600 cursor-pointer transition-all"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => addToCart(item, store, 'grocery')}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 cursor-pointer transition-all"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add to Cart</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-10 bg-white rounded-3xl border border-slate-100 p-6">
                  <p className="text-slate-400 text-sm font-medium">No grocery products found matching your selection.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
