import { useState, useEffect } from 'react';
import { subscriptionsAPI } from '../api';

const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const StatusBadge = ({ status }) => {
  const classes = {
    active: 'badge-active',
    expired: 'badge-expired',
    cancelled: 'badge-cancelled',
  };
  return <span className={`badge ${classes[status] || 'badge-none'}`}>{status}</span>;
};

const StatCard = ({ label, value, color }) => (
  <div className="card">
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{label}</p>
    <p className={`text-3xl font-display font-bold ${color}`}>{value}</p>
  </div>
);

const AdminSubscriptionsPage = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (filter) params.status = filter;

      const [subsRes, statsRes] = await Promise.all([
        subscriptionsAPI.getAllSubscriptions(params),
        subscriptionsAPI.getStats(),
      ]);

      setSubscriptions(subsRes.data.data);
      setTotalPages(subsRes.data.totalPages);
      setTotal(subsRes.data.total);
      setStats(statsRes.data.data);
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [filter, page]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8 animate-fade-in-up">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
          <span className="badge bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">Admin</span>
        </div>
        <p className="text-slate-500 dark:text-slate-400">Monitor and manage all user subscriptions</p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stagger-children">
          <StatCard label="Active Subscriptions" value={stats.totalActive} color="text-emerald-600 dark:text-emerald-400" />
          <StatCard label="Expired" value={stats.totalExpired} color="text-red-600 dark:text-red-400" />
          <StatCard label="Cancelled" value={stats.totalCancelled} color="text-slate-600 dark:text-slate-400" />
          <StatCard label="Total Revenue" value={`$${stats.totalRevenue.toFixed(2)}`} color="text-blue-600 dark:text-blue-400" />
        </div>
      )}

      {/* Table */}
      <div className="card animate-fade-in-up">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h2 className="font-display font-bold text-xl text-slate-900 dark:text-white">Subscriptions</h2>
            <p className="text-sm text-slate-400">{total} total records</p>
          </div>
          <div className="flex items-center gap-2">
            {['', 'active', 'expired', 'cancelled'].map((s) => (
              <button
                key={s}
                onClick={() => { setFilter(s); setPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filter === s
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {s === '' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : subscriptions.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-3">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
            </svg>
            No subscriptions found
          </div>
        ) : (
          <div className="overflow-x-auto -mx-6">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  {['User', 'Plan', 'Start', 'End', 'Status', 'Transaction'].map((h) => (
                    <th key={h} className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {subscriptions.map((sub) => (
                  <tr key={sub._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white text-sm">{sub.user_id?.name}</p>
                        <p className="text-xs text-slate-400">{sub.user_id?.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-slate-700 dark:text-slate-200 text-sm">{sub.plan_id?.name}</p>
                        <p className="text-xs text-slate-400">${sub.plan_id?.price}/mo</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                      {formatDate(sub.start_date)}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                      {formatDate(sub.end_date)}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={sub.status} />
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs text-slate-400 dark:text-slate-500">
                        {sub.transactionId || '—'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
            <p className="text-sm text-slate-400">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-secondary text-sm py-2 px-3 disabled:opacity-40"
              >
                ← Prev
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="btn-secondary text-sm py-2 px-3 disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSubscriptionsPage;
