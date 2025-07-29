import React, { useState } from 'react';
import { Lock, UserPlus, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';

interface LoginProps {
  onLogin: (code: string) => Promise<{ success: boolean; message: string }>;
  onRegister: (code: string) => Promise<{ success: boolean; message: string }>;
}

export const Login: React.FC<LoginProps> = ({ onLogin, onRegister }) => {
  const [code, setCode] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 4) {
      toast.error('Please enter a 4-digit code');
      return;
    }

    setLoading(true);
    const result = isRegistering 
      ? await onRegister(code)
      : await onLogin(code);

    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
    setLoading(false);
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setCode(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex items-center justify-center p-4">
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md shadow-2xl border border-white/10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">WhisperWall</h1>
          <p className="text-gray-300">Share your thoughts anonymously</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-purple-200 mb-2">
              4-Digit Code
            </label>
            <input
              type="text"
              value={code}
              onChange={handleCodeChange}
              placeholder="0000"
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl tracking-widest"
              maxLength={4}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || code.length !== 4}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-600 disabled:to-gray-700 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {isRegistering ? <UserPlus className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
                <span>{isRegistering ? 'Create Account' : 'Login'}</span>
              </>
            )}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
            >
              {isRegistering 
                ? 'Already have a code? Login instead' 
                : "Don't have a code? Create one"}
            </button>
          </div>
        </form>

        <div className="mt-8 p-4 bg-white/5 rounded-lg border border-white/5">
          <p className="text-xs text-gray-300 text-center">
            Your 4-digit code is your anonymous identity. Keep it safe and don't share it with others.
          </p>
        </div>
      </div>
    </div>
  );
};