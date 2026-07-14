import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RESTAURANTS, GROCERY_STORES, FOOD_CATEGORIES, GROCERY_CATEGORIES } from '../data';
import { 
  Search, MapPin, Bell, ChevronRight, Star, Clock, Sparkles, ShoppingBag, 
  Percent, ArrowRight, Compass, ShieldCheck, TrendingUp, Flame
} from 'lucide-react';
import { motion } from 'motion/react';

export const HomeScreen: React.FC = () => {
  const { 
    user, 
    setScreen, 
    setSelectedRestaurant, 
    setSelectedGroceryStore,
    setSelectedCategory,
    activeOrder,
    cartItemCount 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'food' | 'grocery'>('all');

  const handleRestaurantSelect = (res: typeof RESTAURANTS[0]) => {
    setSelectedRestaurant(res);
    setScreen('restaurants');
  };

  const handleGroceryStoreSelect = (store: typeof GROCERY_STORES[0]) => {
    setSelectedGroceryStore(store);
    setScreen('groceries');
  };

  const handleCategorySelect = (catName: string, type: 'food' | 'grocery') => {
    setSelectedCategory(catName);
    if (type === 'food') {
      // Find a restaurant featuring this or navigate to restaurant category list
      setScreen('categories');
    } else {
      setScreen('categories');
    }
  };

  // Filter restaurants & grocery stores by query
  const filteredRestaurants = RESTAURANTS.filter(
    (r) => 
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGroceries = GROCERY_STORES.filter(
    (g) => g.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="home-screen" className="pb-24 bg-slate-50 min-h-screen text-slate-800 font-sans">
      {/* Dynamic Header */}
      <div className="bg-gradient-to-b from-purple-600 to-indigo-600 text-white pt-6 pb-8 px-5 rounded-b-[2rem] shadow-md">
        <div className="flex justify-between items-start mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-white/15 rounded-full flex items-center justify-center backdrop-blur-md">
              <MapPin className="w-5 h-5 text-yellow-300" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-purple-100 flex items-center gap-1">
                <span>Deliver To</span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              </p>
              <p className="text-sm font-bold truncate max-w-[200px] text-white">
                {user?.address || '102 Pine Street, Apt 4B'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setScreen('profile')} 
              className="w-10 h-10 rounded-full border-2 border-white/20 overflow-hidden shadow-sm bg-purple-100 hover:scale-105 transition-all cursor-pointer flex items-center justify-center text-purple-700 font-bold text-sm"
            >
              {user?.name ? user.name.slice(0, 2).toUpperCase() : 'U'}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mt-2 shadow-lg rounded-2xl overflow-hidden bg-white">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search pizza, grocery stores, burgers..."
            className="w-full bg-white border-none py-3.5 pl-11 pr-4 text-sm font-medium focus:outline-none text-slate-800 placeholder-slate-400"
          />
        </div>
      </div>

      {/* Persistent Order Tracking Notice */}
      {activeOrder && activeOrder.status !== 'delivered' && (
        <div className="px-5 -mt-4 mb-4 z-20 relative">
          <motion.div 
            whileTap={{ scale: 0.98 }}
            onClick={() => setScreen('tracking')}
            className="bg-slate-900 text-white rounded-2xl p-3.5 shadow-xl flex items-center justify-between border border-slate-800 cursor-pointer overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 h-full w-24 bg-gradient-to-l from-purple-500/20 to-transparent pointer-events-none" />
            <div className="flex items-center gap-3">
              <span className="flex h-3.5 w-3.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-purple-50"></span>
              </span>
              <div>
                <p className="text-xs text-purple-400 font-bold uppercase tracking-wider">Active Order Progress</p>
                <p className="text-sm font-bold truncate max-w-[200px]">
                  {activeOrder.storeName} • {activeOrder.status === 'placed' ? 'Placed' : activeOrder.status === 'preparing' ? 'Preparing' : 'On the Way'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-purple-400 bg-purple-500/10 px-2.5 py-1.5 rounded-xl border border-purple-500/20">
              <span>Track</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </motion.div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="px-5 mt-5 space-y-6">
        
        {/* Banner Section */}
        <div className="relative bg-gradient-to-r from-slate-950 to-slate-800 text-white rounded-3xl p-5 shadow-lg overflow-hidden flex justify-between items-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.2),transparent_50%)]" />
          <div className="space-y-2 z-10 max-w-[60%]">
            <div className="inline-flex items-center gap-1 bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-md border border-purple-500/30 text-[10px] font-bold uppercase tracking-wider">
              <Percent className="w-3.5 h-3.5" />
              <span>Flat 50% Off</span>
            </div>
            <h3 className="text-lg font-extrabold leading-tight">First Order Specials</h3>
            <p className="text-xs text-slate-300">Get free delivery and 50% discount on top restaurants.</p>
            <button 
              onClick={() => {
                setSelectedCategory('Burgers');
                setScreen('categories');
              }}
              className="text-xs text-purple-400 font-bold flex items-center gap-1 mt-1 hover:underline cursor-pointer"
            >
              <span>Explore Offers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="relative z-10 w-24 h-24 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 25, ease: 'linear' }}
              className="w-24 h-24 rounded-full border-4 border-dashed border-purple-500/30 flex items-center justify-center p-2 bg-slate-900"
            >
              <img 
                src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&auto=format&fit=crop&q=80" 
                alt="Promo Burger" 
                className="w-20 h-20 object-cover rounded-full"
              />
            </motion.div>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex bg-slate-200/60 p-1 rounded-2xl">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'all' 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            All Deliveries
          </button>
          <button
            onClick={() => setActiveTab('food')}
            className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'food' 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            🍔 Food Delivery
          </button>
          <button
            onClick={() => setActiveTab('grocery')}
            className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'grocery' 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            🥦 Groceries
          </button>
        </div>

        {/* 1. Food Categories Quick List */}
        {activeTab !== 'grocery' && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="text-base font-extrabold flex items-center gap-1.5 text-slate-900">
                <Flame className="w-4.5 h-4.5 text-purple-500" />
                <span>Food Categories</span>
              </h4>
              <button 
                onClick={() => setScreen('categories')} 
                className="text-xs font-bold text-purple-600 hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {FOOD_CATEGORIES.slice(0, 3).map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.name, 'food')}
                  className="bg-white p-3 rounded-2xl border border-slate-100 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
                >
                  <div className="w-14 h-14 rounded-full overflow-hidden mb-2 bg-slate-100 border-2 border-slate-50 group-hover:scale-105 transition-all">
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-xs font-bold text-slate-800">{cat.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. Grocery Categories Quick List */}
        {activeTab !== 'food' && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="text-base font-extrabold flex items-center gap-1.5 text-slate-900">
                <TrendingUp className="w-4.5 h-4.5 text-emerald-600" />
                <span>Fresh Grocery Categories</span>
              </h4>
              <button 
                onClick={() => {
                  setSelectedCategory('Fresh Fruits');
                  setScreen('categories');
                }} 
                className="text-xs font-bold text-purple-600 hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {GROCERY_CATEGORIES.slice(0, 3).map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.name, 'grocery')}
                  className="bg-white p-3 rounded-2xl border border-slate-100 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
                >
                  <div className="w-14 h-14 rounded-full overflow-hidden mb-2 bg-slate-100 border-2 border-slate-50 group-hover:scale-105 transition-all">
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-xs font-bold text-slate-800">{cat.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. Popular Restaurants Section */}
        {activeTab !== 'grocery' && (
          <div className="space-y-3.5">
            <div className="flex justify-between items-center">
              <h4 className="text-base font-extrabold flex items-center gap-1.5 text-slate-900">
                <Sparkles className="w-4.5 h-4.5 text-amber-500" />
                <span>Hot Restaurants Near You</span>
              </h4>
            </div>

            <div className="space-y-4">
              {filteredRestaurants.map((res) => (
                <div
                  key={res.id}
                  onClick={() => handleRestaurantSelect(res)}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row"
                >
                  {/* Store Image */}
                  <div className="relative h-40 sm:h-auto sm:w-40 bg-slate-100 shrink-0">
                    <img src={res.image} alt={res.name} className="w-full h-full object-cover" />
                    {res.isPromoted && (
                      <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-[9px] font-bold tracking-wider uppercase">
                        PROMOTED
                      </span>
                    )}
                  </div>

                  {/* Store Details */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h5 className="font-extrabold text-slate-900 text-base">{res.name}</h5>
                        <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          <span className="text-[11px] font-bold text-amber-900">{res.rating}</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{res.cuisine}</p>
                    </div>

                    <div className="flex items-center gap-4 mt-3 border-t border-slate-50 pt-2.5 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{res.deliveryTime}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Min. ${res.minOrder}</span>
                      </div>
                      <div className="font-bold text-purple-600">
                        {res.deliveryFee === 0 ? 'Free Delivery' : `$${res.deliveryFee} delivery`}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Grocery Stores Section */}
        {activeTab !== 'food' && (
          <div className="space-y-3.5">
            <div className="flex justify-between items-center">
              <h4 className="text-base font-extrabold flex items-center gap-1.5 text-slate-900">
                <ShieldCheck className="w-4.5 h-4.5 text-emerald-600" />
                <span>Super Grocery Outlets</span>
              </h4>
            </div>

            <div className="space-y-4">
              {filteredGroceries.map((store) => (
                <div
                  key={store.id}
                  onClick={() => handleGroceryStoreSelect(store)}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row"
                >
                  {/* Store Image */}
                  <div className="relative h-40 sm:h-auto sm:w-40 bg-slate-100 shrink-0">
                    <img src={store.image} alt={store.name} className="w-full h-full object-cover" />
                  </div>

                  {/* Store Details */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h5 className="font-extrabold text-slate-900 text-base">{store.name}</h5>
                        <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg">
                          <Star className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
                          <span className="text-[11px] font-bold text-emerald-900">{store.rating}</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Categories: <span className="font-semibold text-slate-600">{store.categories.join(', ')}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-4 mt-3 border-t border-slate-50 pt-2.5 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{store.deliveryTime}</span>
                      </div>
                      <div className="font-bold text-emerald-600">
                        {store.deliveryFee === 0 ? 'Free Delivery' : `$${store.deliveryFee} Delivery`}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
