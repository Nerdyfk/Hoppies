export interface Task {
  id: string;
  title: string;
  description: string;
  type: string;
  action_url: string;
  required: boolean;
  verification_method: string;
  active: boolean;
  sort_order: number;
  isCompleted?: boolean;
  userProof?: string;
}

export interface WhitelistApplication {
  walletAddress: string;
  xHandle?: string;
  submittedAt: string;
  status: 'WHITELISTED' | 'PENDING' | 'REJECTED' | 'NOT_FOUND';
  tier?: string;
}

export interface WhitelistSubmission {
  id: string;
  walletAddress: string;
  submittedAt: string;
  status: 'WHITELISTED' | 'PENDING' | 'REJECTED';
  tier: string;
  allocation: string;
  proofs?: { id: string; title: string; proof?: string }[];
}

export interface WhitelistWalletRecord {
  status: 'WHITELISTED' | 'PENDING' | 'REJECTED';
  tier: string;
  allocation: string;
  submittedAt?: string;
}

export interface WhitelistCheckResponse {
  found: boolean;
  status: 'WHITELISTED' | 'PENDING' | 'REJECTED' | 'NOT_FOUND';
  wallet?: string;
  tier?: string;
  allocation?: string;
  submittedAt?: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}
