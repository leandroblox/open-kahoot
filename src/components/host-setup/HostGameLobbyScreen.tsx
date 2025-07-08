import { useEffect, useRef } from 'react';
import { Users, Play } from 'lucide-react';
import type { Game, Player } from '@/types/game';
import PageLayout from '@/components/PageLayout';
import Card from '@/components/Card';
import GamePinDisplay from '@/components/GamePinDisplay';
import PlayerList from '@/components/PlayerList';
import Button from '@/components/Button';
import { useCountdownMusic } from '@/lib/useCountdownMusic';
import { getSocket } from '@/lib/socket-client';

interface HostGameLobbyScreenProps {
  game: Game;
  joinUrl: string;
  onStartGame: () => void;
  onToggleDyslexiaSupport: (playerId: string) => void;
}

export default function HostGameLobbyScreen({ 
  game, 
  joinUrl, 
  onStartGame,
  onToggleDyslexiaSupport
}: HostGameLobbyScreenProps) {
  const { startLobbyMusic, stopLobbyMusic, playBlup } = useCountdownMusic();
  const playersOnly = game.players.filter(p => !p.isHost);
  const musicStartedRef = useRef(false);

  // Start lobby music only once when component mounts
  useEffect(() => {
    if (!musicStartedRef.current) {
      startLobbyMusic();
      musicStartedRef.current = true;
    }

    // Cleanup: stop lobby music when component unmounts
    return () => {
      stopLobbyMusic();
      musicStartedRef.current = false;
    };
  }, [startLobbyMusic, stopLobbyMusic]); // Add missing dependencies

  // Handle socket events for player interactions
  useEffect(() => {
    const socket = getSocket();
    
    const handlePlayerJoined = (player: Player) => {
      console.log('Player joined:', player.name);
      playBlup();
    };
    
    socket.on('playerJoined', handlePlayerJoined);

    return () => {
      socket.off('playerJoined', handlePlayerJoined);
    };
  }, [playBlup]); // Add missing dependency

  const handleStartGame = () => {
    // Stop lobby music before starting game
    stopLobbyMusic();
    onStartGame();
  };

  return (
    <PageLayout gradient="host" maxWidth="6xl">
      <Card>
        <div className="text-center mb-8">
          <h2 className="text-3xl text-white mb-4 font-jua">{game.title}</h2>
          
          <GamePinDisplay 
            pin={game.pin}
            joinUrl={joinUrl}
          />
        </div>

        {/* Separator line */}
        <div className="border-t border-white/20 mb-8"></div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl text-white flex items-center gap-2 font-jua">
              <Users className="w-6 h-6" />
              Players ({playersOnly.length})
            </h2>
            <Button
              onClick={handleStartGame}
              disabled={playersOnly.length === 0}
              variant="black"
              size="lg"
              icon={Play}
            >
              Start Game
            </Button>
          </div>
          
          <PlayerList 
            players={playersOnly}
            emptyMessage="Waiting for players to join..."
            columns={3}
            showDyslexiaControls={true}
            onToggleDyslexiaSupport={onToggleDyslexiaSupport}
          />
        </div>
      </Card>
    </PageLayout>
  );
} 