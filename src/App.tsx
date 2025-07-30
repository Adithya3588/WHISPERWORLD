import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './hooks/useAuth';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { Chat } from './components/Chat'; // Make sure this exists

function App() {
  const { user, login, register, logout, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-300 via-pink-200 to-yellow-100 flex items-center justify-center">
        <div className="flex items-center space-x-2 text-gray-800">
          <div className="w-6 h-6 border-2 border-gray-400 border-t-indigo-600 rounded-full animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          {user ? (
            <>
              <Route path="/" element={<Dashboard user={user} onLogout={logout} />} />
              <Route path="/chat/:userCode" element={<Chat currentUserCode={user.code} />} />
            </>
          ) : (
            <Route path="*" element={<Login onLogin={login} onRegister={register} />} />
          )}
        </Routes>
        <Toaster
          position="top-right"
          toastOptions={{
            className: 'bg-white text-black border border-gray-300',
            duration: 4000,
          }}
        />
      </div>
    </Router>
  );
}

export default App;
