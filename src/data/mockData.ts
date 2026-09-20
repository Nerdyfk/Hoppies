import { Task, WhitelistSubmission } from '../types.ts';

export const DEFAULT_TASKS: Task[] = [
  {
    id: 'task-1-twitter',
    title: 'Follow @Bunnink0 on X / Twitter',
    description: 'Follow our official X handle for drop announcements, snapshot alerts, and whitelist access.',
    type: 'follow_twitter',
    action_url: 'https://x.com/Bunnink0',
    required: true,
    verification_method: 'instant',
    active: true,
    sort_order: 1,
    isCompleted: false,
  },
  {
    id: 'task-2-retweet',
    title: 'Like, Repost & Comment on Pinned Post',
    description: 'Like, Repost & leave a comment on the official pinned post on X.',
    type: 'retweet',
    action_url: 'https://x.com/Bunnink0',
    required: true,
    verification_method: 'instant',
    active: true,
    sort_order: 2,
    isCompleted: false,
  },
];


export interface BunInkNFT {
  id: string;
  name: string;
  image: string;
  traits: {
    type: string;
    value: string;
  }[];
}

export const FEATURED_NFTS: BunInkNFT[] = [
  {
    id: '1',
    name: 'BunInk',
    image: '/nft/179.png',
    traits: [
      { type: 'Species', value: 'Genesis Bunny' },
      { type: 'Headwear', value: 'Ink Beanie' },
      { type: 'Apparel', value: 'Streetwear Tee' },
      { type: 'Eyes', value: 'Laser Iris' },
      { type: 'Network', value: 'Inkonchain' },
      { type: 'Contract', value: 'ERC-721' },
    ],
  },
];

export const INITIAL_WHITELISTED_WALLETS: Record<string, { status: 'WHITELISTED' | 'PENDING'; tier: string; allocation: string }> = {
  '0x71c8413204c38ff240097621f37e42d713c72b22': {
    status: 'WHITELISTED',
    tier: 'Tier 1 Guaranteed (Wave 1)',
    allocation: '2 NFTs (Guaranteed Mint)',
  },
  '0x1234567890123456789012345678901234567890': {
    status: 'PENDING',
    tier: 'Review Pending (Wave 2)',
    allocation: '1 NFT (Subject to Verification)',
  },
};

export const DEFAULT_INITIAL_SUBMISSIONS: WhitelistSubmission[] = [
  {
    id: 'sub-1',
    walletAddress: '0x71c8413204c38ff240097621f37e42d713c72b22',
    submittedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    status: 'WHITELISTED',
    tier: 'Tier 1 Guaranteed (Wave 1)',
    allocation: '2 NFTs',
    proofs: [
      { id: 'task-1-twitter', title: 'Follow @Bunnink0 on X / Twitter', proof: '@bunlover_alpha' },
      { id: 'task-2-retweet', title: 'Like, Repost & Comment on Pinned Post', proof: 'https://x.com/bunlover_alpha/status/123' },
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
      { id: 'task-1-twitter', title: 'Follow @Bunnink0 on X / Twitter', proof: '@crypto_hops' },
      { id: 'task-2-retweet', title: 'Like, Repost & Comment on Pinned Post', proof: '@crypto_hops retweeted' },
    ],
  },
];
