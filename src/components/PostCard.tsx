import { useState, useEffect } from 'react';
import { Heart, MessageCircle, ExternalLink, User } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Post, Comment } from '../types/database';

interface PostCardProps {
  post: Post;
  onUpdate: () => void;
}

export function PostCard({ post, onUpdate }: PostCardProps) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadLikes();
    loadComments();
  }, [post.id, user]);

  const loadLikes = async () => {
    const { data: likes } = await supabase
      .from('likes')
      .select('*')
      .eq('post_id', post.id);

    setLikeCount(likes?.length || 0);

    if (user && likes) {
      setLiked(likes.some((like) => like.user_id === user.id));
    }
  };

  const loadComments = async () => {
    const { data } = await supabase
      .from('comments')
      .select('*, profiles(username)')
      .eq('post_id', post.id)
      .order('created_at', { ascending: true });

    setComments(data || []);
  };

  const handleLike = async () => {
    if (!user) return;

    if (liked) {
      await supabase
        .from('likes')
        .delete()
        .eq('post_id', post.id)
        .eq('user_id', user.id);
    } else {
      await supabase.from('likes').insert({
        post_id: post.id,
        user_id: user.id,
      });
    }

    loadLikes();
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    setLoading(true);
    await supabase.from('comments').insert({
      post_id: post.id,
      user_id: user.id,
      content: newComment.trim(),
    });

    setNewComment('');
    loadComments();
    setLoading(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
          {post.profiles?.username?.[0].toUpperCase() || <User className="h-5 w-5" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-gray-900">
              {post.profiles?.username || 'Anonymous'}
            </span>
            <span className="text-gray-400">•</span>
            <span className="text-sm text-gray-500">{formatDate(post.created_at)}</span>
            <span className="px-2 py-1 bg-cyan-100 text-cyan-700 rounded-full text-xs font-medium">
              {post.category}
            </span>
          </div>
        </div>
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h3>

      {post.description && (
        <p className="text-gray-600 mb-4 leading-relaxed">{post.description}</p>
      )}

      <a
        href={post.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-cyan-600 hover:text-cyan-700 font-medium mb-4"
      >
        Read Article
        <ExternalLink className="h-4 w-4" />
      </a>

      <div className="flex items-center gap-6 pt-4 border-t border-gray-100">
        <button
          onClick={handleLike}
          disabled={!user}
          className={`flex items-center gap-2 transition-colors ${
            liked
              ? 'text-red-600'
              : 'text-gray-600 hover:text-red-600'
          } ${!user && 'opacity-50 cursor-not-allowed'}`}
        >
          <Heart className={`h-5 w-5 ${liked ? 'fill-current' : ''}`} />
          <span className="font-medium">{likeCount}</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 text-gray-600 hover:text-cyan-600 transition-colors"
        >
          <MessageCircle className="h-5 w-5" />
          <span className="font-medium">{comments.length}</span>
        </button>
      </div>

      {showComments && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="space-y-4 mb-4">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                  {comment.profiles?.username?.[0].toUpperCase() || 'A'}
                </div>
                <div className="flex-1 bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm text-gray-900">
                      {comment.profiles?.username || 'Anonymous'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDate(comment.created_at)}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>

          {user && (
            <form onSubmit={handleComment} className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-600 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={loading || !newComment.trim()}
                className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors disabled:opacity-50"
              >
                Post
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
