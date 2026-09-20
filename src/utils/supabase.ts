import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { WhitelistSubmission, WhitelistWalletRecord } from '../types.ts';

// Extract environment variables provided by Vercel or Vite
export const SUPABASE_URL: string =
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_URL) ||
  (typeof process !== 'undefined' && process.env?.SUPABASE_URL) ||
  (import.meta as any).env?.NEXT_PUBLIC_SUPABASE_URL ||
  (import.meta as any).env?.VITE_SUPABASE_URL ||
  (import.meta as any).env?.SUPABASE_URL ||
  '';

export const SUPABASE_ANON_KEY: string =
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
  (typeof process !== 'undefined' && process.env?.SUPABASE_ANON_KEY) ||
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) ||
  (typeof process !== 'undefined' && process.env?.SUPABASE_PUBLISHABLE_KEY) ||
  (import.meta as any).env?.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  (import.meta as any).env?.VITE_SUPABASE_ANON_KEY ||
  (import.meta as any).env?.SUPABASE_ANON_KEY ||
  '';

export const ADMIN_PASSWORD: string =
  (typeof process !== 'undefined' && process.env?.ADMIN_PASSWORD) ||
  (import.meta as any).env?.ADMIN_PASSWORD ||
  'bunink2026';

export const ADMIN_USERNAME: string =
  (typeof process !== 'undefined' && process.env?.ADMIN_USERNAME) ||
  (import.meta as any).env?.ADMIN_USERNAME ||
  'admin';

export const ADMIN_WALLET_ADDRESS: string =
  (typeof process !== 'undefined' && process.env?.ADMIN_WALLET_ADDRESS) ||
  (import.meta as any).env?.ADMIN_WALLET_ADDRESS ||
  '';

// Initialize Supabase Client if credentials are present
export const supabase: SupabaseClient | null =
  SUPABASE_URL && SUPABASE_ANON_KEY ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

export const isSupabaseConfigured = (): boolean => {
  return !!supabase;
};

// Database helper: Save submission
export const saveSubmissionToSupabase = async (submission: WhitelistSubmission): Promise<boolean> => {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('whitelist_submissions').upsert(
      {
        id: submission.id,
        wallet_address: submission.walletAddress.toLowerCase(),
        status: submission.status,
        tier: submission.tier,
        allocation: submission.allocation,
        proofs: submission.proofs || [],
        submitted_at: submission.submittedAt,
      },
      { onConflict: 'wallet_address' }
    );
    if (error) {
      console.warn('Supabase submission save notice:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase error:', err);
    return false;
  }
};

// Database helper: Save / update wallet
export const saveWalletToSupabase = async (
  address: string,
  record: WhitelistWalletRecord
): Promise<boolean> => {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('whitelist_wallets').upsert(
      {
        wallet_address: address.toLowerCase(),
        status: record.status,
        tier: record.tier,
        allocation: record.allocation,
        submitted_at: record.submittedAt || new Date().toISOString(),
      },
      { onConflict: 'wallet_address' }
    );
    if (error) {
      console.warn('Supabase wallet save notice:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase error:', err);
    return false;
  }
};

// Database helper: Check wallet status
export const checkWalletInSupabase = async (
  address: string
): Promise<WhitelistWalletRecord | null> => {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('whitelist_wallets')
      .select('*')
      .eq('wallet_address', address.toLowerCase())
      .maybeSingle();

    if (error || !data) {
      // Also check submissions table
      const subRes = await supabase
        .from('whitelist_submissions')
        .select('*')
        .eq('wallet_address', address.toLowerCase())
        .maybeSingle();

      if (subRes.data) {
        return {
          status: subRes.data.status || 'PENDING',
          tier: subRes.data.tier || 'Wave 1 Priority (Pending Review)',
          allocation: subRes.data.allocation || 'Up to 2 NFTs (Subject to Review)',
          submittedAt: subRes.data.submitted_at,
        };
      }
      return null;
    }

    return {
      status: data.status,
      tier: data.tier,
      allocation: data.allocation,
      submittedAt: data.submitted_at,
    };
  } catch (err) {
    console.warn('Supabase check error:', err);
    return null;
  }
};

// Database helper: Fetch all wallets for Admin
export const fetchWalletsFromSupabase = async (): Promise<Record<string, WhitelistWalletRecord> | null> => {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('whitelist_wallets').select('*');
    if (error || !data || data.length === 0) return null;

    const result: Record<string, WhitelistWalletRecord> = {};
    data.forEach((row) => {
      if (row.wallet_address) {
        result[row.wallet_address.toLowerCase()] = {
          status: row.status || 'WHITELISTED',
          tier: row.tier || 'Wave 1 Allocation',
          allocation: row.allocation || '1 NFT',
          submittedAt: row.submitted_at,
        };
      }
    });
    return result;
  } catch {
    return null;
  }
};

// Database helper: Fetch all submissions for Admin
export const fetchSubmissionsFromSupabase = async (): Promise<WhitelistSubmission[] | null> => {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('whitelist_submissions')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (error || !data || data.length === 0) return null;

    return data.map((row) => ({
      id: row.id || `sub-${Date.now()}`,
      walletAddress: row.wallet_address,
      status: row.status,
      tier: row.tier,
      allocation: row.allocation,
      submittedAt: row.submitted_at,
      proofs: row.proofs,
    }));
  } catch {
    return null;
  }
};
