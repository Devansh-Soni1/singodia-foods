import React, { useState, useEffect } from 'react';
import { 
  Users, Search, Trash2, Mail, Phone, Calendar, ShoppingBag, 
  ShieldCheck, RefreshCw, AlertCircle, CheckCircle 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { adminAPI } from '../../services/api';

export const AdminUsers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getCustomers();
      if (Array.isArray(res.customers)) {
        setCustomers(res.customers);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to load users list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    setDeletingId(userToDelete._id);

    try {
      await adminAPI.deleteCustomer(userToDelete._id);
      setCustomers(prev => prev.filter(c => c._id !== userToDelete._id));
      toast.success(`User "${userToDelete.name}" deleted successfully`);
      setUserToDelete(null);
    } catch (err) {
      toast.error(err.message || 'Failed to delete user');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredCustomers = customers.filter(c => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      (c.name || '').toLowerCase().includes(q) ||
      (c.email || '').toLowerCase().includes(q) ||
      (c.phone || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-bold font-serif text-gray-900">
              Registered Customers (ग्राहक सूची)
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
              {customers.length} Users
            </span>
          </div>
          <p className="text-xs text-gray-500">
            View all Google-verified customers, registered profiles, and order activity. Passwords are fully encrypted.
          </p>
        </div>

        <button
          onClick={fetchUsers}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh List</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs flex items-center gap-3">
        <Search className="w-4 h-4 text-gray-400 shrink-0 ml-1" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by customer name, email address, or mobile number..."
          className="w-full text-xs font-medium bg-transparent focus:outline-none text-gray-900 placeholder:text-gray-400"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-xs font-bold text-gray-400 hover:text-gray-600 px-2"
          >
            Clear
          </button>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs font-semibold text-gray-400 animate-pulse space-y-2">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-brand-green" />
            <p>Loading customers list from database...</p>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="p-12 text-center text-gray-500 space-y-2">
            <Users className="w-10 h-10 mx-auto text-gray-300" />
            <h3 className="font-bold text-sm text-gray-800 font-serif">
              {searchQuery ? 'No customers match your search' : 'No registered customers yet'}
            </h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              {searchQuery ? 'Try searching with a different name or email.' : 'Customers who sign in with Google or create an account will automatically show up here.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-gray-50/80 text-gray-500 font-bold uppercase tracking-wider text-[10px] border-b border-gray-200">
                <tr>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Email & Verification</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Joined Date</th>
                  <th className="p-4">Orders</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCustomers.map((user) => {
                  const initial = (user.name || 'U').charAt(0).toUpperCase();
                  const isGoogleUser = !!user.googleId || !!user.avatar;

                  return (
                    <tr key={user._id} className="hover:bg-cream-50/50 transition-colors">
                      {/* Customer Info */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-9 h-9 rounded-full object-cover border border-amber-200 shadow-2xs"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 text-white font-bold text-sm flex items-center justify-center shadow-2xs">
                              {initial}
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-gray-900 text-xs flex items-center gap-1.5">
                              <span>{user.name || 'Anonymous User'}</span>
                              {isGoogleUser && (
                                <span className="inline-flex items-center text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200" title="Verified Google Account">
                                  Google
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-gray-400 block">
                              ID: {user._id.slice(-6)}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="p-4">
                        <div className="space-y-0.5">
                          <a 
                            href={`mailto:${user.email}`} 
                            className="font-semibold text-brand-green hover:underline flex items-center gap-1.5 text-xs"
                          >
                            <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <span>{user.email}</span>
                          </a>
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-medium">
                            <CheckCircle className="w-2.5 h-2.5" /> Verified
                          </span>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="p-4 text-gray-600 font-medium">
                        {user.phone ? (
                          <div className="flex items-center gap-1.5 text-xs text-gray-800">
                            <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <span>{user.phone}</span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-gray-400 italic">— Not provided</span>
                        )}
                      </td>

                      {/* Joined Date */}
                      <td className="p-4 text-gray-600">
                        <div className="flex items-center gap-1.5 text-xs font-medium">
                          <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span>
                            {user.createdAt
                              ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                              : 'Recent'}
                          </span>
                        </div>
                      </td>

                      {/* Orders Count & Total Spent */}
                      <td className="p-4">
                        <div className="space-y-0.5">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-cream-100 text-charcoal border border-cream-300">
                            <ShoppingBag className="w-3 h-3 text-amber-700" />
                            <span>{user.orderCount || 0} Orders</span>
                          </span>
                          {user.totalSpent > 0 && (
                            <span className="text-[10px] font-semibold text-emerald-700 block ml-1">
                              ₹{user.totalSpent} spent
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Action: Delete User */}
                      <td className="p-4 text-right">
                        <button
                          type="button"
                          onClick={() => setUserToDelete(user)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 font-bold text-xs transition-colors cursor-pointer"
                          title="Delete customer account"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Delete</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {userToDelete && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4 overflow-y-auto cursor-pointer"
          onClick={() => setUserToDelete(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 border border-gray-200 shadow-2xl animate-in fade-in zoom-in-95 duration-150 my-auto cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-bold text-base text-gray-900 font-serif">
                Delete Customer Account?
              </h3>
              <p className="text-xs text-gray-500">
                Are you sure you want to delete <strong className="text-gray-800">{userToDelete.name}</strong> ({userToDelete.email})? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                disabled={deletingId === userToDelete._id}
                onClick={() => setUserToDelete(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deletingId === userToDelete._id}
                onClick={handleDeleteUser}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {deletingId === userToDelete._id ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminUsers;

