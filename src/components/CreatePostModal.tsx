import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import toast from 'react-hot-toast';

interface CreatePostModalProps {
  onClose: () => void;
  onCreatePost: (content: string) => Promise<{ success: boolean; message: string }>;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  onClose,
  onCreatePost,
}) => {
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setSubmitting(true);
    const result = await onCreatePost(content.trim());
    
    if (result.success) {
      setContent('');
      onClose();
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl w-full max-w-lg border border-white/10 shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-semibold text-white">Share Your Thoughts</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/5 text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind? Share it anonymously..."
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={6}
            maxLength={500}
            autoFocus
          />
          
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-400">
              {content.length}/500 characters
            </div>
            <button
              type="submit"
              disabled={!content.trim() || submitting}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-600 disabled:to-gray-700 disabled:opacity-50 text-white rounded-lg transition-all duration-200 flex items-center space-x-2"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Post</span>
                </>
              )}
            </button>
          </div>

          <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/5">
            <p className="text-xs text-gray-300">
              Your post will be completely anonymous. Please be respectful and avoid sharing personal information, links, or inappropriate content.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};