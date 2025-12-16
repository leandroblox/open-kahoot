import { ChevronRight } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import Card from '@/components/Card';
import Leaderboard from '@/components/Leaderboard';
import type { Player, Game, SanitizedGame } from '@/types/game';

interface GameLeaderboardScreenProps {
  leaderboard: Player[];
  game: Game | SanitizedGame | null;
  onNextQuestion: () => void;
}

export default function GameLeaderboardScreen({ 
  leaderboard, 
  game, 
  onNextQuestion 
}: GameLeaderboardScreenProps) {
  const isLastQuestion = (game?.currentQuestionIndex ?? 0) + 1 >= (game?.questions.length ?? 0);

  return (
    <PageLayout gradient="leaderboard" maxWidth="4xl" showLogo={false}>
      <Card>
        <Leaderboard
          players={leaderboard}
          title="Classificação Atual"
          subtitle={`Pergunta ${(game?.currentQuestionIndex ?? 0) + 1} de ${game?.questions.length ?? 0} concluída`}
          buttons={[{
            text: isLastQuestion ? 'Encerrar Jogo' : 'Próxima Pergunta',
            onClick: onNextQuestion,
            icon: ChevronRight,
            iconPosition: 'right'
          }]}
        />
      </Card>
    </PageLayout>
  );
} 