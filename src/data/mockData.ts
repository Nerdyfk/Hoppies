import { Task } from '../types.ts';

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
    title: 'Retweet & Comment on Whitelist Announcement',
    description: 'Like, Retweet & leave an authentic comment on the official BunInk mint launch announcement.',
    type: 'retweet',
    action_url: 'https://x.com/Bunnink0',
    required: true,
    verification_method: 'instant',
    active: true,
    sort_order: 2,
    isCompleted: false,
  },
  {
    id: 'task-3-alpha-call',
    title: 'Make A Bullish Post About @Bunnink0',
    description: 'Share a bullish post on X mentioning @Bunnink0 and why you are excited for BunInk on Inkonchain.',
    type: 'post',
    action_url: 'https://x.com/intent/tweet?text=Excited%20for%20the%20official%20%40Bunnink0%20mint%20on%20%40Inkonchain%20L2!%20Small%20Bunnies.%20Big%20Stories.%20%F0%9F%90%B0%E2%9C%A8%20%23BunInk%20%23Inkonchain',
    required: true,
    verification_method: 'instant',
    active: true,
    sort_order: 3,
    isCompleted: false,
  },
];

export interface RoadmapPhase {
  phase: string;
  tag: string;
  title: string;
  status: 'In Progress' | 'Upcoming' | 'Future';
  statusColor: 'emerald' | 'indigo' | 'amber';
  description: string;
  items: string[];
}

export const ROADMAP_PHASES: RoadmapPhase[] = [
  {
    phase: 'Phase 01',
    tag: 'The Debut',
    title: 'Mint Launch',
    status: 'In Progress',
    statusColor: 'emerald',
    description: 'Official genesis collection release on Inkonchain L2 with low transaction fees.',
    items: [
      'Public & Whitelist mint on Inkonchain L2 with near-zero gas fees',
      'Priority whitelist window for approved applicants (2,222 Total Supply)',
      'Instant task proof verification & transparent whitelist allocation',
      'Real-time live mint tracker & verified secondary marketplace listings',
    ],
  },
  {
    phase: 'Phase 02',
    tag: 'The Ecosystem',
    title: 'Web3 Integration',
    status: 'Upcoming',
    statusColor: 'indigo',
    description: 'Expanding utility, cross-chain interoperability, and community-led governance.',
    items: [
      'Cross-chain bridge support for multi-chain collectors and partners',
      'BunInk DAO governance — holders vote on future drops and treasury grants',
      'DeFi staking pools with NFT-boosted APY reward multipliers',
      'Strategic partner protocol integrations with prominent Inkonchain dApps',
    ],
  },
  {
    phase: 'Phase 03',
    tag: 'The Reward',
    title: 'Token Launch & Airdrop',
    status: 'Future',
    statusColor: 'amber',
    description: 'Rewarding early believers and establishing long-term community alignment.',
    items: [
      '$BINK token generation event (TGE) for all verified BunInk NFT holders',
      'Retroactive airdrop weighting calculated from whitelist engagement score',
      'Liquidity pool seeding & decentralized exchange (DEX) listings at launch',
      'Sustainable long-term holder reward vesting schedule and staking vault',
    ],
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
    image: '/nft/105.png',
    traits: [
      { type: 'Species', value: 'Cosmic Bunny' },
      { type: 'Aura', value: 'Cyan Photon' },
      { type: 'Apparel', value: 'Cyber Hoodie' },
      { type: 'Expression', value: 'Smug Focus' },
      { type: 'Network', value: 'Inkonchain' },
      { type: 'Contract', value: 'ERC-721' },
    ],
  },
  {
    id: '2',
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
