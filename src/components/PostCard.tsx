import React, { useState } from 'react';
import { Heart, MessageCircle, Flag, Clock } from 'lucide-react';
import { Post } from '../types';
import { ReplyModal } from './ReplyModal';

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
  const [showReplyModal, setShowReplyModal] = useState(false);
  const isLiked = post.likedBy?.includes(userCode) || false;
  const timeAgo = getTimeAgo(post.createdAt);

  return (
    <>
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-200 shadow-lg">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">
                {post.authorCode.slice(-2)}
              </span>
            </div>
            <span className="text-gray-300 text-sm">Anonymous #{post.authorCode.slice(-4)}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-400 text-xs">
            <Clock className="w-3 h-3" />
            <span>{timeAgo}</span>
          </div>
        </div>

        <p className="text-white mb-4 leading-relaxed">{post.content}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onLike(post.id, isLiked)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
                isLiked
                  ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-sm">{post.likes || 0}</span>
            </button>

            <button
              onClick={() => setShowReplyModal(true)}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition-colors duration-200"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm">{post.replies?.length || 0}</span>
            </button>
          </div>

          <button
            onClick={() => onReport(post.id)}
            className="p-2 rounded-lg bg-white/5 text-gray-300 hover:bg-red-500/20 hover:text-red-400 transition-colors duration-200"
            title="Report post"
          >
            <Flag className="w-4 h-4" />
          </button>
        </div>

        {post.replies && post.replies.length > 0 && (
          <div className="mt-4 pt-4 border-t border-white/5">
            <div className="space-y-3">
              {post.replies.slice(0, 2).map((reply) => {
                const isReplyLiked = reply.likedBy?.includes(userCode) || false;
                return (
                  <div key={reply.id} className="bg-white/5 rounded-lg p-3 border border-white/5">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">
                            {reply.authorCode.slice(-2)}
                          </span>
                        </div>
                        <span className="text-gray-400 text-xs">
                          Anonymous #{reply.authorCode.slice(-4)}
                        </span>
                      </div>
                      <button
                        onClick={() => onLikeReply(post.id, reply.id, isReplyLiked)}
                        className={`flex items-center space-x-1 text-xs px-2 py-1 rounded transition-colors ${
                          isReplyLiked
                            ? 'text-red-400'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        <Heart className={`w-3 h-3 ${isReplyLiked ? 'fill-current' : ''}`} />
                        <span>{reply.likes || 0}</span>
                      </button>
                    </div>
                    <p className="text-white text-sm">{reply.content}</p>
                  </div>
                );
              })}
              {post.replies.length > 2 && (
                <button
                  onClick={() => setShowReplyModal(true)}
                  className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                >
                  View all {post.replies.length} replies
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {showReplyModal && (
        <ReplyModal
          post={post}
          userCode={userCode}
          onClose={() => setShowReplyModal(false)}
          onAddReply={onAddReply}
          onLikeReply={onLikeReply}
        />
      )}
    </>
  );
};

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 1) {
    return 'Just now';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else {
    return `${diffInDays}d ago`;
  }
}