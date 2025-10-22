import { useState } from 'react';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';

export function useGroups() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Generate 6-digit invite code
  const generateInviteCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Create a new group
  const createGroup = async (groupData, userId, coverImage = null) => {
    setLoading(true);
    setError(null);

    try {
      let coverPhotoURL = '';

      if (coverImage) {
        const storageRef = ref(storage, `groups/${Date.now()}/cover/${coverImage.name}`);
        await uploadBytes(storageRef, coverImage);
        coverPhotoURL = await getDownloadURL(storageRef);
      }

      const group = {
        name: groupData.name,
        description: groupData.description || '',
        coverPhoto: coverPhotoURL,
        createdBy: userId,
        createdAt: new Date(),
        members: [{ userId, role: 'admin', joinedAt: new Date() }],
        inviteCode: generateInviteCode(),
        settings: { isPublic: false },
      };

      const docRef = await addDoc(collection(db, 'groups'), group);
      setLoading(false);
      return { id: docRef.id, ...group };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  // Join group via invite code
  const joinGroupByCode = async (inviteCode, userId) => {
    setLoading(true);
    setError(null);

    try {
      const groupsQuery = query(
        collection(db, 'groups'),
        where('inviteCode', '==', inviteCode)
      );

      const snapshot = await getDocs(groupsQuery);

      if (snapshot.empty) {
        throw new Error('Invalid invite code');
      }

      const groupDoc = snapshot.docs[0];
      const groupData = groupDoc.data();

      // Check if user is already a member
      if (groupData.members.some((m) => m.userId === userId)) {
        throw new Error('You are already a member of this group');
      }

      // Add user to members
      const updatedMembers = [
        ...groupData.members,
        { userId, role: 'member', joinedAt: new Date() },
      ];

      await updateDoc(doc(db, 'groups', groupDoc.id), {
        members: updatedMembers,
      });

      setLoading(false);
      return { id: groupDoc.id, ...groupData, members: updatedMembers };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  // Send group invitation
  const inviteToGroup = async (groupId, fromUserId, toUserId) => {
    setLoading(true);
    setError(null);

    try {
      const invitation = {
        groupId,
        fromUserId,
        toUserId,
        status: 'pending',
        createdAt: new Date(),
      };

      await addDoc(collection(db, 'groupInvitations'), invitation);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  // Accept group invitation
  const acceptGroupInvitation = async (invitationId, groupId, userId) => {
    setLoading(true);
    setError(null);

    try {
      const groupDoc = await getDoc(doc(db, 'groups', groupId));
      const groupData = groupDoc.data();

      const updatedMembers = [
        ...groupData.members,
        { userId, role: 'member', joinedAt: new Date() },
      ];

      await updateDoc(doc(db, 'groups', groupId), {
        members: updatedMembers,
      });

      await updateDoc(doc(db, 'groupInvitations', invitationId), {
        status: 'accepted',
      });

      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  // Reject group invitation
  const rejectGroupInvitation = async (invitationId) => {
    setLoading(true);
    setError(null);

    try {
      await updateDoc(doc(db, 'groupInvitations', invitationId), {
        status: 'rejected',
      });
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  // Leave group
  const leaveGroup = async (groupId, userId) => {
    setLoading(true);
    setError(null);

    try {
      const groupDoc = await getDoc(doc(db, 'groups', groupId));
      const groupData = groupDoc.data();

      const updatedMembers = groupData.members.filter((m) => m.userId !== userId);

      await updateDoc(doc(db, 'groups', groupId), {
        members: updatedMembers,
      });

      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  // Delete group (admin only)
  const deleteGroup = async (groupId) => {
    setLoading(true);
    setError(null);

    try {
      await deleteDoc(doc(db, 'groups', groupId));
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  // Update group settings (admin only)
  const updateGroupSettings = async (groupId, updates) => {
    setLoading(true);
    setError(null);

    try {
      await updateDoc(doc(db, 'groups', groupId), updates);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  return {
    loading,
    error,
    createGroup,
    joinGroupByCode,
    inviteToGroup,
    acceptGroupInvitation,
    rejectGroupInvitation,
    leaveGroup,
    deleteGroup,
    updateGroupSettings,
  };
}