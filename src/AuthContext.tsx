import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface UserData {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  xp: number;
  badges: string[];
  bio: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({ user: null, userData: null, loading: true, refreshUserData: async () => {} });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (uid: string, currentUser: User) => {
    try {
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setUserData(userSnap.data() as UserData);
      } else {
        const newUserData: UserData = {
          uid,
          displayName: currentUser.displayName || 'Anonymous',
          email: currentUser.email || '',
          photoURL: currentUser.photoURL || '',
          xp: 0,
          badges: ['First Login'],
          bio: 'A student who likes to bring dreams into reality.',
          createdAt: new Date().toISOString(),
        };
        await setDoc(userRef, newUserData);
        setUserData(newUserData);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const refreshUserData = async () => {
    if (user) {
      await fetchUserData(user.uid, user);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchUserData(currentUser.uid, currentUser);
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, userData, loading, refreshUserData }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
