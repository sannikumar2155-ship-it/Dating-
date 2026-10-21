import React, { createContext, useContext, useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  ChatMessage,
  Gift,
  GiftEvent,
  PKBattleState,
  Room,
  Seat,
  UserProfile,
} from '../types';
import {
  INITIAL_GIFTS,
  INITIAL_ROOMS,
  INITIAL_USER,
} from '../data/mockData';

interface FloatingEmoji {
  id: string;
  emoji: string;
  leftPercent: number;
}

interface AppContextType {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  rooms: Room[];
  currentRoom: Room | null;
  enterRoom: (roomId: string) => void;
  leaveRoom: () => void;
  followingIds: string[];
  toggleFollow: (hostId: string) => void;
  isFollowing: (hostId: string) => boolean;
  
  // Mic & Seat
  mySeatIndex: number | null;
  takeSeat: (seatIndex: number) => void;
  leaveSeat: () => void;
  isMicMuted: boolean;
  toggleMic: () => void;
  isUserSpeaking: boolean;

  // Dating Cupid Match
  sendCupidHeart: (fromSeat: number, toSeat: number) => void;
  
  // Volunteer Controls
  volunteerMuteSeat: (seatIndex: number) => void;
  volunteerKickSeat: (seatIndex: number) => void;

  // Gifting & Emojis
  gifts: Gift[];
  selectedGiftRecipient: number | 'host';
  setSelectedGiftRecipient: (target: number | 'host') => void;
  sendGift: (gift: Gift, recipient: number | 'host', combo?: number) => boolean;
  recentGiftEvent: GiftEvent | null;
  floatingEmojis: FloatingEmoji[];
  triggerFloatingEmoji: (emoji: string) => void;

  // Chat
  messages: ChatMessage[];
  sendMessage: (text: string) => void;

  // PK Battle
  pkBattle: PKBattleState | null;
  supportPKTeam: (team: 'red' | 'blue', coinAmount: number) => void;
  startPKBattle: (challengerName?: string) => void;
  endPKBattle: () => void;

  // Recharge & Wallet
  rechargeCoins: (coins: number, bonus: number, priceStr: string) => void;
  claimDailyReward: () => void;
  dailyRewardClaimed: boolean;

  // Modals
  activeModal: string | null;
  openModal: (modalName: string) => void;
  closeModal: () => void;

  // Family
  myFamilyId: string | null;
  joinFamily: (familyId: string, familyName: string, badge: string) => void;

  // Create Room
  createCustomRoom: (title: string, category: Room['category'], tagline: string) => void;

  // Authentication
  loginWithPhone: (phoneNumber: string, name?: string) => void;
  loginWithGoogle: (email?: string, name?: string) => void;
  loginWithFacebook: (name?: string) => void;
  logout: () => void;
}


