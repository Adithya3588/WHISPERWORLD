import React, { useState, useEffect } from 'react';
import { Plus, LogOut, RefreshCw, Bot } from 'lucide-react';
import { User } from '../types';
import { usePosts } from '../hooks/usePosts';
import { PostCard } from './PostCard';
import { CreatePostModal } from './CreatePostModal';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { getDatabase, ref, onValue } from 'firebase/database';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

type RecentChat = {
  userCode: string;
  lastMsg: string;
  time: string;
};

export const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [recentChats, setRecentChats] = useState<RecentChat[]>([]);

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
    result.success ? toast.success(result.message) : toast.error(result.message);
  };

  useEffect(() => {
    const db = getDatabase();
    const chatsRef = ref(db, "chats/");

    const unsubscribe = onValue(chatsRef, (snapshot) => {
      const data = snapshot.val();
      if (!data || !data[user.code]) {
        setRecentChats([]);
        return;
      }

      const messagesObj = data[user.code];
      const groupedBySender: Record<string, any[]> = {};

      // Group messages by sender
      Object.entries(messagesObj).forEach(([msgId, msgData]: any) => {
        const from = msgData.from;
        if (!groupedBySender[from]) groupedBySender[from] = [];
        groupedBySender[from].push({ ...msgData, id: msgId });
      });

      // Extract latest message per sender
      const recentMessages: RecentChat[] = Object.entries(groupedBySender).map(([senderCode, msgs]) => {
        const sorted = msgs.sort((a, b) => {
          const aTime = new Date(`1970/01/01 ${a.time}`).getTime();
          const bTime = new Date(`1970/01/01 ${b.time}`).getTime();
          return bTime - aTime;
        });

        const latest = sorted[0];

        return {
          userCode: senderCode,
          lastMsg: latest.text,
          time: latest.time,
        };
      });

      setRecentChats(recentMessages);
    });

    return () => unsubscribe();
  }, [user.code]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 via-pink-100 to-sky-100">
        <div className="flex items-center gap-2 text-pink-700 text-lg font-medium">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span>Loading thoughts...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-rose-100 to-blue-100 flex flex-col">
      <header className="bg-white/60 backdrop-blur-md border-b border-pink-200 sticky top-0 z-40 w-full shadow-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-pink-700">WhisperWall</h1>
            <p className="text-sm text-pink-500">Anonymous #{user.code}</p>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg shadow transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <main className="flex-grow max-w-6xl w-full mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-400/30 to-cyan-400/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Plus className="w-12 h-12 text-blue-500" />
              </div>
              <h2 className="text-2xl font-bold text-pink-700 mb-2">No thoughts shared yet</h2>
              <p className="text-pink-500 mb-6">Be the first to share your thoughts with the community</p>
              <button
                onClick={() => setShowCreatePost(true)}
                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white rounded-lg shadow-lg transition"
              >
                Share Your First Thought
              </button>
            </div>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                userCode={user.code}
                onLike={likePost}
                onReport={handleReport}
                onAddReply={addReply}
                onLikeReply={likeReply}
              />
            ))
          )}
        </div>

        <aside className="space-y-6">
          <div className="bg-white/80 rounded-xl p-4 shadow border border-pink-200">
            <h3 className="text-lg font-semibold text-pink-700 mb-3">Recently Chatted</h3>
            {recentChats.length === 0 ? (
              <p className="text-sm text-pink-400">No recent chats.</p>
            ) : (
              <ul className="space-y-3 text-pink-600 text-sm">
                {recentChats.map((chat) => (
                  <li key={chat.userCode}>
                    <Link
                      to={`/chat/${chat.userCode}`}
                      className="flex flex-col hover:underline transition cursor-pointer"
                    >
                      <span className="font-medium">Anonymous #{chat.userCode}</span>
                      <span className="text-xs text-pink-500 truncate">{chat.lastMsg}</span>
                      <span className="text-[10px] text-pink-400">{chat.time}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-white/80 rounded-xl p-4 shadow border border-yellow-200">
            <div className="flex items-center gap-2 text-yellow-600">
              <Bot className="w-5 h-5" />
              <h3 className="font-semibold text-lg">AI Support Bot</h3>
            </div>
            <p className="text-sm text-yellow-600 mt-2">Need help or feel stuck? Talk to our AI bot!</p>
            <button className="mt-3 px-4 py-2 bg-yellow-400 text-white rounded-md hover:bg-yellow-500 transition text-sm">
              Chat with Bot
            </button>
          </div>
        </aside>
      </main>

      <button
        onClick={() => setShowCreatePost(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white rounded-full shadow-xl flex items-center justify-center transition-transform hover:scale-110"
      >
        <Plus className="w-6 h-6" />
      </button>

      {showCreatePost && (
        <CreatePostModal
          onClose={() => setShowCreatePost(false)}
          onCreatePost={createPost}
        />
      )}
    </div>
  );
};
