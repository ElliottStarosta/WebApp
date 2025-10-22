import { useState } from 'react';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
} from 'firebase/firestore';
import { db } from '../config/firebase';

export function useFriends() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Search users by email or display name
  const searchUsers = async (searchTerm) => {
    setLoading(true);
    setError(null);

    try {
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);

      const users = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter(
          (user) =>
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.displayName.toLowerCase().includes(searchTerm.toLowerCase())
        );

      setLoading(false);
      return users;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  // Send friend request
  const sendFriendRequest = async (fromUserId, toUserId) => {
    setLoading(true);
    setError(null);

    try {
      // Add to sender's sent requests
      await updateDoc(doc(db, 'users', fromUserId), {
        friendRequestsSent: arrayUnion(toUserId),
      });

      // Add to receiver's received requests
      await updateDoc(doc(db, 'users', toUserId), {
        friendRequestsReceived: arrayUnion(fromUserId),
      });

      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  // Accept friend request
  const acceptFriendRequest = async (userId, friendId) => {
    setLoading(true);
    setError(null);

    try {
      // Add to both users' friends lists
      await updateDoc(doc(db, 'users', userId), {
        friends: arrayUnion(friendId),
        friendRequestsReceived: arrayRemove(friendId),
      });

      await updateDoc(doc(db, 'users', friendId), {
        friends: arrayUnion(userId),
        friendRequestsSent: arrayRemove(userId),
      });

      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  // Reject friend request
  const rejectFriendRequest = async (userId, friendId) => {
    setLoading(true);
    setError(null);

    try {
      await updateDoc(doc(db, 'users', userId), {
        friendRequestsReceived: arrayRemove(friendId),
      });

      await updateDoc(doc(db, 'users', friendId), {
        friendRequestsSent: arrayRemove(userId),
      });

      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  // Remove friend
  const removeFriend = async (userId, friendId) => {
    setLoading(true);
    setError(null);

    try {
      await updateDoc(doc(db, 'users', userId), {
        friends: arrayRemove(friendId),
      });

      await updateDoc(doc(db, 'users', friendId), {
        friends: arrayRemove(userId),
      });

      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  // Get friends list with details
  const getFriendsList = async (userId) => {
    setLoading(true);
    setError(null);

    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      const userData = userDoc.data();

      if (!userData.friends || userData.friends.length === 0) {
        setLoading(false);
        return [];
      }

      const friendsPromises = userData.friends.map((friendId) =>
        getDoc(doc(db, 'users', friendId))
      );

      const friendsDocs = await Promise.all(friendsPromises);
      const friends = friendsDocs.map((doc) => ({ id: doc.id, ...doc.data() }));

      setLoading(false);
      return friends;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  // Get friend requests
  const getFriendRequests = async (userId) => {
    setLoading(true);
    setError(null);

    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      const userData = userDoc.data();

      if (!userData.friendRequestsReceived || userData.friendRequestsReceived.length === 0) {
        setLoading(false);
        return [];
      }

      const requestsPromises = userData.friendRequestsReceived.map((requesterId) =>
        getDoc(doc(db, 'users', requesterId))
      );

      const requestsDocs = await Promise.all(requestsPromises);
      const requests = requestsDocs.map((doc) => ({ id: doc.id, ...doc.data() }));

      setLoading(false);
      return requests;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  return {
    loading,
    error,
    searchUsers,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    removeFriend,
    getFriendsList,
    getFriendRequests,
  };
}