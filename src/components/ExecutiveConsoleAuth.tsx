import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  User, 
  AlertTriangle, 
  CheckCircle, 
  ArrowLeft, 
  Eye, 
  EyeOff
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import CrovationLogo from './CrovationLogo';

interface ExecutiveConsoleAuthProps {
  onLoggedInAdminChange: (admin: any) => void;
  onSuccessRedirect: () => void;
  onBackToSite: () => void;
}

export default function ExecutiveConsoleAuth({
  onLoggedInAdminChange,
  onSuccessRedirect,
  onBackToSite
}: ExecutiveConsoleAuthProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  
  // Form values
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Email regex validation
  const isValidEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Initial validations
    if (isSignUp && !fullName.trim()) {
      setError('Please provide your full name for the administrator registry.');
      return;
    }
    if (!email.trim() || !isValidEmail(email)) {
      setError('Please provide a valid administrative email address.');
      return;
    }
    if (!password) {
      setError('Kindly input your executive passkey.');
      return;
    }
    if (password.length < 6) {
      setError('For security, passkey must be at least 6 characters in length.');
      return;
    }

    if (!isSupabaseConfigured || !supabase) {
      setError('Supabase is currently not configured in the workspace environment.');
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        // ADMIN SIGN UP FLOW
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              role: 'admin' // save role directly in user metadata as a reliable fallback
            }
          }
        });

        if (signUpError) {
          throw new Error(signUpError.message);
        }

        const user = signUpData?.user;
        if (!user) {
          throw new Error('Sign up completed but no user identity was received.');
        }

        // Attempt direct insertion to public.profiles
        try {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              role: 'admin',
              full_name: fullName
            });

          if (profileError) {
            console.warn('Profiles table insert error: ', profileError.message);
          }
        } catch (profileInsertErr) {
          console.warn('Fallback profile insert failed:', profileInsertErr);
        }

        setSuccess('Administrator credentials registered successfully! Logging you in...');
        
        // Save to active session
        const loggedInUser = {
          name: fullName,
          email: user.email,
          id: user.id
        };
        localStorage.setItem('crovation_logged_in_admin', JSON.stringify(loggedInUser));
        onLoggedInAdminChange(loggedInUser);

        setTimeout(() => {
          onSuccessRedirect();
        }, 1200);

      } else {
        // ADMIN SIGN IN FLOW
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (signInError) {
          throw new Error(signInError.message);
        }

        const user = signInData?.user;
        if (!user) {
          throw new Error('Authentication completed but no user identity was resolved.');
        }

        // Query public.profiles where id matches user.id to check role
        let userRole = 'user';
        let userFullName = user.user_metadata?.full_name || '';

        try {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role, full_name')
            .eq('id', user.id)
            .single();

          if (!profileError && profile) {
            userRole = profile.role || 'user';
            if (profile.full_name) {
              userFullName = profile.full_name;
            }
          } else {
            // Table or RLS fallback: check standard user metadata
            console.warn('Profiles table check bypassed or returned error:', profileError?.message);
            userRole = user.user_metadata?.role || 'user';
          }
        } catch (err) {
          console.warn('Error querying profiles table, falling back to user metadata:', err);
          userRole = user.user_metadata?.role || 'user';
        }

        // Enforce strict admin role verification
        if (userRole === 'admin') {
          const loggedInUser = {
            name: userFullName || user.email?.split('@')[0] || 'Administrator',
            email: user.email,
            id: user.id
          };
          localStorage.setItem('crovation_logged_in_admin', JSON.stringify(loggedInUser));
          onLoggedInAdminChange(loggedInUser);
          setSuccess('Access verified! Preparing Executive Console...');
          
          setTimeout(() => {
            onSuccessRedirect();
          }, 1000);
        } else {
          // If NOT an admin, log them out immediately to clear cookies/session
          await supabase.auth.signOut();
          throw new Error('Access Denied: Admin privileges required.');
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication sequence failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center mb-6">
          <CrovationLogo isDarkTheme={false} height={52} />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
          Executive Control Room
        </h2>
        <p className="mt-2 text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
          Authorized personnel gatehouse. Authentication acts as a multi-tier cryptographic security check.
        </p>

        {/* Custom Toggle Switch (Without "Gate" text) */}
        <div className="mt-6 inline-flex p-1 bg-slate-200/60 border border-slate-300/55 rounded-xl select-none">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(false);
              setError(null);
              setSuccess(null);
            }}
            className={`px-5 py-2 text-xs font-mono tracking-wider uppercase font-bold rounded-lg transition-all duration-300 ${
              !isSignUp 
                ? 'bg-slate-900 text-white shadow-sm' 
                : 'text-slate-650 hover:text-slate-900'
            }`}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => {
              setIsSignUp(true);
              setError(null);
              setSuccess(null);
            }}
            className={`px-5 py-2 text-xs font-mono tracking-wider uppercase font-bold rounded-lg transition-all duration-300 ${
              isSignUp 
                ? 'bg-slate-900 text-white shadow-sm' 
                : 'text-slate-650 hover:text-slate-900'
            }`}
          >
            Register
          </button>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white border border-slate-200/80 py-8 px-6 sm:px-10 rounded-2xl shadow-xl relative">
          
          <form onSubmit={handleAuthSubmit} className="space-y-5">
            {isSignUp && (
              <div>
                <label className="block text-[10px] font-mono tracking-wider text-slate-500 uppercase mb-1.5 font-bold">
                  Administrator Full Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <User className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Chief Executive"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-450/10 transition-all font-sans"
                    required={isSignUp}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-mono tracking-wider text-slate-500 uppercase mb-1.5 font-bold">
                Authorized Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="crovateng@gmail.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-450/10 transition-all font-sans"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono tracking-wider text-slate-500 uppercase mb-1.5 font-bold">
                Executive Security Passkey
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-10 py-3 text-xs text-slate-800 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-450/10 transition-all font-sans"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-650"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3.5 flex gap-2.5 text-[11px] text-red-750 items-start animate-in fade-in duration-200">
                <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span className="leading-relaxed">{error}</span>
              </div>
            )}

            {success && (
              <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3.5 flex gap-2.5 text-[11px] text-emerald-750 items-start animate-in fade-in duration-200">
                <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span className="leading-relaxed">{success}</span>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold uppercase tracking-wider text-xs py-4 rounded-xl flex items-center justify-center gap-2 duration-300 shadow-md shadow-slate-900/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="animate-pulse">Authorizing Core Systems...</span>
                ) : (
                  <>
                    <Lock className="h-3.5 w-3.5" />
                    <span>{isSignUp ? 'Register as Admin' : 'Sign in'}</span>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col gap-4">
            <button
              type="button"
              onClick={onBackToSite}
              className="text-xs text-slate-500 hover:text-slate-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer focus:outline-none"
            >
              <ArrowLeft className="h-3.5 w-3.5 text-slate-450" />
              <span>Return to Public Website</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
