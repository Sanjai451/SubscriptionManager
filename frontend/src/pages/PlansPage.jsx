import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { plansAPI, subscriptionsAPI } from '../api';
import { useAuth } from '../context/AuthContext';

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500 flex-shrink-0">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

// Simulated Payment Modal
const PaymentModal = ({ plan, onConfirm, onClose, loading }) => {
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [expiry, setExpiry] = useState('12/26');
  const [cvv, setCvv] = useState('123');
  const [name, setName] = useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 animate-fade-in-up">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display font-bold text-xl text-slate-900 dark:text-white">Simulated Payment</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">This is a demo — no real charges</p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Plan summary */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">{plan.name} Plan</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{plan.duration} days access</p>
            </div>
            <p className="text-2xl font-display font-bold text-blue-600 dark:text-blue-400">
              ${plan.price === 0 ? 'Free' : plan.price}
            </p>
          </div>

          {plan.price > 0 && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Card Number</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="input-field font-mono"
                  maxLength={19}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Expiry</label>
                  <input type="text" value={expiry} onChange={(e) => setExpiry(e.target.value)} className="input-field font-mono" maxLength={5} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">CVV</label>
                  <input type="text" value={cvv} onChange={(e) => setCvv(e.target.value)} className="input-field font-mono" maxLength={3} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Cardholder Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className="input-field" />
              </div>
            </>
          )}

          <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            Payment is simulated — no real data is processed
          </div>

          <button
            onClick={() => onConfirm()}
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {loading ? (
              <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Processing...</>
            ) : plan.price === 0 ? 'Activate Free Plan' : `Pay $${plan.price}`}
          </button>
        </div>
      </div>
    </div>
  );
};

const PLAN_COLORS = {
  'Free': { badge: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300', ring: '', highlight: false },
  'Starter': { badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', ring: '', highlight: false },
  'Pro': { badge: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400', ring: 'ring-2 ring-violet-400 dark:ring-violet-500', highlight: true },
  'Enterprise': { badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', ring: '', highlight: false },
};

const PlansPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [subscribing, setSubscribing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await plansAPI.getAll();
        setPlans(res.data.data);
      } catch {
        setErrorMsg('Failed to load plans.');
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handleSelectPlan = (plan) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setSelectedPlan(plan);
  };

  const handleConfirmSubscription = async () => {
    if (!selectedPlan) return;
    setSubscribing(true);
    try {
      await subscriptionsAPI.subscribe(selectedPlan._id, { paymentMethod: 'card' });
      setSuccessMsg(`Successfully subscribed to ${selectedPlan.name} plan!`);
      setSelectedPlan(null);
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Subscription failed.');
      setSelectedPlan(null);
    } finally {
      setSubscribing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12 animate-fade-in-up">
        <h1 className="text-4xl font-display font-bold text-slate-900 dark:text-white mb-4">
          Choose your plan
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          Start free and scale as you grow. All plans include core features.
        </p>
      </div>

      {successMsg && (
        <div className="mb-8 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl text-center text-emerald-700 dark:text-emerald-400 font-medium animate-fade-in">
          ✅ {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-center text-red-600 dark:text-red-400 animate-fade-in">
          {errorMsg}
        </div>
      )}

      {/* Plans grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
        {plans.map((plan) => {
          const style = PLAN_COLORS[plan.name] || PLAN_COLORS['Starter'];
          return (
            <div
              key={plan._id}
              className={`card flex flex-col relative animate-fade-in-up ${style.ring} ${style.highlight ? 'shadow-lg' : ''}`}
            >
              {style.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-violet-600 text-white text-xs font-bold px-3 py-1 rounded-full">Most Popular</span>
                </div>
              )}

              <div className="mb-5">
                <span className={`badge ${style.badge} mb-3`}>{plan.name}</span>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-display font-bold text-slate-900 dark:text-white">
                    {plan.price === 0 ? 'Free' : `$${plan.price}`}
                  </span>
                  {plan.price > 0 && <span className="text-slate-400 mb-1">/month</span>}
                </div>
                <p className="text-sm text-slate-400 mt-1">{plan.duration} days per billing period</p>
              </div>

              <ul className="space-y-2.5 flex-1 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <CheckIcon />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSelectPlan(plan)}
                className={style.highlight ? 'btn-primary w-full' : 'btn-secondary w-full'}
              >
                {isAuthenticated ? 'Get started' : 'Sign up'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Payment Modal */}
      {selectedPlan && (
        <PaymentModal
          plan={selectedPlan}
          onConfirm={handleConfirmSubscription}
          onClose={() => setSelectedPlan(null)}
          loading={subscribing}
        />
      )}
    </div>
  );
};

export default PlansPage;
