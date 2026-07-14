import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ArrowLeft, MapPin, Phone, MessageSquare, ShieldCheck, Clock, RefreshCw, 
  CheckCircle2, Play, CircleDot, XCircle, AlertCircle, ShoppingBag, BadgeAlert 
} from 'lucide-react';
import { motion } from 'motion/react';

export const OrderTrackingScreen: React.FC = () => {
  const { activeOrder, cancelOrder, goBack, setScreen } = useApp();
  const [etaMinutes, setEtaMinutes] = useState(18);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [driverContacted, setDriverContacted] = useState(false);
  const [contactMessage, setContactMessage] = useState('');

  useEffect(() => {
    if (!activeOrder) return;

    // Adjust simulated ETA based on active order status
    if (activeOrder.status === 'placed') setEtaMinutes(18);
    else if (activeOrder.status === 'preparing') setEtaMinutes(14);
    else if (activeOrder.status === 'on-the-way') setEtaMinutes(6);
    else if (activeOrder.status === 'delivered') setEtaMinutes(0);
  }, [activeOrder?.status]);

  if (!activeOrder) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-500 p-6 font-sans">
        <div className="w-20 h-20 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center text-slate-400 mb-4 animate-pulse">
          <Clock className="w-10 h-10" />
        </div>
        <p className="font-extrabold text-slate-800 text-lg">No Active Orders</p>
        <p className="text-xs text-slate-400 text-center max-w-xs mt-1 mb-6">
          You don't have any orders currently processing. Check your history to see previous shipments!
        </p>
        <div className="flex gap-3">
          <button 
            onClick={() => setScreen('home')} 
            className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer"
          >
            Order Food & Groceries
          </button>
          <button 
            onClick={() => setScreen('order-history')} 
            className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer"
          >
            Order History
          </button>
        </div>
      </div>
    );
  }

  const steps = [
    { label: 'Order Confirmed', desc: 'Outlets received your order', status: 'placed' },
    { label: 'Preparing', desc: 'Assembling basket & cooking', status: 'preparing' },
    { label: 'On the Way', desc: 'Driver carrying your package', status: 'on-the-way' },
    { label: 'Delivered', desc: 'Handed off successfully', status: 'delivered' },
  ];

  const currentStepIndex = steps.findIndex((s) => s.status === activeOrder.status);

  const handleCancelOrder = () => {
    cancelOrder(activeOrder.id);
    setShowCancelConfirm(false);
  };

  return (
    <div id="order-tracking-screen" className="pb-24 bg-slate-50 min-h-screen text-slate-800 font-sans">
      {/* Header Sticky Banner */}
      <div className="bg-white border-b border-slate-100 px-5 py-4 sticky top-0 z-30 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={goBack} 
            className="p-1.5 hover:bg-slate-100 rounded-full text-slate-600 cursor-pointer transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">Tracking Order</h2>
            <p className="text-xs text-slate-500">{activeOrder.id} • {activeOrder.storeName}</p>
          </div>
        </div>

        {activeOrder.status === 'placed' && (
          <button
            onClick={() => setShowCancelConfirm(true)}
            className="text-xs font-bold text-red-500 bg-red-50 px-2.5 py-1.5 rounded-xl cursor-pointer hover:bg-red-100 transition-all"
          >
            Cancel Order
          </button>
        )}
      </div>

      <div className="p-5 space-y-6">

        {/* Live Vector Map Simulation */}
        {activeOrder.status !== 'delivered' && activeOrder.status !== 'cancelled' && (
          <div className="bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-300 rounded-3xl h-52 relative overflow-hidden shadow-inner">
            {/* Street Lines */}
            <div className="absolute top-1/3 left-0 right-0 h-4 bg-white/70" />
            <div className="absolute bottom-1/4 left-0 right-0 h-4 bg-white/70" />
            <div className="absolute top-0 bottom-0 left-1/3 w-4 bg-white/70" />
            <div className="absolute top-0 bottom-0 right-1/4 w-4 bg-white/70 animate-pulse" />
            
            {/* Soft Green Space */}
            <div className="absolute top-4 left-6 w-24 h-16 bg-green-200/40 rounded-full blur-sm" />
            <div className="absolute bottom-6 right-8 w-28 h-12 bg-green-200/40 rounded-full blur-sm" />

            {/* Home Pin Icon */}
            <div className="absolute bottom-12 left-12 flex flex-col items-center">
              <span className="bg-slate-950 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-md mb-1 uppercase tracking-wider shadow-md">
                Home
              </span>
              <div className="w-8 h-8 bg-purple-600 border-2 border-white rounded-full flex items-center justify-center shadow-lg">
                <MapPin className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="absolute -bottom-1 w-3 h-1 bg-black/20 rounded-full blur-xs" />
            </div>

            {/* Store Location Pin */}
            <div className="absolute top-10 right-20 flex flex-col items-center">
              <span className="bg-slate-900/80 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-md mb-1 uppercase tracking-wider shadow-md">
                Outlet
              </span>
              <div className="w-8 h-8 bg-blue-500 border-2 border-white rounded-full flex items-center justify-center shadow-lg">
                <ShoppingBag className="w-4 h-4 text-white fill-white" />
              </div>
            </div>

            {/* Animated Transit Driver Dot */}
            {activeOrder.status === 'on-the-way' && (
              <motion.div 
                animate={{
                  x: [160, 120, 80],
                  y: [40, 80, 110]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 10,
                  ease: "easeInOut"
                }}
                className="absolute top-10 right-32 z-10 flex flex-col items-center"
              >
                <div className="w-7 h-7 bg-emerald-600 border-2 border-white rounded-full flex items-center justify-center shadow-xl">
                  <span className="text-xs">🛵</span>
                </div>
                <span className="w-5 h-1 bg-black/10 rounded-full blur-xs mt-0.5" />
              </motion.div>
            )}

            {activeOrder.status === 'preparing' && (
              <div className="absolute top-12 right-24 z-10">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                </span>
              </div>
            )}
          </div>
        )}

        {/* Order tracking Status Banner / timer */}
        <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm text-center relative overflow-hidden">
          {activeOrder.status === 'delivered' ? (
            <div className="space-y-2">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-2 border border-green-200">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Order Delivered Successfully</h3>
              <p className="text-xs text-slate-500">Handed off safely to customer. Hope you enjoy your meals!</p>
            </div>
          ) : activeOrder.status === 'cancelled' ? (
            <div className="space-y-2">
              <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-2 border border-red-200">
                <XCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Order Cancelled</h3>
              <p className="text-xs text-slate-500">The order was canceled. Refund processing details sent to mail.</p>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Estimated Delivery Speed</p>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight flex justify-center items-center gap-1.5">
                <Clock className="w-7 h-7 text-purple-600 animate-pulse" />
                <span>{etaMinutes} mins remaining</span>
              </h3>
              <p className="text-xs text-slate-500 mt-2 font-medium">
                Our local courier is currently navigating to your destination. Handoff OTP code: <span className="font-mono bg-slate-100 font-extrabold text-slate-900 px-2 py-0.5 rounded border border-slate-200 tracking-wider">8942</span>
              </p>
            </div>
          )}
        </div>

        {/* 2. Timeline Step Progress Block */}
        <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm space-y-5">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Handoff timeline</h3>
          
          <div className="space-y-6 relative pl-6 border-l-2 border-slate-100">
            {steps.map((step, idx) => {
              const isPast = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              const isFuture = idx > currentStepIndex;

              return (
                <div key={step.status} className="relative">
                  {/* Timeline bullet node */}
                  <div className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    isPast 
                      ? 'bg-purple-600 border-purple-600 text-white' 
                      : isCurrent 
                        ? 'bg-white border-purple-600' 
                        : 'bg-white border-slate-200'
                  }`}>
                    {isPast && <span className="text-[8px]">✔</span>}
                    {isCurrent && <div className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-ping" />}
                  </div>

                  {/* Step Labels */}
                  <div>
                    <h4 className={`text-xs font-extrabold ${isFuture ? 'text-slate-400' : 'text-slate-900'}`}>
                      {step.label}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-medium">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Delivery Partner Contact details */}
        {activeOrder.status !== 'delivered' && activeOrder.status !== 'cancelled' && (
          <div className="bg-white rounded-3xl border border-slate-100 p-4 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Your Delivery Partner</h3>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center">
                  <span className="text-2xl">👨🏻</span>
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">Vikram Kumar</h4>
                  <p className="text-[11px] text-slate-400 font-medium">Eco Electric Scooter • MH12-DE-9843</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    setDriverContacted(true);
                    setContactMessage('Calling driver (simulated line integration)...');
                  }}
                  className="w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-600 transition-all cursor-pointer"
                >
                  <Phone className="w-4.5 h-4.5" />
                </button>
                <button 
                  onClick={() => {
                    setDriverContacted(true);
                    setContactMessage('Driver: "On the way, picking up fresh products!"');
                  }}
                  className="w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-600 transition-all cursor-pointer"
                >
                  <MessageSquare className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>

            {driverContacted && (
              <div className="bg-purple-50 border border-purple-200 text-purple-950 p-3 rounded-2xl text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-purple-600 shrink-0" />
                <span>{contactMessage}</span>
              </div>
            )}
          </div>
        )}

        {/* Interactive Cancel Confirmation Overlay */}
        {showCancelConfirm && (
          <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-5 z-50">
            <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center border border-red-200">
                <BadgeAlert className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-black text-slate-900 text-base">Cancel Order?</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Are you sure you want to cancel this order? Restaurants/stores can only refund orders that have not started cooking or sorting.
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-3 rounded-xl cursor-pointer"
                >
                  Keep Order
                </button>
                <button
                  onClick={handleCancelOrder}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold text-xs py-3 rounded-xl cursor-pointer shadow-lg shadow-red-500/20"
                >
                  Cancel Immediately
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
