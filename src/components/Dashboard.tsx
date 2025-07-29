import React, { useState } from 'react';
import { Plus, LogOut, RefreshCw } from 'lucide-react';
import { User } from '../types';
import { usePosts } from '../hooks/usePosts';
import { PostCard } from './PostCard';
import { CreatePostModal } from './CreatePostModal';
import toast from 'react-hot-toast';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const {
    posts,
    loading,
    createPost,
    likePost,
    reportPost,
    addReply,
    likeReply,
  } = usePosts(user.code);

  const handleReport = async (postId: string) => {
    const result = await reportPost(postId);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex items-center justify-center">
        <div className="flex items-center space-x-2 text-white">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span>Loading thoughts...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800">
      {/* Header */}
      <header className="bg-white/5 backdrop-blur-xl border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">WhisperWall</h1>
            <p className="text-gray-300 text-sm">Anonymous #{user.code}</p>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center space-x-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-12 h-12 text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">No thoughts shared yet</h2>
            <p className="text-gray-400 mb-6">Be the first to share your thoughts with the community</p>
            <button
              onClick={() => setShowCreatePost(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg transition-all duration-200"
            >
              Share Your First Thought
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                userCode={user.code}
                onLike={likePost}
                onReport={handleReport}
                onAddReply={addReply}
                onLikeReply={likeReply}
              />
            ))}
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      <button
        onClick={() => setShowCreatePost(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-200 hover:scale-110"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Create Post Modal */}
      {showCreatePost && (
        <CreatePostModal
          onClose={() => setShowCreatePost(false)}
          onCreatePost={createPost}
        />
      )}
    </div>
  );
};