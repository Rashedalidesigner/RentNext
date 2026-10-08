import React, { useState } from 'react';
import { Home, User, Building, ArrowRight, Lock, Mail } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

interface AuthViewProps {
  initialMode?: 'login' | 'register';
}

export const AuthView: React.FC<AuthViewProps> = ({ initialMode = 'login' }) => {
  const { login, register, navigateTo } = useApp();

  const [isRegister, setIsRegister] = useState(initialMode === 'register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('TENANT');
  const [phone, setPhone] = useState('+1 (555) 234-5678');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegister) {
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
        role: role,
        phone: phone.trim(),
      });
      navigateTo({ path: role.toLowerCase() === 'landlord' ? '/dashboard/landlord' : '/dashboard/tenant' });
    } else {
      const ok = await login(email.trim(), password);
      if (ok) {
        navigateTo({ path: '/properties' });
      }
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-8">
      {/* Brand logo & tagline */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/20">
          <Home className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {isRegister ? 'Create Your RentNest Account' : 'Sign in to RentNest'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          {isRegister
            ? 'Join our verified rental ecosystem as a tenant or landlord.'
            : 'Access your property requests, leases, and payouts.'}
        </p>
      </div>

      {/* Main Form Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-lg space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Legal Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
          </div>

          {/* Account Role Selector on Register */}
          {isRegister && (
            <div className="space-y-1.5 pt-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Select Your Role *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('TENANT')}
                  className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                    role === 'TENANT'
                      ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-2 ring-blue-500'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <User className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold">Tenant</span>
                  <span className="text-[10px] text-slate-600">Browse & Rent</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('LANDLORD')}
                  className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                    role === 'LANDLORD'
                      ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-2 ring-blue-500'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Building className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold">Landlord</span>
                  <span className="text-[10px] text-slate-600">List & Manage</span>
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-2 pt-3"
          >
            <span>{isRegister ? 'Complete Registration' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="text-center pt-2 border-t border-slate-100">
          <p className="text-xs text-slate-600">
            {isRegister ? 'Already have an account?' : "Don't have an account yet?"}{' '}
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="text-blue-700 font-bold hover:underline"
            >
              {isRegister ? 'Sign in' : 'Create an account'}
            </button>
          </p>
        </div>
      </div>

    </div>
  );
};
