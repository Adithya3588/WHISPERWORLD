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
    const result = isRegistering ? await onRegister(code) : await onLogin(code);

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
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-yellow-100 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl border border-pink-200">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mb-4 shadow-lg">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">WhisperWall</h1>
          <p className="text-gray-600">Share your thoughts anonymously</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              4-Digit Code
            </label>
            <input
              type="text"
              value={code}
              onChange={handleCodeChange}
              placeholder="0000"
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-center text-2xl tracking-widest shadow-sm"
              maxLength={4}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || code.length !== 4}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-gray-300 disabled:to-gray-400 disabled:opacity-60 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-md"
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
              className="text-sm text-blue-500 hover:text-blue-700 transition"
            >
              {isRegistering
                ? 'Already have a code? Login instead'
                : "Don't have a code? Create one"}
            </button>
          </div>
        </form>

        <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
          <p className="text-xs text-gray-700 text-center">
            Your 4-digit code is your anonymous identity. Keep it safe and don't share it with others.
          </p>
        </div>
      </div>
    </div>
  );
};
