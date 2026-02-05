import { Code2, Users, BookOpen, TrendingUp, Menu, X, LogOut, Clock, Shield } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import { AuthModal } from './components/AuthModal';
import { PostFeed } from './components/PostFeed';
import { NewPostForm } from './components/NewPostForm';
import { AdminDashboard } from './components/AdminDashboard';

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const { user, profile, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Code2 className="h-8 w-8 text-cyan-600" />
              <div className="ml-2">
                <div className="text-xl font-bold text-gray-900">Tech Sync Friends</div>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              {user && profile?.approved && (
                <>
                  <a href="#posts" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
                    Posts
                  </a>
                  {profile?.is_admin && (
                    <a href="#admin" className="text-gray-600 hover:text-gray-900 transition-colors font-medium flex items-center gap-1">
                      <Shield className="h-4 w-4" />
                      Admin
                    </a>
                  )}
                </>
              )}
              <a href="#about" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
                About
              </a>
              {user ? (
                <div className="flex items-center gap-4">
                  {profile?.is_admin && (
                    <span className="text-xs bg-cyan-600 text-white px-2 py-1 rounded-full font-medium">
                      Admin
                    </span>
                  )}
                  <span className="text-sm text-gray-600">
                    {profile?.username || 'Welcome'}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="bg-cyan-600 text-white px-6 py-2 rounded-lg hover:bg-cyan-700 transition-colors font-semibold"
                >
                  Join Group
                </button>
              )}
            </div>

            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100">
            <div className="px-4 pt-2 pb-4 space-y-2">
              {user && profile?.approved && (
                <>
                  <a href="#posts" className="block py-2 text-gray-600 hover:text-gray-900">
                    Posts
                  </a>
                  {profile?.is_admin && (
                    <a href="#admin" className="block py-2 text-gray-600 hover:text-gray-900">
                      Admin Dashboard
                    </a>
                  )}
                </>
              )}
              <a href="#about" className="block py-2 text-gray-600 hover:text-gray-900">
                About
              </a>
              {user ? (
                <button
                  onClick={handleSignOut}
                  className="w-full text-left py-2 text-gray-600 hover:text-gray-900"
                >
                  Sign Out
                </button>
              ) : (
                <button
                  onClick={() => {
                    setAuthModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full bg-cyan-600 text-white px-6 py-2 rounded-lg hover:bg-cyan-700 transition-colors mt-2 font-semibold"
                >
                  Join Group
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 via-blue-50 to-white -z-10"></div>
        <div className="absolute top-20 right-10 w-72 h-72 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-fade-in-up">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Share Tech.<br />
              <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                Learn Together.
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              A community hub for Tech Sync Friends WhatsApp group. Share interesting tech articles,
              discuss innovations, and stay updated with the latest in technology.
            </p>
            {!user && (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="group bg-cyan-600 text-white px-8 py-4 rounded-lg hover:bg-cyan-700 transition-all inline-flex items-center gap-2 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Join the Community
                <Users className="h-5 w-5 group-hover:scale-110 transition-transform" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Admin Dashboard Section */}
      {user && profile?.is_admin && (
        <section id="admin" className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <AdminDashboard />
          </div>
        </section>
      )}

      {/* Posts Feed Section */}
      <section id="posts" className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Latest Tech Articles
            </h2>
            <p className="text-xl text-gray-600">
              Discover and share interesting technology articles with the community
            </p>
          </div>

          {!user ? (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Members Only Content
                </h3>
                <p className="text-gray-600 mb-6">
                  Join Tech Sync Friends to view and share technology articles with the community.
                </p>
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="bg-cyan-600 text-white px-8 py-3 rounded-lg hover:bg-cyan-700 transition-colors font-semibold"
                >
                  Join the Community
                </button>
              </div>
            </div>
          ) : !profile?.approved ? (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto bg-white rounded-2xl p-8 border border-gray-200 shadow-lg">
                <Clock className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Approval Pending
                </h3>
                <p className="text-gray-600 mb-4">
                  Your request to join Tech Sync Friends is being reviewed by an admin.
                  You'll be able to view and post content once your request is approved.
                </p>
                <p className="text-sm text-gray-500">
                  This usually takes less than 24 hours.
                </p>
              </div>
            </div>
          ) : (
            <PostFeed key={refreshKey} />
          )}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              What We Do
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tech Sync Friends is a community of technology enthusiasts sharing knowledge and staying updated.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group p-8 rounded-2xl border border-gray-200 hover:border-cyan-300 hover:shadow-xl transition-all duration-300 bg-white">
              <div className="bg-cyan-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BookOpen className="h-7 w-7 text-cyan-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Share Knowledge</h3>
              <p className="text-gray-600 leading-relaxed">
                Post interesting tech articles, blog posts, and resources. Help others discover
                valuable content across all technology domains.
              </p>
            </div>

            <div className="group p-8 rounded-2xl border border-gray-200 hover:border-cyan-300 hover:shadow-xl transition-all duration-300 bg-white">
              <div className="bg-blue-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Engage & Discuss</h3>
              <p className="text-gray-600 leading-relaxed">
                Like, comment, and interact with posts from other members. Share your thoughts
                and learn from diverse perspectives.
              </p>
            </div>

            <div className="group p-8 rounded-2xl border border-gray-200 hover:border-cyan-300 hover:shadow-xl transition-all duration-300 bg-white">
              <div className="bg-green-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="h-7 w-7 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Stay Updated</h3>
              <p className="text-gray-600 leading-relaxed">
                Keep up with the latest trends in AI, web development, cybersecurity, and more.
                Never miss important tech updates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Code2 className="h-8 w-8 text-cyan-600" />
              <span className="ml-2 text-xl font-bold text-white">Tech Sync Friends</span>
            </div>
            <div className="text-gray-400 text-center md:text-right">
              <p>A community hub for technology enthusiasts</p>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-500 text-sm">
            © 2024 Tech Sync Friends. Built with passion for technology.
          </div>
        </div>
      </footer>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />

      {user && profile?.approved && <NewPostForm onPostCreated={() => setRefreshKey((k) => k + 1)} />}
    </div>
  );
}

export default App;
