import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Post } from '../types/database';
import { PostCard } from './PostCard';
import { Loader } from 'lucide-react';

export function PostFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('All');

  const categories = [
    'All',
    'AI & Machine Learning',
    'Web Development',
    'Mobile Development',
    'DevOps & Cloud',
    'Cybersecurity',
    'Data Science',
    'Blockchain',
    'General Tech',
  ];

  useEffect(() => {
    loadPosts();
  }, [filter]);

  const loadPosts = async () => {
    setLoading(true);
    let query = supabase
      .from('posts')
      .select('*, profiles(username, avatar_url)')
      .order('created_at', { ascending: false });

    if (filter !== 'All') {
      query = query.eq('category', filter);
    }

    const { data } = await query;
    setPosts(data || []);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 overflow-x-auto">
        <div className="flex gap-2 pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                filter === category
                  ? 'bg-cyan-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader className="h-8 w-8 text-cyan-600 animate-spin" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">
            No posts yet. Be the first to share a tech article!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} onUpdate={loadPosts} />
          ))}
        </div>
      )}
    </div>
  );
}
