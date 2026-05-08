import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { subscriptionsAPI } from '../api';
import { useAuth } from '../context/AuthContext';

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
};

const getDaysRemaining = (endDate) => {
  const now = new Date();
  const end = new Date(endDate);
  const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
  return Math.max(0, diff);
};

const StatusBadge = ({ status }) => {
  const classes = {
    active: 'badge-active',
    expired: 'badge-expired',
    cancelled: 'badge-cancelled',
  };
  return <span className={classes[status] || 'badge-none'}>{status}</span>;
};

const DashboardPage = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [lastSubscription, setLastSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [message, setMessage] = useState('');

  const fetchSubscription = async () => {
    try {
      const res = await subscriptionsAPI.getMySubscription();
      setSubscription(res.data.data);
      setLastSubscription(res.data.lastSubscription);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSubscription(); }, []);

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel your subscription?')) return;
    setCancelling(true);
    try {
      await subscriptionsAPI.cancelSubscription();
      setMessage('Subscription cancelled successfully.');
      fetchSubscription();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to cancel subscription.');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const plan = subscription?.plan_id;
  const daysLeft = subscription ? getDaysRemaining(subscription.end_date) : 0;
  const progressPct = plan
    ? Math.round((daysLeft / plan.duration) * 100)
    : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page header */}
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white">
          Welcome back, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your subscription and account</p>
      </div>

      {message && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl text-sm text-blue-700 dark:text-blue-400 animate-fade-in">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-children">
        {/* Current Subscription Card */}
        <div className="md:col-span-2 card animate-fade-in-up">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="font-display font-bold text-xl text-slate-900 dark:text-white">Current Plan</h2>
              <p className="text-sm text-slate-400 mt-0.5">Your active subscription details</p>
            </div>
            {subscription && <StatusBadge status={subscription.status} />}
          </div>

          {subscription && plan ? (
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 dark:text-blue-400">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-display font-bold text-2xl text-slate-900 dark:text-white">{plan.name}</h3>
                  <p className="text-slate-500 dark:text-slate-400">${plan.price}/month</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-5">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-500 dark:text-slate-400">Time remaining</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{daysLeft} days left</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <p className="text-xs text-slate-400 mb-1">Start Date</p>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{formatDate(subscription.start_date)}</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <p className="text-xs text-slate-400 mb-1">End Date</p>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{formatDate(subscription.end_date)}</p>
                </div>
              </div>

              {/* Features */}
              <div className="mb-6">
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">Included Features</p>
                <div className="grid grid-cols-1 gap-1.5">
                  {plan.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      {f}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Link to="/plans" className="btn-primary flex-1 text-center text-sm">
                  Upgrade / Change Plan
                </Link>
                <button
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="btn-danger text-sm flex items-center gap-2"
                >
                  {cancelling ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>
              <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-1">No active subscription</h3>
              <p className="text-sm text-slate-400 mb-6">
                {lastSubscription ? `Your ${lastSubscription.plan_id?.name} plan has ${lastSubscription.status}.` : 'Choose a plan to get started.'}
              </p>
              <Link to="/plans" className="btn-primary inline-block">Browse Plans</Link>
            </div>
          )}
        </div>

        {/* Account Info Card */}
        <div className="card animate-fade-in-up">
          <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-5">Account</h2>
          <div className="space-y-4">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-display font-bold text-2xl mx-auto">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="text-center">
              <p className="font-semibold text-slate-900 dark:text-white">{user?.name}</p>
              <p className="text-sm text-slate-400">{user?.email}</p>
              <span className="badge badge-active mt-2">{user?.role}</span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Plan Status</span>
              <span className="font-medium text-slate-700 dark:text-slate-200">
                {subscription ? '✅ Active' : '❌ None'}
              </span>
            </div>
            {subscription && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Transaction</span>
                <span className="font-mono text-xs text-slate-500 dark:text-slate-400 truncate max-w-[120px]">
                  {subscription.transactionId}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