const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS);
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);
  const [followingIds, setFollowingIds] = useState<string[]>(['host_elena']);
  
  // Seat state for current user
  const [mySeatIndex, setMySeatIndex] = useState<number | null>(null);
  const [isMicMuted, setIsMicMuted] = useState<boolean>(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState<boolean>(false);

  // Gifting
  const [gifts] = useState<Gift[]>(INITIAL_GIFTS);
  const [selectedGiftRecipient, setSelectedGiftRecipient] = useState<number | 'host'>('host');
  const [recentGiftEvent, setRecentGiftEvent] = useState<GiftEvent | null>(null);
  const [floatingEmojis, setFloatingEmojis] = useState<FloatingEmoji[]>([]);

  // Chat stream
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Modals
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [dailyRewardClaimed, setDailyRewardClaimed] = useState<boolean>(false);
  const [myFamilyId, setMyFamilyId] = useState<string | null>(INITIAL_USER.familyId || 'fam_royal');

  const currentRoom = rooms.find((r) => r.id === currentRoomId) || null;
  const pkBattle = currentRoom?.pkBattle || null;

  // Simulate speaking pulses
  useEffect(() => {
    if (mySeatIndex !== null && !isMicMuted) {
      const interval = setInterval(() => {
        setIsUserSpeaking((prev) => !prev);
      }, 1400);
      return () => clearInterval(interval);
    } else {
      setIsUserSpeaking(false);
    }
  }, [mySeatIndex, isMicMuted]);

  // Enter room setup
  const enterRoom = (roomId: string) => {
    setCurrentRoomId(roomId);
    setMySeatIndex(null);
    const room = rooms.find((r) => r.id === roomId);
    if (room) {
      setMessages([
        {
          id: 'sys_welcome',
          type: 'system',
          senderName: 'Room System',
          text: `Welcome to ${room.title}! 💖 Treat everyone with kindness and follow room rules.`,
          timestamp: 'Just now',
        },
        {
          id: 'sys_guard',
          type: 'volunteer',
          senderName: 'Room Guardians',
          isVolunteer: true,
          text: `🛡️ Room protected by Guardians. Report violations to volunteers on duty.`,
          timestamp: 'Just now',
        },
        {
          id: 'user_m1',
          type: 'user',
          senderName: 'Sophia Ray',
          senderVip: 2,
          text: 'Hey everyone! Welcome new listeners, let us know where you are tuning in from! 🎵',
          timestamp: '1m ago',
        },
      ]);
    }
  };

  const leaveRoom = () => {
    setCurrentRoomId(null);
    setMySeatIndex(null);
  };

  // Follow toggle
  const toggleFollow = (hostId: string) => {
    setFollowingIds((prev) => {
      const isAlready = prev.includes(hostId);
      if (isAlready) {
        return prev.filter((id) => id !== hostId);
      } else {
        return [...prev, hostId];
      }
    });
  };

  const isFollowing = (hostId: string) => followingIds.includes(hostId);

  // Seat control
  const takeSeat = (seatIndex: number) => {
    if (!currentRoom) return;
    setRooms((prev) =>
      prev.map((r) => {
        if (r.id !== currentRoom.id) return r;
        const newSeats = r.seats.map((s) => {
          if (s.seatIndex === seatIndex) {
            return {
              ...s,
              userId: user.id,
              userName: user.name,
              userAvatar: user.avatar,
              gender: user.gender as 'female' | 'male',
              isSpeaking: false,
              isMuted: isMicMuted,
            };
          }
          if (mySeatIndex !== null && s.seatIndex === mySeatIndex) {
            // vacate old seat
            return {
              seatIndex: s.seatIndex,
              isSpeaking: false,
              isMuted: false,
              isLocked: false,
              receivedGiftsValue: 0,
            };
          }
          return s;
        });
        return { ...r, seats: newSeats };
      })
    );
    setMySeatIndex(seatIndex);
    sendMessage(`🎤 I have taken Seat #${seatIndex}! Glad to be on mic!`);
  };

  const leaveSeat = () => {
    if (!currentRoom || mySeatIndex === null) return;
    setRooms((prev) =>
      prev.map((r) => {
        if (r.id !== currentRoom.id) return r;
        const newSeats = r.seats.map((s) => {
          if (s.seatIndex === mySeatIndex) {
            return {
              seatIndex: s.seatIndex,
              isSpeaking: false,
              isMuted: false,
              isLocked: false,
              receivedGiftsValue: 0,
            };
          }
          return s;
        });
        return { ...r, seats: newSeats };
      })
    );
    setMySeatIndex(null);
  };

  const toggleMic = () => {
    setIsMicMuted((prev) => {
      const next = !prev;
      if (currentRoom && mySeatIndex !== null) {
        setRooms((roomsList) =>
          roomsList.map((r) => {
            if (r.id !== currentRoom.id) return r;
            return {
              ...r,
              seats: r.seats.map((s) =>
                s.seatIndex === mySeatIndex ? { ...s, isMuted: next } : s
              ),
            };
          })
        );
      }
      return next;
    });
  };

  // Cupid Heart Match between seats
  const sendCupidHeart = (fromSeat: number, toSeat: number) => {
    if (!currentRoom) return;
    setRooms((prev) =>
      prev.map((r) => {
        if (r.id !== currentRoom.id) return r;
        const targetSeat = r.seats.find((s) => s.seatIndex === toSeat);
        const fromSeatObj = r.seats.find((s) => s.seatIndex === fromSeat);

        // Check if reciprocal
        const isMutual = targetSeat?.heartMatchTarget === fromSeat;

        const updatedSeats = r.seats.map((s) => {
          if (s.seatIndex === fromSeat) {
            return {
              ...s,
              heartMatchTarget: toSeat,
              matchedWith: isMutual ? toSeat : undefined,
            };
          }
          if (s.seatIndex === toSeat && isMutual) {
            return {
              ...s,
              matchedWith: fromSeat,
            };
          }
          return s;
        });

        return { ...r, seats: updatedSeats };
      })
    );

    const fromSeatObj = currentRoom.seats.find((s) => s.seatIndex === fromSeat);
    const toSeatObj = currentRoom.seats.find((s) => s.seatIndex === toSeat);
    const fromName = fromSeatObj?.userName || `Seat #${fromSeat}`;
    const toName = toSeatObj?.userName || `Seat #${toSeat}`;

    if (toSeatObj?.heartMatchTarget === fromSeat) {
      // Confetti burst for mutual match!
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f43f5e', '#ec4899', '#fb7185', '#ffd700'],
      });
      setMessages((prev) => [
        ...prev,
        {
          id: `match_${Date.now()}`,
          type: 'match',
          senderName: 'Cupid Heart Radar',
          text: `💘 MUTUAL MATCH! ${fromName} and ${toName} chose each other with 98% Compatibility! 🎉`,
          timestamp: 'Just now',
        },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          id: `heart_${Date.now()}`,
          type: 'match',
          senderName: 'Cupid Radar',
          text: `❤️ ${fromName} sent a Cupid Heart to ${toName}! Will they match back?`,
          timestamp: 'Just now',
        },
      ]);
    }
  };

  // Volunteer moderation
  const volunteerMuteSeat = (seatIndex: number) => {
    if (!currentRoom) return;
    setRooms((prev) =>
      prev.map((r) => {
        if (r.id !== currentRoom.id) return r;
        return {
          ...r,
          seats: r.seats.map((s) =>
            s.seatIndex === seatIndex ? { ...s, isMuted: !s.isMuted } : s
          ),
        };
      })
    );
    const seatObj = currentRoom.seats.find((s) => s.seatIndex === seatIndex);
    const seatName = seatObj?.userName || `Seat #${seatIndex}`;
    setMessages((prev) => [
      ...prev,
      {
        id: `vol_${Date.now()}`,
        type: 'volunteer',
        senderName: `${user.name} (Guardian)`,
        isVolunteer: true,
        text: `🛡️ Volunteer action: Mic status updated for ${seatName}.`,
        timestamp: 'Just now',
      },
    ]);
  };

  const volunteerKickSeat = (seatIndex: number) => {
    if (!currentRoom) return;
    setRooms((prev) =>
      prev.map((r) => {
        if (r.id !== currentRoom.id) return r;
        return {
          ...r,
          seats: r.seats.map((s) =>
            s.seatIndex === seatIndex
              ? { seatIndex, isSpeaking: false, isMuted: false, isLocked: false, receivedGiftsValue: 0 }
              : s
          ),
        };
      })
    );
    setMessages((prev) => [
      ...prev,
      {
        id: `vol_kick_${Date.now()}`,
        type: 'volunteer',
        senderName: `${user.name} (Guardian)`,
        isVolunteer: true,
        text: `🛡️ Volunteer action: Seat #${seatIndex} was released.`,
        timestamp: 'Just now',
      },
    ]);
  };

  // Send Gift
  const sendGift = (gift: Gift, recipient: number | 'host', combo: number = 1): boolean => {
    const totalCost = gift.coins * combo;
    if (user.coins < totalCost) {
      setActiveModal('recharge');
      return false;
    }

    // Deduct coins
    setUser((prev) => ({
      ...prev,
      coins: prev.coins - totalCost,
      level: prev.level + Math.floor(totalCost / 500),
    }));

    // Find recipient name
    let receiverName = currentRoom?.hostName || 'Host';
    if (recipient !== 'host' && currentRoom) {
      const s = currentRoom.seats.find((st) => st.seatIndex === recipient);
      if (s?.userName) {
        receiverName = s.userName;
      } else {
        receiverName = `Seat #${recipient}`;
      }
    }

    // Show event animation
    const giftEvent: GiftEvent = {
      id: `gift_evt_${Date.now()}`,
      senderName: user.name,
      senderAvatar: user.avatar,
      receiverName,
      gift,
      comboCount: combo,
      timestamp: Date.now(),
    };
    setRecentGiftEvent(giftEvent);
    setTimeout(() => {
      setRecentGiftEvent((curr) => (curr?.id === giftEvent.id ? null : curr));
    }, 3800);

    // Luxury gift celebration
    if (gift.coins >= 500) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#e11d48', '#fb7185', '#f59e0b', '#38bdf8'],
      });
    }

    // Add chat alert
    setMessages((prev) => [
      ...prev,
      {
        id: `msg_gift_${Date.now()}`,
        type: 'gift',
        senderName: user.name,
        senderVip: user.vipLevel,
        senderFamilyBadge: user.familyBadge,
        text: `sent ${gift.name} ${gift.icon} x${combo} to ${receiverName}!`,
        gift: {
          name: gift.name,
          icon: gift.icon,
          coins: totalCost,
          combo,
          receiverName,
        },
        timestamp: 'Just now',
      },
    ]);

    // If current room has PK battle, feed points
    if (currentRoom?.pkBattle?.isActive) {
      // Default give to red unless specified
      supportPKTeam('red', totalCost);
    }

    // Update seat received gifts value
    if (recipient !== 'host' && currentRoom) {
      setRooms((prev) =>
        prev.map((r) => {
          if (r.id !== currentRoom.id) return r;
          return {
            ...r,
            seats: r.seats.map((s) =>
              s.seatIndex === recipient
                ? { ...s, receivedGiftsValue: s.receivedGiftsValue + totalCost }
                : s
            ),
          };
        })
      );
    }

    return true;
  };

  // Floating Emojis
  const triggerFloatingEmoji = (emoji: string) => {
    const newEmoji: FloatingEmoji = {
      id: `fe_${Date.now()}_${Math.random()}`,
      emoji,
      leftPercent: 60 + Math.random() * 32, // bottom right area
    };
    setFloatingEmojis((prev) => [...prev, newEmoji]);
    setTimeout(() => {
      setFloatingEmojis((prev) => prev.filter((e) => e.id !== newEmoji.id));
    }, 2400);
  };

  // Chat message
  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const newMsg: ChatMessage = {
      id: `m_${Date.now()}`,
      type: 'user',
      senderName: user.name,
      senderAvatar: user.avatar,
      senderVip: user.vipLevel,
      senderFamilyBadge: user.familyBadge,
      isVolunteer: user.isVolunteer,
      text: text.trim(),
      timestamp: 'Just now',
    };
    setMessages((prev) => [...prev, newMsg]);
  };

  // PK Battle Support
  const supportPKTeam = (team: 'red' | 'blue', coinAmount: number) => {
    if (!currentRoom) return;
    setRooms((prev) =>
      prev.map((r) => {
        if (r.id !== currentRoom.id || !r.pkBattle) return r;
        const currentPK = r.pkBattle;
        const updatedPK: PKBattleState = {
          ...currentPK,
          redTeam: {
            ...currentPK.redTeam,
            score: team === 'red' ? currentPK.redTeam.score + coinAmount : currentPK.redTeam.score,
            topContributor: team === 'red' ? user.name : currentPK.redTeam.topContributor,
          },
          blueTeam: {
            ...currentPK.blueTeam,
            score: team === 'blue' ? currentPK.blueTeam.score + coinAmount : currentPK.blueTeam.score,
            topContributor: team === 'blue' ? user.name : currentPK.blueTeam.topContributor,
          },
        };
        return { ...r, pkBattle: updatedPK };
      })
    );
  };

  const startPKBattle = (challengerName: string = 'DJ Alex Prime') => {
    if (!currentRoom) return;
    const newPK: PKBattleState = {
      isActive: true,
      redTeam: {
        hostId: currentRoom.hostId,
        hostName: currentRoom.hostName,
        avatar: currentRoom.hostAvatar,
        score: 1000,
        topContributor: user.name,
      },
      blueTeam: {
        hostId: 'challenger_guest',
        hostName: challengerName,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        score: 950,
      },
      timeRemainingSeconds: 180,
      punishment: 'Sing Romantic Chorus on Stage 🎤',
    };

    setRooms((prev) =>
      prev.map((r) => (r.id === currentRoom.id ? { ...r, isPKActive: true, pkBattle: newPK } : r))
    );

    setMessages((prev) => [
      ...prev,
      {
        id: `pk_start_${Date.now()}`,
        type: 'system',
        senderName: 'PK Battle Arena',
        text: `⚔️ 1v1 PK BATTLE STARTED! ${newPK.redTeam.hostName} vs ${newPK.blueTeam.hostName}! Send gifts to push the score bar!`,
        timestamp: 'Just now',
      },
    ]);
  };

  const endPKBattle = () => {
    if (!currentRoom || !currentRoom.pkBattle) return;
    const red = currentRoom.pkBattle.redTeam.score;
    const blue = currentRoom.pkBattle.blueTeam.score;
    const winner = red > blue ? 'red' : red < blue ? 'blue' : 'draw';

    setRooms((prev) =>
      prev.map((r) =>
        r.id === currentRoom.id && r.pkBattle
          ? {
              ...r,
              isPKActive: false,
              pkBattle: { ...r.pkBattle, isActive: false, winner },
            }
          : r
      )
    );
  };

  // Recharge coins
  const rechargeCoins = (coins: number, bonus: number, priceStr: string) => {
    const totalGained = coins + bonus;
    setUser((prev) => ({
      ...prev,
      coins: prev.coins + totalGained,
      vipLevel: totalGained >= 20000 ? Math.max(prev.vipLevel, 4) : prev.vipLevel,
    }));
    setMessages((prev) => [
      ...prev,
      {
        id: `sys_recharge_${Date.now()}`,
        type: 'system',
        senderName: 'Wallet Service',
        text: `💳 Recharge successful! Added +${totalGained.toLocaleString()} Coins (${priceStr}). Happy partying!`,
        timestamp: 'Just now',
      },
    ]);
  };

  const claimDailyReward = () => {
    if (dailyRewardClaimed) return;
    setUser((prev) => ({
      ...prev,
      coins: prev.coins + 300,
    }));
    setDailyRewardClaimed(true);
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.5 },
    });
  };

  // Join Family
  const joinFamily = (familyId: string, familyName: string, badge: string) => {
    setMyFamilyId(familyId);
    setUser((prev) => ({
      ...prev,
      familyId,
      familyName,
      familyBadge: badge,
    }));
  };

  // Create Custom Room
  const createCustomRoom = (title: string, category: Room['category'], tagline: string) => {
    const newRoom: Room = {
      id: `room_${Date.now()}`,
      title,
      tagline,
      category,
      hostId: user.id,
      hostName: user.name,
      hostAvatar: user.avatar,
      onlineCount: 1,
      isPKActive: category === 'pk',
      isDatingMode: category === 'dating',
      familyId: user.familyId,
      familyName: user.familyName,
      tags: [category.toUpperCase(), 'Live Party', 'Voice Room'],
      volunteers: ['Prince Leo (Guardian)'],
      seats: Array.from({ length: 8 }, (_, i) => ({
        seatIndex: i + 1,
        isSpeaking: false,
        isMuted: false,
        isLocked: false,
        receivedGiftsValue: 0,
      })),
    };
    setRooms((prev) => [newRoom, ...prev]);
    enterRoom(newRoom.id);
    closeModal();
  };

  // Authentication implementations
  const loginWithPhone = (phoneNumber: string, name?: string) => {
    setUser((prev) => ({
      ...prev,
      phone: phoneNumber,
      name: name || prev.name || 'Mobile User',
      loginProvider: 'phone',
      isLoggedIn: true,
    }));
    closeModal();
    confetti({ particleCount: 35, spread: 60 });
    sendMessage(`📱 Logged in via Phone Number: ${phoneNumber}`);
  };

  const loginWithGoogle = (email?: string, name?: string) => {
    const userEmail = email || 'sannikumar2155@gmail.com';
    const userName = name || 'Sanni Kumar (Google)';
    setUser((prev) => ({
      ...prev,
      email: userEmail,
      name: userName,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
      loginProvider: 'google',
      isLoggedIn: true,
    }));
    closeModal();
    confetti({ particleCount: 40, spread: 60 });
    sendMessage(`✨ Signed in with Google Gmail: ${userEmail}`);
  };

  const loginWithFacebook = (name?: string) => {
    const userName = name || 'Alex Rivera (Facebook)';
    setUser((prev) => ({
      ...prev,
      name: userName,
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=300&q=80',
      loginProvider: 'facebook',
      isLoggedIn: true,
    }));
    closeModal();
    confetti({ particleCount: 40, spread: 60 });
    sendMessage(`🌐 Signed in with Facebook account: ${userName}`);
  };

  const logout = () => {
    setUser((prev) => ({
      ...prev,
      isLoggedIn: false,
      loginProvider: 'guest',
      phone: undefined,
      email: undefined,
    }));
    closeModal();
  };

  const openModal = (modalName: string) => setActiveModal(modalName);
  const closeModal = () => setActiveModal(null);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        rooms,
        currentRoom,
        enterRoom,
        leaveRoom,
        followingIds,
        toggleFollow,
        isFollowing,
        mySeatIndex,
        takeSeat,
        leaveSeat,
        isMicMuted,
        toggleMic,
        isUserSpeaking,
        sendCupidHeart,
        volunteerMuteSeat,
        volunteerKickSeat,
        gifts,
        selectedGiftRecipient,
        setSelectedGiftRecipient,
        sendGift,
        recentGiftEvent,
        floatingEmojis,
        triggerFloatingEmoji,
        messages,
        sendMessage,
        pkBattle,
        supportPKTeam,
        startPKBattle,
        endPKBattle,
        rechargeCoins,
        claimDailyReward,
        dailyRewardClaimed,
        activeModal,
        openModal,
        closeModal,
        myFamilyId,
        joinFamily,
        createCustomRoom,
        loginWithPhone,
        loginWithGoogle,
        loginWithFacebook,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );

};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
