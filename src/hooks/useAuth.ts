import { useState, useEffect } from 'react';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { User } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('whisperwall_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (code: string): Promise<{ success: boolean; message: string }> => {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('code', '==', code));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return { success: false, message: 'Invalid code. Please try again.' };
      }

      const userData = querySnapshot.docs[0].data() as User;
      userData.id = querySnapshot.docs[0].id;
      
      setUser(userData);
      localStorage.setItem('whisperwall_user', JSON.stringify(userData));
      
      return { success: true, message: 'Login successful!' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Login failed. Please try again.' };
    }
  };

  const register = async (code: string): Promise<{ success: boolean; message: string }> => {
    if (code.length !== 4 || !/^\d{4}$/.test(code)) {
      return { success: false, message: 'Code must be exactly 4 digits.' };
    }

    try {
      // Check if code already exists
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('code', '==', code));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        return { success: false, message: 'This code is already taken. Please choose another.' };
      }

      // Create new user
      const newUser = {
        code,
        createdAt: new Date(),
      };

      const docRef = await addDoc(usersRef, newUser);
      const userData = { ...newUser, id: docRef.id };
      
      setUser(userData);
      localStorage.setItem('whisperwall_user', JSON.stringify(userData));
      
      return { success: true, message: 'Account created successfully!' };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'Registration failed. Please try again.' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('whisperwall_user');
  };

  return { user, login, register, logout, loading };
};