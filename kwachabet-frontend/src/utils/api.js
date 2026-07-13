import axios from 'axios';
import Cookies from 'js-cookie';

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

const api = axios.create({ baseURL: BASE, timeout: 30000 });

api.interceptors.request.use((config) => {
  const token = Cookies.get('kb_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (typeof window !== 'undefined') {
    const fp = localStorage.getItem('kb_fp');
    if (fp) config.headers['X-Device-Fingerprint'] = fp;
  }
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    const msg = err.response?.data?.error || 'Something went wrong.';
    if (err.response?.status === 401) {
      Cookies.remove('kb_token');
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject({ message: msg, status: err.response?.status });
  }
);

export const authAPI = {
  // Registration — single step, phone + PIN, no OTP
  initiateRegister: (d) => api.post('/auth/register', d),

  // Login — phone + PIN
  login:            (d) => api.post('/auth/login', d),

  // PIN management
  setPin:           (d) => api.post('/auth/pin/set', d),
  verifyPin:        (d) => api.post('/auth/pin/verify', d),

  // OTP — withdrawal only
  requestOTP:       ()  => api.post('/auth/otp/withdrawal'),
  verifyOTP:        (d) => api.post('/auth/otp/verify', d),
};

export const walletAPI = {
  getBalance:      ()       => api.get('/wallet/balance'),
  getTransactions: (p)      => api.get('/wallet/transactions', { params: p }),
  deposit:         (d)      => api.post('/wallet/deposit', d),
  withdraw:        (d, cfg) => api.post('/wallet/withdraw', d, cfg),
};

export const bettingAPI = {
  placeBet:    (d) => api.post('/betting/place', d),
  getTickets:  (p) => api.get('/betting/tickets', { params: p }),
  getTicket:   (c) => api.get(`/betting/tickets/${c}`),
  checkTicket: (c) => api.get(`/betting/check/${c}`),
};

export const oddsAPI = {
  getEvents:   (p) => api.get('/odds/events', { params: p }),
  getFeatured: ()  => api.get('/odds/featured'),
  getSports:   ()  => api.get('/odds/sports'),
};

export const adminAPI = {
  getDashboard:          ()       => api.get('/admin/dashboard/stats'),
  getUsers:              (p)      => api.get('/admin/users', { params: p }),
  suspendUser:           (id, r)  => api.patch(`/admin/users/${id}/suspend`, { reason: r }),
  unsuspendUser:         (id)     => api.patch(`/admin/users/${id}/unsuspend`),
  getTickets:            (p)      => api.get('/admin/tickets', { params: p }),
  getPendingWithdrawals: ()       => api.get('/admin/withdrawals/pending'),
  approveWithdrawal:     (id)     => api.patch(`/admin/withdrawals/${id}/approve`),
  rejectWithdrawal:      (id, r)  => api.patch(`/admin/withdrawals/${id}/reject`, { reason: r }),
  getFraudDashboard:     ()       => api.get('/admin/fraud/dashboard'),
  resolveFraudFlag:      (id, n)  => api.patch(`/admin/fraud/flags/${id}/resolve`, { notes: n }),
  getCampaigns:          ()       => api.get('/admin/bonus/campaigns'),
  assignFreeBet:         (d)      => api.post('/admin/bonus/free-bet', d),
};

export default api;
