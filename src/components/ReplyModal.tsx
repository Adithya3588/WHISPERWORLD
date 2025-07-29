import React, { useState } from 'react';
import { X, Heart, Send, Clock } from 'lucide-react';
import { Post } from '../types';
import toast from 'react-hot-toast';

interface ReplyModalProps {
  post: Post;
  userCode: string;
  onClose: () => void;
  onAddReply: (postId: string, content: string) => Promise<{ success: boolean; message: string }>;
  onLikeReply: (postId: string, replyId: string, isLiked: boolean) => void;
}

export const ReplyModal: React.FC<ReplyModalProps> = ({
  post,
  userCode,
  onClose,
  onAddReply,
  onLikeReply,
}) => {
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    setSubmitting(true);
    const result = await onAddReply(post.id, replyContent.trim());
    
    if (result.success) {
      setReplyContent('');
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
    setSubmitting(false);
  };

  const getTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${diffInDays}d ago`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden border border-white/10 shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-semibold text-white">Replies</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/5 text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col max-h-[calc(80vh-140px)]">
          {/* Original Post */}
          <div className="p-6 border-b border-white/5">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {post.authorCode.slice(-2)}
                </span>
              </div>
              <span className="text-gray-300 text-sm">Anonymous #{post.authorCode.slice(-4)}</span>
              <div className="flex items-center space-x-1 text-gray-400 text-xs">
                <Clock className="w-3 h-3" />
                <span>{getTimeAgo(post.createdAt)}</span>
              </div>
            </div>
            <p className="text-white leading-relaxed">{post.content}</p>
          </div>

          {/* Replies */}
          <div className="flex-1 overflow-y-auto">
            {post.replies && post.replies.length > 0 ? (
              <div className="p-6 space-y-4">
                {post.replies.map((reply) => {
                  const isReplyLiked = reply.likedBy?.includes(userCode) || false;
                  return (
                    <div key={reply.id} className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">
                              {reply.authorCode.slice(-2)}
                            </span>
                          </div>
                          <span className="text-gray-400 text-sm">
                            Anonymous #{reply.authorCode.slice(-4)}
                          </span>
                          <div className="flex items-center space-x-1 text-gray-500 text-xs">
                            <Clock className="w-3 h-3" />
                            <span>{getTimeAgo(reply.createdAt)}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => onLikeReply(post.id, reply.id, isReplyLiked)}
                          className={`flex items-center space-x-1 px-2 py-1 rounded transition-colors ${
                            isReplyLiked
                              ? 'text-red-400 bg-red-500/20'
                              : 'text-gray-400 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${isReplyLiked ? 'fill-current' : ''}`} />
                          <span className="text-sm">{reply.likes || 0}</span>
                        </button>
                      </div>
                      <p className="text-white">{reply.content}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 text-center text-gray-400">
                No replies yet. Be the first to reply!
              </div>
            )}
          </div>

          {/* Reply Form */}
          <form onSubmit={handleSubmitReply} className="p-6 border-t border-white/5">
            <div className="flex space-x-3">
              <div className="flex-1">
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write your reply..."
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                  maxLength={500}
                />
                <div className="mt-2 text-right text-xs text-gray-400">
                  {replyContent.length}/500
                </div>
              </div>
              <button
                type="submit"
                disabled={!replyContent.trim() || submitting}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-600 disabled:to-gray-700 disabled:opacity-50 text-white rounded-lg transition-all duration-200 flex items-center space-x-2"
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};