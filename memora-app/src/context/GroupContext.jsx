import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';

const GroupContext = createContext();

export function useGroup() {
  return useContext(GroupContext);
}

export function GroupProvider({ children }) {
  const { currentUser } = useAuth();
  const [activeGroup, setActiveGroup] = useState(null);
  const [userGroups, setUserGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setUserGroups([]);
      setActiveGroup(null);
      setLoading(false);
      return;
    }

    const groupsQuery = query(
      collection(db, 'groups'),
      where('members', 'array-contains', { userId: currentUser.uid })
    );

    const unsubscribe = onSnapshot(groupsQuery, (snapshot) => {
      const groups = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setUserGroups(groups);

      // Set active group if not set
      if (!activeGroup && groups.length > 0) {
        setActiveGroup(groups[0]);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, [currentUser]);

  const value = {
    activeGroup,
    setActiveGroup,
    userGroups,
    loading,
  };

  return <GroupContext.Provider value={value}>{children}</GroupContext.Provider>;
}