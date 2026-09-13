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
  status: 'WHITELISTED' | 'PENDING' | 'NOT_FOUND';
  tier?: string;
}

export interface WhitelistCheckResponse {
  found: boolean;
  status: 'WHITELISTED' | 'PENDING' | 'NOT_FOUND';
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
