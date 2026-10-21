export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  gender: 'female' | 'male' | 'other';
  age: number;
  bio: string;
  level: number;
  vipLevel: number;
  coins: number;
  followersCount: number;
  followingCount: number;
  familyId?: string;
  familyName?: string;
  familyBadge?: string;
  isVolunteer: boolean;
  volunteerRank?: string;
  email?: string;
  phone?: string;
  loginProvider?: 'phone' | 'google' | 'facebook' | 'guest';
  isLoggedIn: boolean;
}


export interface Seat {
  seatIndex: number;
  userId?: string;
  userName?: string;
  userAvatar?: string;
  gender?: 'female' | 'male';
  isSpeaking: boolean;
  isMuted: boolean;
  isLocked: boolean;
  heartMatchTarget?: number; // seat index they sent heart to
  matchedWith?: number;
  receivedGiftsValue: number;
}

export interface Gift {
  id: string;
  name: string;
  icon: string;
  coins: number;
  category: 'popular' | 'romance' | 'luxury' | 'special';
  animation: 'float' | 'rocket' | 'sports_car' | 'castle' | 'hearts' | 'ring';
  description: string;
}

export interface GiftEvent {
  id: string;
  senderName: string;
  senderAvatar: string;
  receiverName: string;
  gift: Gift;
  comboCount: number;
  timestamp: number;
}

export interface PKBattleState {
  isActive: boolean;
  redTeam: {
    hostId: string;
    hostName: string;
    avatar: string;
    score: number;
    topContributor?: string;
  };
  blueTeam: {
    hostId: string;
    hostName: string;
    avatar: string;
    score: number;
    topContributor?: string;
  };
  timeRemainingSeconds: number;
  punishment: string;
  winner?: 'red' | 'blue' | 'draw';
}

export interface Room {
  id: string;
  title: string;
  tagline: string;
  category: 'dating' | 'pk' | 'family' | 'games' | 'music';
  hostId: string;
  hostName: string;
  hostAvatar: string;
  bannerImage?: string;
  bgImage?: string;
  onlineCount: number;
  isPKActive: boolean;
  pkBattle?: PKBattleState;
  isDatingMode: boolean;
  familyId?: string;
  familyName?: string;
  tags: string[];
  seats: Seat[];
  volunteers: string[];
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'system' | 'gift' | 'match' | 'volunteer';
  senderName: string;
  senderAvatar?: string;
  senderVip?: number;
  senderFamilyBadge?: string;
  isVolunteer?: boolean;
  text: string;
  gift?: {
    name: string;
    icon: string;
    coins: number;
    combo: number;
    receiverName: string;
  };
  timestamp: string;
}

export interface FamilyClan {
  id: string;
  name: string;
  badge: string;
  level: number;
  leaderName: string;
  memberCount: number;
  maxMembers: number;
  dailyExp: number;
  maxDailyExp: number;
  rank: number;
  description: string;
  banner: string;
  perks: string[];
}

export interface AppEvent {
  id: string;
  title: string;
  subtitle: string;
  category: 'cupid' | 'pk' | 'clan' | 'daily';
  prizePool: string;
  endTime: string;
  banner: string;
  rules: string[];
  quests: {
    id: string;
    task: string;
    reward: number;
    completed: boolean;
    claimed: boolean;
  }[];
}

export interface VolunteerMember {
  id: string;
  name: string;
  avatar: string;
  rank: 'Senior Guardian' | 'Chief Arbiter' | 'Community Patrol' | 'Love Ambassador';
  hoursActive: number;
  roomsProtected: number;
  status: 'active' | 'on_duty' | 'offline';
  assignedRoomId?: string;
}
