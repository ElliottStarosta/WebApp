import { useState, useEffect } from 'react';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { db } from '../config/firebase';

export function usePosts(groupId) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Upload to Cloudinary
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

  // Real-time listener for posts
  useEffect(() => {
    if (!groupId) {
      setPosts([]);
      setLoading(false);
      return;
    }

    const postsQuery = query(
      collection(db, 'posts'),
      where('groupId', '==', groupId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      postsQuery,
      (snapshot) => {
        const postsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().createdAt?.toDate() || new Date(),
        }));

        setPosts(postsData);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [groupId]);

  // Create a new post
  const createPost = async (postData, userId, images = []) => {
    setError(null);

    try {
      const imageUrls = [];

      // Upload images to Cloudinary
      for (const image of images) {
        const url = await uploadToCloudinary(image);
        imageUrls.push(url);
      }

      const post = {
        groupId,
        authorId: userId,
        type: images.length > 0 ? 'photo' : postData.poll ? 'poll' : 'text',
        content: postData.content,
        images: imageUrls,
        poll: postData.poll || null,
        reactions: {},
        comments: [],
        tags: postData.tags || [],
        taggedUsers: postData.taggedUsers || [],
        location: postData.location || '',
        favorites: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await addDoc(collection(db, 'posts'), post);
      return { id: docRef.id, ...post };
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Add reaction to post
  const addReaction = async (postId, emoji, userId) => {
    setError(null);

    try {
      const postRef = doc(db, 'posts', postId);
      const post = posts.find((p) => p.id === postId);

      if (!post) return;

      const reactions = { ...post.reactions };

      if (!reactions[emoji]) {
        reactions[emoji] = [];
      }

      // Toggle reaction
      if (reactions[emoji].includes(userId)) {
        reactions[emoji] = reactions[emoji].filter((id) => id !== userId);
      } else {
        reactions[emoji].push(userId);
      }

      // Remove empty arrays
      if (reactions[emoji].length === 0) {
        delete reactions[emoji];
      }

      await updateDoc(postRef, { reactions });
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Add comment to post
  const addComment = async (postId, userId, text) => {
    setError(null);

    try {
      const postRef = doc(db, 'posts', postId);
      const post = posts.find((p) => p.id === postId);

      if (!post) return;

      const newComment = {
        id: Date.now().toString(),
        authorId: userId,
        text,
        createdAt: new Date(),
      };

      const updatedComments = [...(post.comments || []), newComment];

      await updateDoc(postRef, { comments: updatedComments });
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Toggle favorite
  const toggleFavorite = async (postId, userId) => {
    setError(null);

    try {
      const postRef = doc(db, 'posts', postId);
      const post = posts.find((p) => p.id === postId);

      if (!post) return;

      if (post.favorites?.includes(userId)) {
        await updateDoc(postRef, {
          favorites: arrayRemove(userId),
        });
      } else {
        await updateDoc(postRef, {
          favorites: arrayUnion(userId),
        });
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Vote in poll
  const voteInPoll = async (postId, optionId, userId) => {
    setError(null);

    try {
      const postRef = doc(db, 'posts', postId);
      const post = posts.find((p) => p.id === postId);

      if (!post || !post.poll) return;

      const poll = { ...post.poll };

      // Remove user's vote from all options
      poll.options = poll.options.map((opt) => ({
        ...opt,
        votes: opt.votes.filter((id) => id !== userId),
      }));

      // Add vote to selected option
      const selectedOption = poll.options.find((opt) => opt.id === optionId);
      if (selectedOption) {
        selectedOption.votes.push(userId);
      }

      await updateDoc(postRef, { poll });
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Delete post
  const deletePost = async (postId) => {
    setError(null);

    try {
      await deleteDoc(doc(db, 'posts', postId));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    posts,
    loading,
    error,
    createPost,
    addReaction,
    addComment,
    toggleFavorite,
    voteInPoll,
    deletePost,
  };
}