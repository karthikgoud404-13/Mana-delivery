import React from 'react';
import { useApp } from '../context/AppContext';
import { Order } from '../types';
import { ArrowLeft, RefreshCw, ShoppingBag, Calendar, CheckCircle2, XCircle, Clock } from 'lucide-react';

export const OrderHistoryScreen: React.FC = () => {
  const { orders, addToCart, setScreen, goBack, cart } = useApp();

  const handleReorder = (order: Order) => {
    // Copy all previous items into current cart
    // Wait, the context addToCart supports adding single items. Let's simulate reorder by clearing & inserting items.
    order.items.forEach((item) => {
      // Find matching items or just add directly since cart item structure matches
      // Let's add them to cart. Since our context cart uses simple state, we can add them.
      // Wait, we can use context's addToCart!
      // But since we are copying, we can just run a simple loop or use context triggers
      // Wait, let's see how our Context addToCart acts:
      // addToCart(item, store, type)
      // Since we already have the complete CartItem structure, we can map it.
      // Let's look at /src/context/AppContext.tsx.
      // Yes, addToCart is: `addToCart(item: FoodItem | GroceryItem, store: Restaurant | GroceryStore, type: 'food' | 'grocery')`
      // We can mock this or just call a simple loop.
      // Let's just run addToCart on each! Or we can trigger a message.
      // Let's call addToCart. For simplicity, we can pass the items.
      addToCart(
        {
          id: item.id,
          name: item.name,
          price: item.price,
          description: '',
          image: item.image,
          category: '',
          rating: 4.8,
        } as any,
        { id: item.storeId, name: item.storeName } as any,
        item.type
      );
    });
    setScreen('cart');
  };

  return (
    <div id="order-history-screen" className="pb-24 bg-slate-50 min-h-screen text-slate-800 font-sans">
      {/* Sticky Header */}
      <div className="bg-white border-b border-slate-100 px-5 py-4 sticky top-0 z-30 shadow-sm flex items-center gap-3">
        <button 
          onClick={goBack} 
          className="p-1.5 hover:bg-slate-100 rounded-full text-slate-600 cursor-pointer transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-lg font-extrabold text-slate-900">Order History</h2>
          <p className="text-xs text-slate-500">Your past culinary & grocery runs</p>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm space-y-4"
            >
              {/* Card Title Block */}
              <div className="flex justify-between items-start border-b border-slate-50 pb-3">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-950">{order.storeName}</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5 mt-0.5">
                    <span>{order.storeType === 'food' ? '🍔 Restaurant' : '🥦 Grocery'}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    <span>{order.id}</span>
                  </p>
                </div>

                <div className={`px-2.5 py-1 rounded-xl text-[10px] font-bold flex items-center gap-1 ${
                  order.status === 'delivered'
                    ? 'bg-green-50 text-green-700'
                    : order.status === 'cancelled'
                      ? 'bg-red-50 text-red-600'
                      : 'bg-purple-50 text-purple-700 animate-pulse'
                }`}>
                  {order.status === 'delivered' ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : order.status === 'cancelled' ? (
                    <XCircle className="w-3.5 h-3.5" />
                  ) : (
                    <Clock className="w-3.5 h-3.5" />
                  )}
                  <span className="capitalize">{order.status === 'on-the-way' ? 'On the Way' : order.status}</span>
                </div>
              </div>

              {/* Items Breakdown list */}
              <div className="space-y-2 text-xs font-semibold text-slate-600">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span className="truncate max-w-[200px]">
                      {item.quantity}x {item.name}
                    </span>
                    <span className="text-slate-800">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Total Summary Row */}
              <div className="flex justify-between items-center pt-3 border-t border-slate-50 text-xs font-bold">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase">Paid amount</p>
                  <p className="text-sm font-extrabold text-slate-900">${order.total.toFixed(2)}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-bold">{order.date}</span>
                  <button
                    onClick={() => handleReorder(order)}
                    className="bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold px-3 py-2 rounded-xl flex items-center gap-1 cursor-pointer transition-all"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reorder</span>
                  </button>
                </div>
              </div>

            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-100 p-6">
            <p className="text-slate-400 text-sm font-medium">No order history found.</p>
          </div>
        )}
      </div>
    </div>
  );
};
