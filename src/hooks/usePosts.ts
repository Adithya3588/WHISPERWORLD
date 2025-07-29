import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove,
  deleteDoc,
  where,
  getDocs
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { Post, Reply } from '../types';
import { contentFilter } from '../utils/contentFilter';

export const usePosts = (userCode: string) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const postsRef = collection(db, 'posts');
    const q = query(postsRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        replies: (doc.data().replies || []).map((reply: any) => ({
          ...reply,
          createdAt: reply.createdAt?.toDate ? reply.createdAt.toDate() : new Date(reply.createdAt),
        })),
      })) as Post[];

      // Filter out posts with 5 or more reports
      const filteredPosts = postsData.filter(post => (post.reportCount || 0) < 5);
      setPosts(filteredPosts);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const createPost = async (content: string): Promise<{ success: boolean; message: string }> => {
    const validation = contentFilter.isContentValid(content);
    if (!validation.valid) {
      return { success: false, message: validation.reason! };
    }

    try {
      await addDoc(collection(db, 'posts'), {
        content,
        authorCode: userCode,
        createdAt: new Date(),
        likes: 0,
        likedBy: [],
        reportCount: 0,
        reportedBy: [],
        replies: [],
      });

      return { success: true, message: 'Post created successfully!' };
    } catch (error) {
      console.error('Error creating post:', error);
      return { success: false, message: 'Failed to create post. Please try again.' };
    }
  };

  const likePost = async (postId: string, isLiked: boolean) => {
    try {
      const postRef = doc(db, 'posts', postId);
      if (isLiked) {
        await updateDoc(postRef, {
          likedBy: arrayRemove(userCode),
          likes: posts.find(p => p.id === postId)!.likes - 1,
        });
      } else {
        await updateDoc(postRef, {
          likedBy: arrayUnion(userCode),
          likes: posts.find(p => p.id === postId)!.likes + 1,
        });
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const reportPost = async (postId: string): Promise<{ success: boolean; message: string }> => {
    try {
      const post = posts.find(p => p.id === postId);
      if (!post) return { success: false, message: 'Post not found' };

      if (post.reportedBy?.includes(userCode)) {
        return { success: false, message: 'You have already reported this post' };
      }

      const newReportCount = (post.reportCount || 0) + 1;
      const postRef = doc(db, 'posts', postId);

      await updateDoc(postRef, {
        reportedBy: arrayUnion(userCode),
        reportCount: newReportCount,
      });

      // If 5 or more reports, delete the post
      if (newReportCount >= 5) {
        await deleteDoc(postRef);
        return { success: true, message: 'Post has been removed due to multiple reports' };
      }

      return { success: true, message: 'Post reported successfully' };
    } catch (error) {
      console.error('Error reporting post:', error);
      return { success: false, message: 'Failed to report post' };
    }
  };

  const addReply = async (postId: string, content: string): Promise<{ success: boolean; message: string }> => {
    const validation = contentFilter.isContentValid(content);
    if (!validation.valid) {
      return { success: false, message: validation.reason! };
    }

    try {
      const reply: Reply = {
        id: Date.now().toString(),
        postId,
        content,
        authorCode: userCode,
        createdAt: new Date(),
        likes: 0,
        likedBy: [],
      };

      const postRef = doc(db, 'posts', postId);
      const post = posts.find(p => p.id === postId);
      const updatedReplies = [...(post?.replies || []), reply];

      await updateDoc(postRef, {
        replies: updatedReplies,
      });

      return { success: true, message: 'Reply added successfully!' };
    } catch (error) {
      console.error('Error adding reply:', error);
      return { success: false, message: 'Failed to add reply' };
    }
  };

  const likeReply = async (postId: string, replyId: string, isLiked: boolean) => {
    try {
      const post = posts.find(p => p.id === postId);
      if (!post) return;

      const updatedReplies = post.replies.map(reply => {
        if (reply.id === replyId) {
          if (isLiked) {
            return {
              ...reply,
              likedBy: reply.likedBy.filter(code => code !== userCode),
              likes: reply.likes - 1,
            };
          } else {
            return {
              ...reply,
              likedBy: [...reply.likedBy, userCode],
              likes: reply.likes + 1,
            };
          }
        }
        return reply;
      });

      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        replies: updatedReplies,
      });
    } catch (error) {
      console.error('Error liking reply:', error);
    }
  };

  return {
    posts,
    loading,
    createPost,
    likePost,
    reportPost,
    addReply,
    likeReply,
  };
};