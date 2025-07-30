import React from 'react';
import { Heart, MessageCircle, Flag, Clock } from 'lucide-react';
import { Post } from '../types';
import { useNavigate } from 'react-router-dom';

interface PostCardProps {
  post: Post;
  userCode: string;
  onLike: (postId: string, isLiked: boolean) => void;
  onReport: (postId: string) => void;
  onAddReply: (postId: string, content: string) => Promise<{ success: boolean; message: string }>;
  onLikeReply: (postId: string, replyId: string, isLiked: boolean) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  userCode,
  onLike,
  onReport,
  onAddReply,
  onLikeReply,
}) => {
  const isLiked = post.likedBy?.includes(userCode) || false;
  const timeAgo = getTimeAgo(post.createdAt);
  const navigate = useNavigate();

  return (
    <div className="bg-white/90 border border-pink-200 rounded-2xl p-6 shadow-md backdrop-blur-sm transition hover:shadow-lg">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow">
            <span className="text-white text-sm font-bold">
              {post.authorCode.slice(-2)}
            </span>
          </div>
          <span className="text-gray-600 text-sm font-medium">Anonymous #{post.authorCode.slice(-4)}</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-400 text-xs">
          <Clock className="w-3 h-3" />
          <span>{timeAgo}</span>
        </div>
      </div>

      <p className="text-gray-800 mb-4 leading-relaxed">{post.content}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => onLike(post.id, isLiked)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
              isLiked
                ? 'bg-red-100 text-red-500 hover:bg-red-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            <span>{post.likes || 0}</span>
          </button>

          <button
            onClick={() => navigate(`/chat/${post.authorCode}`)}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Reply</span>
          </button>
        </div>

        <button
          onClick={() => onReport(post.id)}
          className="p-2 rounded-lg bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition"
          title="Report post"
        >
          <Flag className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - new Date(date).getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  return `${diffInDays}d ago`;
}
