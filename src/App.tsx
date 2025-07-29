import React from 'react';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './hooks/useAuth';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';

function App() {
  const { user, login, register, logout, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex items-center justify-center">
        <div className="flex items-center space-x-2 text-white">
          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      {user ? (
        <Dashboard user={user} onLogout={logout} />
      ) : (
        <Login onLogin={login} onRegister={register} />
      )}
      <Toaster 
        position="top-right"
        toastOptions={{
          className: 'bg-slate-800 text-white border border-slate-600',
          duration: 4000,
        }}
      />
    </div>
  );
}

export default App;