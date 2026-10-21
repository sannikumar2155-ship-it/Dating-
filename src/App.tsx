import React from 'react';
import { CreateRoomModal } from './components/CreateRoomModal';
import { DownloadAppModal } from './components/DownloadAppModal';
import { EventsModal } from './components/EventsModal';
import { FamilyModal } from './components/FamilyModal';
import { GamesModal } from './components/GamesModal';
import { GiftTrayModal } from './components/GiftTrayModal';
import { LivePartyRoom } from './components/LivePartyRoom';
import { LoginModal } from './components/LoginModal';
import { Navbar } from './components/Navbar';
import { PKBattleModal } from './components/PKBattleModal';
import { RechargeModal } from './components/RechargeModal';
import { RoomLobby } from './components/RoomLobby';
import { UserProfileModal } from './components/UserProfileModal';
import { VolunteersModal } from './components/VolunteersModal';
import { AppProvider, useApp } from './context/AppContext';

const MainContent: React.FC = () => {
  const { currentRoom } = useApp();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 flex flex-col">
        {currentRoom ? <LivePartyRoom /> : <RoomLobby />}
      </main>

      {/* Global Modals */}
      <GiftTrayModal />
      <PKBattleModal />
      <FamilyModal />
      <RechargeModal />
      <EventsModal />
      <VolunteersModal />
      <GamesModal />
      <CreateRoomModal />
      <UserProfileModal />
      <DownloadAppModal />
      <LoginModal />
    </div>
  );
};


export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
