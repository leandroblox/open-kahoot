'use client';

import HostGameLobbyScreen from '@/components/host-setup/HostGameLobbyScreen';
import { mockGame } from '@/lib/debug-data';
import { appConfig } from '@/lib/config';

export default function DebugHostLobbyPage() {
  const origin = typeof window !== 'undefined' ? window.location.origin : appConfig.url;
  const normalizedOrigin = origin ? (origin.endsWith('/') ? origin.slice(0, -1) : origin) : '';
  const joinUrl = normalizedOrigin ? `${normalizedOrigin}/join?pin=${mockGame.pin}` : `/join?pin=${mockGame.pin}`;

  return (
    <HostGameLobbyScreen
      game={mockGame}
      joinUrl={joinUrl}
      onStartGame={() => {}}
      onToggleDyslexiaSupport={() => {}}
    />
  );
} 