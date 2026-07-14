import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RESTAURANTS } from '../data';
import { ArrowLeft, Star, Clock, ShoppingBag, Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

export const RestaurantListScreen: React.FC = () => {
  const { setScreen, setSelectedRestaurant, goBack } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'time' | 'fee'>('rating');
  const [filterVeg, setFilterVeg] = useState(false);

  const handleRestaurantSelect = (res: typeof RESTAURANTS[0]) => {
    setSelectedRestaurant(res);
    setScreen('restaurants');
  };

  // Cuisine tags helper
  const allCuisines = Array.from(
    new Set(RESTAURANTS.flatMap((r) => r.cuisine.split(', ')))
  );
  const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);

  const processedRestaurants = RESTAURANTS.filter((r) => {
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.cuisine.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCuisine = !selectedCuisine || r.cuisine.includes(selectedCuisine);
    const matchesVeg = !filterVeg || r.isVeg;
    return matchesSearch && matchesCuisine && matchesVeg;
  }).sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'time') return parseInt(a.deliveryTime) - parseInt(b.deliveryTime);
    if (sortBy === 'fee') return a.deliveryFee - b.deliveryFee;
    return 0;
  });

  return (
    <div id="restaurant-list-screen" className="pb-24 bg-slate-50 min-h-screen text-slate-800 font-sans">
      {/* Top sticky header */}
      <div className="bg-white border-b border-slate-100 px-5 py-4 sticky top-0 z-30 shadow-sm space-y-3">
        <div className="flex items-center gap-3">
          <button 
            onClick={goBack} 
            className="p-1.5 hover:bg-slate-100 rounded-full text-slate-600 cursor-pointer transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Food Delivery</h2>
            <p className="text-xs text-slate-500">Premium restaurants at your fingertips</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative rounded-2xl bg-slate-50 border border-slate-200">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4.5 h-4.5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search restaurants, dishes, cuisines..."
            className="w-full bg-transparent border-none py-3 pl-11 pr-4 text-xs font-semibold focus:outline-none text-slate-800"
          />
        </div>

        {/* Horizontal Cuisine Filter pills */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1 shrink-0">
          <button
            onClick={() => setSelectedCuisine(null)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
              selectedCuisine === null 
                ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/20' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Cuisines
          </button>
          {allCuisines.map((cuisine) => (
            <button
              key={cuisine}
              onClick={() => setSelectedCuisine(cuisine)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                selectedCuisine === cuisine 
                  ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/20' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cuisine}
            </button>
          ))}
        </div>
      </div>

      {/* Filter and Sorting Header bar */}
      <div className="px-5 py-4 flex flex-wrap gap-3 items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterVeg(!filterVeg)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer transition-all flex items-center gap-1.5 ${
              filterVeg 
                ? 'bg-green-50 border-green-300 text-green-700' 
                : 'bg-white border-slate-200 text-slate-600'
            }`}
          >
            <span className={`w-2.5 h-2.5 rounded-full ${filterVeg ? 'bg-green-600 animate-pulse' : 'bg-slate-300'}`} />
            <span>Veg Only</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
          <ArrowUpDown className="w-3.5 h-3.5" />
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-transparent border-none text-slate-700 focus:outline-none font-bold cursor-pointer pr-1"
          >
            <option value="rating">Top Rated</option>
            <option value="time">Delivery Time</option>
            <option value="fee">Low Delivery Fee</option>
          </select>
        </div>
      </div>

      {/* Restaurants List container */}
      <div className="px-5 space-y-4">
        {processedRestaurants.length > 0 ? (
          processedRestaurants.map((res) => (
            <div
              key={res.id}
              onClick={() => handleRestaurantSelect(res)}
              className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md cursor-pointer transition-all group"
            >
              <div className="relative h-44 bg-slate-100">
                <img 
                  src={res.image} 
                  alt={res.name} 
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
                
                {/* Veg Tag */}
                {res.isVeg && (
                  <span className="absolute top-4 left-4 bg-green-600 text-white px-2 py-0.5 rounded-lg text-[9px] font-bold tracking-wider">
                    VEG ONLY
                  </span>
                )}

                {/* Rating overlay */}
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end text-white">
                  <div>
                    <h3 className="font-extrabold text-lg drop-shadow">{res.name}</h3>
                    <p className="text-xs text-slate-200 drop-shadow line-clamp-1">{res.cuisine}</p>
                  </div>
                  <div className="bg-amber-400 text-slate-950 px-2 py-1 rounded-xl flex items-center gap-1 shadow-lg shrink-0">
                    <Star className="w-3.5 h-3.5 fill-slate-950 stroke-none" />
                    <span className="text-xs font-extrabold">{res.rating}</span>
                  </div>
                </div>
              </div>

              {/* Delivery stats details */}
              <div className="p-4 flex items-center justify-between text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>{res.deliveryTime}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4 text-slate-400" />
                  <span>Min. Order ${res.minOrder}</span>
                </div>
                <div className="font-bold text-purple-600">
                  {res.deliveryFee === 0 ? 'Free Delivery' : `$${res.deliveryFee} delivery`}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-100 p-6">
            <p className="text-slate-400 text-sm font-medium">No restaurants found matching your preference.</p>
          </div>
        )}
      </div>
    </div>
  );
};
