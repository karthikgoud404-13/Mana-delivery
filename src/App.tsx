import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { SplashScreen } from './components/SplashScreen';
import { LoginScreen } from './components/LoginScreen';
import { HomeScreen } from './components/HomeScreen';
import { CategoriesScreen } from './components/CategoriesScreen';
import { RestaurantListScreen } from './components/RestaurantListScreen';
import { GroceryListScreen } from './components/GroceryListScreen';
import { RestaurantDetailScreen } from './components/RestaurantDetailScreen';
import { GroceryStoreDetailScreen } from './components/GroceryStoreDetailScreen';
import { ProductDetailsScreen } from './components/ProductDetailsScreen';
import { CartScreen } from './components/CartScreen';
import { CheckoutScreen } from './components/CheckoutScreen';
import { OrderTrackingScreen } from './components/OrderTrackingScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { OrderHistoryScreen } from './components/OrderHistoryScreen';

import { Home, Grid, ClipboardList, User, ShoppingBag, Clock } from 'lucide-react';

const MainLayoutRouter: React.FC = () => {
  const { currentScreen, setScreen, cart, activeOrder } = useApp();

  const renderActiveScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen />;
      case 'login':
        return <LoginScreen />;
      case 'home':
        return <HomeScreen />;
      case 'categories':
        return <CategoriesScreen />;
      case 'restaurants':
        return <RestaurantDetailScreen />;
      case 'groceries':
        return <GroceryStoreDetailScreen />;
      case 'restaurant-list':
        return <RestaurantListScreen />;
      case 'grocery-list':
        return <GroceryListScreen />;
      case 'product-details':
        return <ProductDetailsScreen />;
      case 'cart':
        return <CartScreen />;
      case 'checkout':
        return <CheckoutScreen />;
      case 'tracking':
        return <OrderTrackingScreen />;
      case 'profile':
        return <ProfileScreen />;
      case 'order-history':
        return <OrderHistoryScreen />;
      default:
        return <HomeScreen />;
    }
  };

  const showBottomNav = !['splash', 'login'].includes(currentScreen);

  return (
    <div className="min-h-screen bg-slate-900 flex justify-center items-center py-0 sm:py-6 selection:bg-purple-500/30 selection:text-purple-950">
      {/* Mobile-Frame Wrapper Constraint */}
      <div className="w-full max-w-md bg-white min-h-screen sm:min-h-[850px] sm:max-h-[890px] sm:rounded-[40px] shadow-2xl relative flex flex-col overflow-hidden border border-slate-800/10">
        
        {/* Dynamic Inner Screen Wrapper */}
        <div className="flex-1 overflow-y-auto no-scrollbar pb-16">
          {renderActiveScreen()}
        </div>

        {/* Dynamic Sticky Bottom Nav Bar */}
        {showBottomNav && (
          <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-100 px-6 py-2.5 flex justify-between items-center z-40 rounded-t-3xl sm:rounded-b-[40px] shadow-[0_-5px_25px_rgba(0,0,0,0.03)]">
            
            <button
              onClick={() => setScreen('home')}
              className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
                currentScreen === 'home' ? 'text-purple-600 scale-105 font-extrabold' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-[10px]">Home</span>
            </button>

            <button
              onClick={() => setScreen('categories')}
              className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
                currentScreen === 'categories' ? 'text-purple-600 scale-105 font-extrabold' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Grid className="w-5 h-5" />
              <span className="text-[10px]">Explore</span>
            </button>

            {/* Float cart bubble in mid nav bar */}
            <button
              onClick={() => setScreen('cart')}
              className={`relative flex flex-col items-center gap-1 cursor-pointer transition-all ${
                currentScreen === 'cart' ? 'text-purple-600 scale-105 font-extrabold' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5" />
                {cart.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-purple-600 text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </div>
              <span className="text-[10px]">Cart</span>
            </button>

            <button
              onClick={() => setScreen('order-history')}
              className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
                currentScreen === 'order-history' ? 'text-purple-600 scale-105 font-extrabold' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div className="relative">
                <ClipboardList className="w-5 h-5" />
                {activeOrder && activeOrder.status !== 'delivered' && activeOrder.status !== 'cancelled' && (
                  <span className="absolute -top-1 -right-1 bg-blue-500 rounded-full w-2.5 h-2.5 border border-white animate-ping" />
                )}
              </div>
              <span className="text-[10px]">Orders</span>
            </button>

            <button
              onClick={() => setScreen('profile')}
              className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
                currentScreen === 'profile' ? 'text-purple-600 scale-105 font-extrabold' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <User className="w-5 h-5" />
              <span className="text-[10px]">Profile</span>
            </button>

          </div>
        )}

      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayoutRouter />
    </AppProvider>
  );
}
