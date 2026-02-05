import { useState, useEffect } from 'react';
import { UserCheck, UserX, Shield, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Profile } from '../types/database';

export function AdminDashboard() {
  const [pendingUsers, setPendingUsers] = useState<Profile[]>([]);
  const [approvedUsers, setApprovedUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved'>('pending');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);

    const { data: pending } = await supabase
      .from('profiles')
      .select('*')
      .eq('approved', false)
      .eq('is_admin', false)
      .order('requested_at', { ascending: false });

    const { data: approved } = await supabase
      .from('profiles')
      .select('*')
      .eq('approved', true)
      .eq('is_admin', false)
      .order('created_at', { ascending: false });

    setPendingUsers(pending || []);
    setApprovedUsers(approved || []);
    setLoading(false);
  };

  const approveUser = async (userId: string) => {
    const { error } = await supabase
      .from('profiles')
      .update({ approved: true })
      .eq('id', userId);

    if (!error) {
      loadUsers();
    }
  };

  const revokeAccess = async (userId: string) => {
    const { error } = await supabase
      .from('profiles')
      .update({ approved: false })
      .eq('id', userId);

    if (!error) {
      loadUsers();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-6">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-white" />
          <h2 className="text-2xl font-bold text-white">Admin Dashboard</h2>
        </div>
      </div>

      <div className="border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex-1 px-6 py-4 font-medium transition-colors ${
              activeTab === 'pending'
                ? 'text-cyan-600 border-b-2 border-cyan-600 bg-cyan-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Clock className="h-5 w-5" />
              Pending Requests ({pendingUsers.length})
            </div>
          </button>
          <button
            onClick={() => setActiveTab('approved')}
            className={`flex-1 px-6 py-4 font-medium transition-colors ${
              activeTab === 'approved'
                ? 'text-cyan-600 border-b-2 border-cyan-600 bg-cyan-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <UserCheck className="h-5 w-5" />
              Approved Members ({approvedUsers.length})
            </div>
          </button>
        </div>
      </div>

      <div className="p-6">
        {activeTab === 'pending' && (
          <div className="space-y-4">
            {pendingUsers.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No pending requests</p>
              </div>
            ) : (
              pendingUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-cyan-300 transition-colors"
                >
                  <div>
                    <h3 className="font-semibold text-gray-900">{user.username}</h3>
                    <p className="text-sm text-gray-500">
                      Requested: {formatDate(user.requested_at)}
                    </p>
                  </div>
                  <button
                    onClick={() => approveUser(user.id)}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <UserCheck className="h-4 w-4" />
                    Approve
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'approved' && (
          <div className="space-y-4">
            {approvedUsers.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <UserCheck className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No approved members yet</p>
              </div>
            ) : (
              approvedUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-cyan-300 transition-colors"
                >
                  <div>
                    <h3 className="font-semibold text-gray-900">{user.username}</h3>
                    <p className="text-sm text-gray-500">
                      Joined: {formatDate(user.created_at)}
                    </p>
                  </div>
                  <button
                    onClick={() => revokeAccess(user.id)}
                    className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <UserX className="h-4 w-4" />
                    Revoke
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
