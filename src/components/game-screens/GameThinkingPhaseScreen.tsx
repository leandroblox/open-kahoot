import PageLayout from '@/components/PageLayout';
import Timer from '@/components/Timer';
import HostThinkingScreen from '@/components/host-screens/HostThinkingScreen';
import PlayerThinkingScreen from '@/components/player-screens/PlayerThinkingScreen';
import type { Question, Game, SanitizedQuestion, SanitizedGame } from '@/types/game';

interface GameThinkingPhaseScreenProps {
  currentQuestion: Question | SanitizedQuestion;
  timeLeft: number;
  game: Game | SanitizedGame | null;
  isHost: boolean;
  isPlayer: boolean;
}

export default function GameThinkingPhaseScreen({ 
  currentQuestion, 
  timeLeft, 
  game, 
  isHost, 
  isPlayer 
}: GameThinkingPhaseScreenProps) {
  return (
    <PageLayout gradient="thinking" maxWidth="4xl" showLogo={false}>
      <Timer
        timeLeft={timeLeft}
        totalTime={game?.settings.thinkTime || 5}
        label={isHost ? 'Os jogadores estão lendo a pergunta' : 'Leia a pergunta com atenção'}
        variant="thinking"
      />

      {/* Question Display - Host Screen */}
      {isHost && (
        <HostThinkingScreen currentQuestion={currentQuestion as Question} />
      )}

      {/* Player Device - Waiting */}
      {isPlayer && (
        <PlayerThinkingScreen />
      )}
    </PageLayout>
  );
} 