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
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-blue-100">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Share Your Thoughts</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 bg-gradient-to-br from-white via-blue-50 to-cyan-50 rounded-b-2xl">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind? Share it anonymously..."
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none shadow-sm"
            rows={6}
            maxLength={500}
            autoFocus
          />

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">
              {content.length}/500 characters
            </div>
            <button
              type="submit"
              disabled={!content.trim() || submitting}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-gray-300 disabled:to-gray-400 disabled:opacity-60 text-white rounded-lg transition-all duration-200 flex items-center space-x-2 shadow-md"
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

          <div className="mt-5 p-4 bg-yellow-50 border border-yellow-100 rounded-lg text-sm text-gray-700">
            Your post will be <strong>completely anonymous</strong>. Please be respectful and avoid sharing personal info, links, or inappropriate content.
          </div>
        </form>
      </div>
    </div>
  );
};
