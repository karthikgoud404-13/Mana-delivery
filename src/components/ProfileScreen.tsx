import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, User, Phone, Mail, MapPin, LogOut, Save, BadgeCheck, ShieldAlert, Award } from 'lucide-react';

export const ProfileScreen: React.FC = () => {
  const { user, updateUser, logout, goBack } = useApp();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(false);
    setError('');

    if (!name || !email || !address) {
      setError('Please fill in all requested profile fields');
      return;
    }

    updateUser({ name, email, phone, address });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div id="profile-screen" className="pb-24 bg-slate-50 min-h-screen text-slate-800 font-sans">
      {/* Sticky Top Header */}
      <div className="bg-white border-b border-slate-100 px-5 py-4 sticky top-0 z-30 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={goBack} 
            className="p-1.5 hover:bg-slate-100 rounded-full text-slate-600 cursor-pointer transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Your Profile</h2>
            <p className="text-xs text-slate-500">Manage delivery credentials</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="p-2 hover:bg-red-50 text-red-500 rounded-xl transition-all cursor-pointer flex items-center gap-1 text-xs font-bold"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>

      <div className="p-5 space-y-6">

        {/* User Badge illustration / streak */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-5 rounded-3xl shadow-md flex items-center gap-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(147,51,234,0.15),transparent_40%)]" />
          
          <div className="w-16 h-16 rounded-2xl bg-purple-600 flex items-center justify-center text-white text-3xl font-black shadow-lg">
            {name.slice(0, 2).toUpperCase() || 'U'}
          </div>

          <div className="space-y-1 z-10">
            <h3 className="text-base font-extrabold tracking-tight flex items-center gap-1.5">
              <span>{name || 'Karthik Goud'}</span>
              <BadgeCheck className="w-4.5 h-4.5 text-blue-400 fill-blue-400" />
            </h3>
            <p className="text-xs text-slate-300">QuickBite Silver Member • Active streak</p>
            <div className="flex items-center gap-1 text-[10px] bg-white/10 px-2 py-0.5 rounded-full border border-white/10 w-fit">
              <Award className="w-3.5 h-3.5 text-yellow-300" />
              <span className="font-bold">480 reward loyalty points</span>
            </div>
          </div>
        </div>

        {/* Form fields */}
        <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs rounded-r-xl font-bold flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {isSaved && (
            <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-500 text-green-700 text-xs rounded-r-xl font-bold">
              Profile details updated successfully!
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-slate-400 text-[10px] font-black uppercase tracking-wider mb-1.5 pl-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-purple-500 rounded-2xl py-3 pl-10 pr-4 text-xs font-semibold focus:outline-none focus:ring-4 focus:ring-purple-500/10 transition-all text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 text-[10px] font-black uppercase tracking-wider mb-1.5 pl-1">
                Primary Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-purple-500 rounded-2xl py-3 pl-10 pr-4 text-xs font-semibold focus:outline-none focus:ring-4 focus:ring-purple-500/10 transition-all text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 text-[10px] font-black uppercase tracking-wider mb-1.5 pl-1">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  disabled
                  value={phone}
                  className="w-full bg-slate-100 border border-slate-200 rounded-2xl py-3 pl-10 pr-4 text-xs font-semibold text-slate-400 focus:outline-none cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 text-[10px] font-black uppercase tracking-wider mb-1.5 pl-1">
                Physical Physical Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-purple-500 rounded-2xl py-3 pl-10 pr-4 text-xs font-semibold focus:outline-none focus:ring-4 focus:ring-purple-500/10 transition-all text-slate-800"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-2xl shadow-lg transition-all flex justify-center items-center gap-2 cursor-pointer mt-2"
            >
              <Save className="w-4.5 h-4.5" />
              <span>Save Changes</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
