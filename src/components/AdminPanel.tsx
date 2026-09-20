import React, { useState, useEffect, useMemo } from 'react';
import {
  Shield,
  Users,
  CheckCircle2,
  Clock,
  Search,
  Plus,
  Download,
  Trash2,
  Check,
  X,
  ExternalLink,
  ArrowLeft,
  KeyRound,
  FileSpreadsheet,
  FileJson,
  Layers,
  Database,
  RefreshCw,
  Eye,
} from 'lucide-react';
import { WhitelistSubmission, WhitelistWalletRecord, Task } from '../types.ts';
import { INITIAL_WHITELISTED_WALLETS, DEFAULT_TASKS } from '../data/mockData.ts';
import {
  ADMIN_PASSWORD,
  ADMIN_USERNAME,
  ADMIN_WALLET_ADDRESS,
  isSupabaseConfigured,
  saveWalletToSupabase,
  fetchWalletsFromSupabase,
  fetchSubmissionsFromSupabase,
} from '../utils/supabase.ts';

interface AdminPanelProps {
  onBackToSite: () => void;
  showToast: (type: 'success' | 'error' | 'info' | 'warning', message: string) => void;
}

const DEFAULT_ADMIN_PASS = 'bunink2026';

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBackToSite, showToast }) => {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('bunink_admin_auth') === 'true';
    }
    return false;
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState(false);

  // Active tab
  const [activeTab, setActiveTab] = useState<'wallets' | 'submissions' | 'tasks'>('wallets');

  // Wallets database state
  const [wallets, setWallets] = useState<Record<string, WhitelistWalletRecord>>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('bunink_wallets');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          // fallback
        }
      }
    }
    return INITIAL_WHITELISTED_WALLETS;
  });

  // Submissions state
  const [submissions, setSubmissions] = useState<WhitelistSubmission[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('bunink_submissions');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          // fallback
        }
      }
    }
    // Seed with initial applications if none exist
    return [
      {
        id: 'sub-1',
        walletAddress: '0x71c8413204c38ff240097621f37e42d713c72b22',
        submittedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        status: 'WHITELISTED',
        tier: 'Tier 1 Guaranteed (Wave 1)',
        allocation: '2 NFTs',
        proofs: [
          { id: 'task-1', title: 'Follow @Bunnink0 on X', proof: '@bunlover_alpha' },
          { id: 'task-2', title: 'Like & Repost Pinned Post', proof: 'https://x.com/bunlover_alpha/status/123' },
        ],
      },
      {
        id: 'sub-2',
        walletAddress: '0x1234567890123456789012345678901234567890',
        submittedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        status: 'PENDING',
        tier: 'Review Pending (Wave 2)',
        allocation: '1 NFT',
        proofs: [
          { id: 'task-1', title: 'Follow @Bunnink0 on X', proof: '@crypto_hops' },
          { id: 'task-2', title: 'Like & Repost Pinned Post', proof: '@crypto_hops retweeted' },
        ],
      },
    ];
  });

  // Tasks state
  const [tasks, setTasks] = useState<Task[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('bunink_tasks_config');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          // fallback
        }
      }
    }
    return DEFAULT_TASKS;
  });

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'WHITELISTED' | 'PENDING' | 'REJECTED'>('ALL');

  // Add single wallet modal/form
  const [showAddModal, setShowAddModal] = useState(false);
  const [newWalletAddress, setNewWalletAddress] = useState('');
  const [newWalletTier, setNewWalletTier] = useState('Tier 1 Guaranteed (Wave 1)');
  const [newWalletAllocation, setNewWalletAllocation] = useState('2 NFTs');

  // Bulk import modal
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkInput, setBulkInput] = useState('');
  const [bulkTier, setBulkTier] = useState('Wave 1 Guaranteed');
  const [bulkAllocation, setBulkAllocation] = useState('1 NFT');

  // View submission proofs modal
  const [selectedSubmission, setSelectedSubmission] = useState<WhitelistSubmission | null>(null);

  // Sync wallets to localStorage whenever updated
  useEffect(() => {
    localStorage.setItem('bunink_wallets', JSON.stringify(wallets));
  }, [wallets]);

  // Sync submissions to localStorage whenever updated
  useEffect(() => {
    localStorage.setItem('bunink_submissions', JSON.stringify(submissions));
  }, [submissions]);

  // Fetch live Supabase data on load if configured
  useEffect(() => {
    if (isAuthenticated && isSupabaseConfigured()) {
      fetchWalletsFromSupabase().then((remoteWallets) => {
        if (remoteWallets && Object.keys(remoteWallets).length > 0) {
          setWallets((prev) => ({ ...prev, ...remoteWallets }));
        }
      });
      fetchSubmissionsFromSupabase().then((remoteSubs) => {
        if (remoteSubs && remoteSubs.length > 0) {
          setSubmissions(remoteSubs);
        }
      });
    }
  }, [isAuthenticated]);

  // Handle Admin Login (supports Vercel ADMIN_PASSWORD, ADMIN_WALLET_ADDRESS, bunink2026, or admin)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = passwordInput.trim();
    const envPass = ADMIN_PASSWORD ? ADMIN_PASSWORD.trim() : '';

    const isMatch =
      (envPass && cleanInput === envPass) ||
      cleanInput === DEFAULT_ADMIN_PASS ||
      cleanInput === 'admin' ||
      (ADMIN_WALLET_ADDRESS && cleanInput.toLowerCase() === ADMIN_WALLET_ADDRESS.toLowerCase());

    if (isMatch) {
      setIsAuthenticated(true);
      sessionStorage.setItem('bunink_admin_auth', 'true');
      setAuthError(false);
      showToast('success', 'Admin access granted.');
    } else {
      setAuthError(true);
      showToast('error', 'Incorrect admin passcode.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('bunink_admin_auth');
    showToast('info', 'Logged out of admin panel.');
  };

  // Stats calculation
  const stats = useMemo(() => {
    const walletEntries = Object.entries(wallets) as [string, WhitelistWalletRecord][];
    const total = walletEntries.length;
    const whitelisted = walletEntries.filter(([, v]) => v.status === 'WHITELISTED').length;
    const pending = walletEntries.filter(([, v]) => v.status === 'PENDING').length;
    const rejected = walletEntries.filter(([, v]) => v.status === 'REJECTED').length;
    return { total, whitelisted, pending, rejected };
  }, [wallets]);

  // Filtered wallets list
  const filteredWallets = useMemo(() => {
    const walletEntries = Object.entries(wallets) as [string, WhitelistWalletRecord][];
    return walletEntries.filter(([address, record]) => {
      const matchesSearch = address.toLowerCase().includes(searchQuery.trim().toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || record.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [wallets, searchQuery, statusFilter]);

  // Add single wallet
  const handleAddWallet = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanAddress = newWalletAddress.trim().toLowerCase();
    if (!cleanAddress.startsWith('0x') || cleanAddress.length !== 42) {
      showToast('warning', 'Please enter a valid 42-character EVM address (0x...)');
      return;
    }

    setWallets((prev) => ({
      ...prev,
      [cleanAddress]: {
        status: 'WHITELISTED',
        tier: newWalletTier,
        allocation: newWalletAllocation,
        submittedAt: new Date().toISOString(),
      },
    }));

    setNewWalletAddress('');
    setShowAddModal(false);
    showToast('success', `Added ${cleanAddress.slice(0, 6)}... to whitelist database!`);
  };

  // Bulk import wallets
  const handleBulkImport = (e: React.FormEvent) => {
    e.preventDefault();
    const lines = bulkInput.split(/[\n,;]+/).map((s) => s.trim().toLowerCase()).filter(Boolean);
    const validAddresses = lines.filter((addr) => addr.startsWith('0x') && addr.length === 42);

    if (validAddresses.length === 0) {
      showToast('error', 'No valid EVM addresses found in input.');
      return;
    }

    setWallets((prev) => {
      const updated = { ...prev };
      validAddresses.forEach((addr) => {
        updated[addr] = {
          status: 'WHITELISTED',
          tier: bulkTier,
          allocation: bulkAllocation,
          submittedAt: new Date().toISOString(),
        };
      });
      return updated;
    });

    setBulkInput('');
    setShowBulkModal(false);
    showToast('success', `Successfully imported ${validAddresses.length} wallet addresses!`);
  };

  // Delete wallet from database
  const handleDeleteWallet = (address: string) => {
    if (!confirm(`Are you sure you want to remove ${address} from the database?`)) return;
    setWallets((prev) => {
      const updated = { ...prev };
      delete updated[address.toLowerCase()];
      return updated;
    });
    showToast('info', `Removed ${address.slice(0, 6)}... from whitelist.`);
  };

  // Update wallet status
  const handleUpdateWalletStatus = (address: string, newStatus: 'WHITELISTED' | 'PENDING' | 'REJECTED') => {
    const lower = address.toLowerCase();
    setWallets((prev) => {
      if (!prev[lower]) return prev;
      return {
        ...prev,
        [lower]: {
          ...prev[lower],
          status: newStatus,
        },
      };
    });

    // Also sync with submissions if present
    setSubmissions((prev) =>
      prev.map((sub) =>
        sub.walletAddress.toLowerCase() === lower ? { ...sub, status: newStatus } : sub
      )
    );

    showToast('success', `Updated status to ${newStatus} for ${address.slice(0, 6)}...`);
  };

  // Approve Submission
  const handleApproveSubmission = (sub: WhitelistSubmission) => {
    handleUpdateWalletStatus(sub.walletAddress, 'WHITELISTED');
    showToast('success', `Application approved for ${sub.walletAddress.slice(0, 6)}...`);
  };

  // Reject Submission
  const handleRejectSubmission = (sub: WhitelistSubmission) => {
    handleUpdateWalletStatus(sub.walletAddress, 'REJECTED');
    showToast('info', `Application rejected for ${sub.walletAddress.slice(0, 6)}...`);
  };

  // Delete Submission
  const handleDeleteSubmission = (id: string) => {
    setSubmissions((prev) => prev.filter((s) => s.id !== id));
    showToast('info', 'Submission deleted.');
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['wallet_address', 'status', 'tier', 'allocation', 'date_added'];
    const rows = (Object.entries(wallets) as [string, WhitelistWalletRecord][]).map(([addr, rec]) => [
      addr,
      rec.status,
      `"${rec.tier}"`,
      `"${rec.allocation}"`,
      rec.submittedAt || new Date().toISOString(),
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `bunink_whitelist_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('success', 'Whitelist CSV snapshot exported successfully.');
  };

  // Export JSON
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(wallets, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', `bunink_whitelist_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('success', 'Whitelist JSON snapshot exported successfully.');
  };

  // Reset to default mock data
  const handleResetDatabase = () => {
    if (!confirm('Are you sure you want to reset to initial seed data?')) return;
    setWallets(INITIAL_WHITELISTED_WALLETS);
    localStorage.removeItem('bunink_wallets');
    showToast('info', 'Database reset to default initial wallets.');
  };

  // Render Login Card if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FEF3C7] text-slate-900 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#141822] text-white rounded-2xl border border-sky-500/40 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400 flex items-center justify-center text-sky-400">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-pixel text-xs sm:text-sm text-sky-400">BUNINK ADMIN</h1>
                <p className="text-xs text-slate-400 mt-0.5">Whitelist Database & Manager</p>
              </div>
            </div>
            <button
              onClick={onBackToSite}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-pixel text-slate-300 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block font-pixel text-[9px] text-slate-300 uppercase mb-2">
                Enter Admin Passcode
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-sky-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Passcode: bunink2026"
                  className="w-full pl-10 pr-4 py-3 bg-[#0d1017] border border-sky-500/40 rounded-xl text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
                  autoFocus
                />
              </div>
              {authError && (
                <p className="font-pixel text-[9px] text-rose-400 mt-2">
                  Passcode incorrect. Default: bunink2026
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl font-pixel text-xs uppercase tracking-wider bg-[#38BDF8] hover:bg-[#7dd3fc] text-[#08121e] font-bold shadow-[0_0_20px_rgba(56,189,248,0.3)] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>ACCESS ADMIN DASHBOARD</span>
            </button>
          </form>

          <p className="text-center font-mono text-[10px] text-slate-500 mt-6">
            Default Master Key: <code className="text-sky-400 font-bold">bunink2026</code>
          </p>
        </div>
      </div>
    );
  }

  // Render Full Admin Dashboard
  return (
    <div className="min-h-screen bg-[#0d1017] text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-[#141822]/95 backdrop-blur-md border-b border-sky-500/30 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500/20 border border-sky-400/50 flex items-center justify-center text-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.25)]">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-pixel text-xs sm:text-sm text-sky-400">BUNINK ADMIN PORTAL</span>
                <span
                  className={`px-2 py-0.5 rounded text-[9px] font-mono border ${
                    isSupabaseConfigured()
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                      : 'bg-sky-500/20 text-sky-300 border-sky-400/30'
                  }`}
                >
                  {isSupabaseConfigured() ? 'SUPABASE CLOUD' : 'LOCAL CACHE'}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">Inkonchain Whitelist Management Console</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={onBackToSite}
              className="px-3.5 py-2 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Exit to Website</span>
            </button>
            <button
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all cursor-pointer"
            >
              Lock / Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 space-y-6">
        {/* Metric Cards Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-[#141822] border border-sky-500/30 shadow-lg">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
              <span>TOTAL WALLETS</span>
              <Database className="w-4 h-4 text-sky-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold font-mono text-white mt-2">{stats.total}</p>
            <p className="text-[11px] text-slate-400 mt-1">In local active database</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#141822] border border-emerald-500/30 shadow-lg">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
              <span>WHITELISTED</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400 mt-2">{stats.whitelisted}</p>
            <p className="text-[11px] text-emerald-400/80 mt-1">Ready for mint contract</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#141822] border border-amber-500/30 shadow-lg">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
              <span>PENDING REVIEW</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold font-mono text-amber-400 mt-2">{stats.pending}</p>
            <p className="text-[11px] text-amber-400/80 mt-1">Awaiting audit / proof check</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#141822] border border-purple-500/30 shadow-lg">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
              <span>SUBMISSIONS</span>
              <Users className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold font-mono text-purple-400 mt-2">{submissions.length}</p>
            <p className="text-[11px] text-purple-400/80 mt-1">User applications recorded</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('wallets')}
              className={`px-4 py-2 rounded-xl text-xs font-pixel uppercase transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'wallets'
                  ? 'bg-sky-500 text-[#08121e] font-bold shadow-[0_0_15px_rgba(56,189,248,0.3)]'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-400'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Whitelist Database ({Object.keys(wallets).length})</span>
            </button>

            <button
              onClick={() => setActiveTab('submissions')}
              className={`px-4 py-2 rounded-xl text-xs font-pixel uppercase transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'submissions'
                  ? 'bg-sky-500 text-[#08121e] font-bold shadow-[0_0_15px_rgba(56,189,248,0.3)]'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-400'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>User Applications ({submissions.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('tasks')}
              className={`px-4 py-2 rounded-xl text-xs font-pixel uppercase transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'tasks'
                  ? 'bg-sky-500 text-[#08121e] font-bold shadow-[0_0_15px_rgba(56,189,248,0.3)]'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-400'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Quests ({tasks.length})</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-300 text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer"
              title="Export Snapshot for Merkle Tree"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={handleExportJSON}
              className="px-3 py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/40 text-sky-300 text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <FileJson className="w-3.5 h-3.5" />
              <span>JSON</span>
            </button>
          </div>
        </div>

        {/* TAB 1: WHITELIST DATABASE */}
        {activeTab === 'wallets' && (
          <div className="space-y-4">
            {/* Filter and Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#141822] p-3.5 rounded-2xl border border-sky-500/20">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search address (0x...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-[#0d1017] border border-slate-700 rounded-xl text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-3 py-2 bg-[#0d1017] border border-slate-700 rounded-xl text-xs font-mono text-slate-300 focus:outline-none focus:border-sky-400"
                >
                  <option value="ALL">All Statuses ({stats.total})</option>
                  <option value="WHITELISTED">Whitelisted ({stats.whitelisted})</option>
                  <option value="PENDING">Pending ({stats.pending})</option>
                  <option value="REJECTED">Rejected ({stats.rejected})</option>
                </select>

                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-[#08121e] text-xs font-bold font-mono transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_10px_rgba(56,189,248,0.3)]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Wallet</span>
                </button>

                <button
                  onClick={() => setShowBulkModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold font-mono transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Bulk Import</span>
                </button>
              </div>
            </div>

            {/* Wallets Table */}
            <div className="bg-[#141822] rounded-2xl border border-sky-500/20 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#0d1017] text-slate-400 uppercase border-b border-slate-800 text-[10px]">
                    <tr>
                      <th className="py-3 px-4">#</th>
                      <th className="py-3 px-4">EVM Address</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Tier</th>
                      <th className="py-3 px-4">Allocation</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredWallets.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-500">
                          No wallet records found matching query.
                        </td>
                      </tr>
                    ) : (
                      filteredWallets.map(([address, record], idx) => (
                        <tr key={address} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3.5 px-4 text-slate-500">{idx + 1}</td>
                          <td className="py-3.5 px-4">
                            <span className="text-sky-300 font-semibold selection:bg-sky-500 selection:text-black">
                              {address}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            {record.status === 'WHITELISTED' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                                <Check className="w-3 h-3" /> WHITELISTED
                              </span>
                            )}
                            {record.status === 'PENDING' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">
                                <Clock className="w-3 h-3" /> PENDING
                              </span>
                            )}
                            {record.status === 'REJECTED' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40">
                                <X className="w-3 h-3" /> REJECTED
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-slate-300">{record.tier}</td>
                          <td className="py-3.5 px-4 text-slate-300 font-bold">{record.allocation}</td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {record.status !== 'WHITELISTED' && (
                                <button
                                  onClick={() => handleUpdateWalletStatus(address, 'WHITELISTED')}
                                  title="Set to Whitelisted"
                                  className="p-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 cursor-pointer"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                              )}
                              {record.status !== 'PENDING' && (
                                <button
                                  onClick={() => handleUpdateWalletStatus(address, 'PENDING')}
                                  title="Mark as Pending"
                                  className="p-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 cursor-pointer"
                                >
                                  <Clock className="w-3.5 h-3.5" />
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteWallet(address)}
                                title="Remove wallet"
                                className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 font-mono pt-2">
              <span>Showing {filteredWallets.length} of {stats.total} total addresses</span>
              <button
                onClick={handleResetDatabase}
                className="text-slate-500 hover:text-slate-300 underline cursor-pointer"
              >
                Reset to default seed
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: USER APPLICATIONS / SUBMISSIONS */}
        {activeTab === 'submissions' && (
          <div className="space-y-4">
            <div className="bg-[#141822] p-4 rounded-2xl border border-sky-500/20">
              <p className="text-xs text-slate-400 font-mono">
                User applications submitted via the frontend Whitelist Quests section. Review social proofs before approving.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {submissions.length === 0 ? (
                <div className="col-span-2 py-12 text-center text-slate-500 font-mono bg-[#141822] rounded-2xl border border-slate-800">
                  No applications recorded yet.
                </div>
              ) : (
                submissions.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-5 rounded-2xl bg-[#141822] border border-sky-500/30 space-y-4 shadow-lg"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-mono text-slate-500 uppercase block">Applicant Address</span>
                        <span className="font-mono text-xs text-sky-300 font-bold block mt-0.5 break-all">
                          {sub.walletAddress}
                        </span>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                          sub.status === 'WHITELISTED'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : sub.status === 'PENDING'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                        }`}
                      >
                        {sub.status}
                      </span>
                    </div>

                    {/* Proofs preview */}
                    <div className="bg-[#0d1017] p-3 rounded-xl border border-slate-800/80 space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase">
                        <span>Submitted Quest Proofs</span>
                        <span className="text-slate-500">{sub.proofs?.length || 0} tasks completed</span>
                      </div>
                      {sub.proofs && sub.proofs.length > 0 ? (
                        <div className="space-y-1.5 pt-1">
                          {sub.proofs.map((p, idx) => (
                            <div key={idx} className="text-xs font-mono flex items-start gap-2">
                              <span className="text-sky-400 shrink-0">✓</span>
                              <div className="min-w-0">
                                <span className="text-slate-400 text-[11px] block">{p.title}:</span>
                                <span className="text-slate-200 font-semibold break-all bg-slate-800/60 px-1.5 py-0.5 rounded text-[11px]">
                                  {p.proof || 'Verified via Quest'}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500 font-mono">No proofs attached</p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                      <span className="text-[10px] font-mono text-slate-500">
                        {new Date(sub.submittedAt).toLocaleString()}
                      </span>

                      <div className="flex items-center gap-2">
                        {sub.status !== 'WHITELISTED' && (
                          <button
                            onClick={() => handleApproveSubmission(sub)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-[#08121e] text-xs font-bold font-mono transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                        )}
                        {sub.status !== 'REJECTED' && (
                          <button
                            onClick={() => handleRejectSubmission(sub)}
                            className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 text-xs font-mono transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteSubmission(sub.id)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 cursor-pointer"
                          title="Delete entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 3: QUESTS CONFIG */}
        {activeTab === 'tasks' && (
          <div className="bg-[#141822] p-6 rounded-2xl border border-sky-500/20 space-y-4">
            <h2 className="text-sm font-pixel text-sky-400">ACTIVE WHITELIST QUESTS</h2>
            <p className="text-xs text-slate-400 font-mono">
              These quests are displayed to users on the homepage before they can submit their wallet.
            </p>

            <div className="space-y-3 pt-2">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="p-4 rounded-xl bg-[#0d1017] border border-slate-800 flex items-center justify-between gap-4"
                >
                  <div>
                    <h3 className="text-xs font-pixel text-slate-200">{task.title}</h3>
                    <p className="text-xs text-slate-400 font-mono mt-1">{task.description}</p>
                    <a
                      href={task.action_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-sky-400 font-mono hover:underline inline-flex items-center gap-1 mt-2"
                    >
                      <span>Action URL: {task.action_url}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <span className="px-2.5 py-1 rounded text-[10px] font-bold font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                    ACTIVE
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modal: Add Single Wallet */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#141822] text-white rounded-2xl border border-sky-500/40 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-pixel text-xs text-sky-400">ADD WHITELISTED ADDRESS</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddWallet} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">
                  EVM Wallet Address (0x...)
                </label>
                <input
                  type="text"
                  required
                  placeholder="0x..."
                  value={newWalletAddress}
                  onChange={(e) => setNewWalletAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#0d1017] border border-slate-700 rounded-xl text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">
                  Whitelist Tier
                </label>
                <select
                  value={newWalletTier}
                  onChange={(e) => setNewWalletTier(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#0d1017] border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-sky-400"
                >
                  <option value="Tier 1 Guaranteed (Wave 1)">Tier 1 Guaranteed (Wave 1)</option>
                  <option value="Wave 1 Allocation">Wave 1 Allocation</option>
                  <option value="Wave 2 Priority">Wave 2 Priority</option>
                  <option value="Community Whitelist">Community Whitelist</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">
                  Allocation Quantity
                </label>
                <input
                  type="text"
                  value={newWalletAllocation}
                  onChange={(e) => setNewWalletAllocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#0d1017] border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-sky-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-[#08121e] text-xs font-bold font-mono cursor-pointer"
                >
                  Add to Whitelist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Bulk Import Wallets */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#141822] text-white rounded-2xl border border-sky-500/40 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-pixel text-xs text-sky-400">BULK IMPORT WALLET ADDRESSES</h3>
              <button
                onClick={() => setShowBulkModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleBulkImport} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">
                  Paste Addresses (One per line or comma-separated)
                </label>
                <textarea
                  rows={6}
                  required
                  placeholder="0x1234567890123456789012345678901234567890&#10;0xabcdefabcdefabcdefabcdefabcdefabcdefabcd"
                  value={bulkInput}
                  onChange={(e) => setBulkInput(e.target.value)}
                  className="w-full p-3 bg-[#0d1017] border border-slate-700 rounded-xl text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">
                    Assign Tier
                  </label>
                  <input
                    type="text"
                    value={bulkTier}
                    onChange={(e) => setBulkTier(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0d1017] border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-sky-400"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">
                    Assign Allocation
                  </label>
                  <input
                    type="text"
                    value={bulkAllocation}
                    onChange={(e) => setBulkAllocation(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0d1017] border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-sky-400"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBulkModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold font-mono cursor-pointer"
                >
                  Import All Wallets
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
