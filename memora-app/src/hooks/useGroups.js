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
import { db } from '../config/firebase';

export function useGroups() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Upload to Cloudinary using environment variables
  const uploadToCloudinary = async (file) => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      throw new Error('Cloudinary configuration is missing. Please check your .env file.');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Failed to upload image to Cloudinary');
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error('Failed to upload image. Please try again.');
    }
  };

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
        coverPhotoURL = await uploadToCloudinary(coverImage);
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

      if (groupData.members.some((m) => m.userId === userId)) {
        throw new Error('You are already a member of this group');
      }

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