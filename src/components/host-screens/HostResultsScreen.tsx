import { useEffect } from 'react';
import { GameStats } from '@/types/game';
import { getChoiceColor, correct, incorrect } from '@/lib/palette';
import Button from '@/components/Button';
import { ChevronRight } from 'lucide-react';
import { useCountdownMusic } from '@/lib/useCountdownMusic';

interface HostResultsScreenProps {
  questionStats: GameStats;
  onShowLeaderboard: () => void;
}

export default function HostResultsScreen({ 
  questionStats, 
  onShowLeaderboard 
}: HostResultsScreenProps) {
  const { playGong } = useCountdownMusic();

  // Play gong sound when results phase starts (only once)
  useEffect(() => {
    playGong();
  }, [playGong]); // Add missing dependency

  // Choice button colors for display
  const choiceColors = [
    getChoiceColor(0), // A - Red
    getChoiceColor(1), // B - Blue
    getChoiceColor(2), // C - Yellow
    getChoiceColor(3)  // D - Green
  ];

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
      <div className="text-center mb-8">
        <h1 className="text-4xl text-white mb-6 font-jua">
          {questionStats.question.question}
        </h1>
        {questionStats.question.explanation && (
          <p className="text-white/80 text-xl mb-6 bg-black/20 p-4 rounded-lg">
            {questionStats.question.explanation}
          </p>
        )}
        <p className="text-white/80 text-2xl">
          {questionStats.correctAnswers} de {questionStats.totalPlayers} jogadores acertaram!
        </p>
      </div>

      <div className="text-center mb-8">
        <Button
          onClick={onShowLeaderboard}
          variant="black"
          size="xl"
          icon={ChevronRight}
          iconPosition="right"
          className="mx-auto"
        >
          Mostrar Ranking
        </Button>
      </div>

      <div className="space-y-4">
        {questionStats.answers.map((answer, index) => (
          <div key={index} className="relative">
            <div className={`flex items-center justify-between p-6 rounded-lg border-2 ${
              index === questionStats.question.correctAnswer
                ? 'bg-green-500/30 border-green-400 ring-2 ring-green-300'
                : 'bg-white/10 border-white/20'
            }`}>
              <div className="flex items-center gap-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl ${
                  choiceColors[index].split(' ')[0]
                }`}>
                  {String.fromCharCode(65 + index)}
                </div>
                <span className="text-white font-semibold text-xl">
                  {questionStats.question.options[index]}
                </span>
                {index === questionStats.question.correctAnswer && (
                  <span className="text-green-300 font-bold text-lg">✓ CERTO</span>
                )}
              </div>
              <div className="flex items-center gap-4">
                <span className="text-white font-bold text-xl">{answer.count}</span>
                <span className="text-white/80 text-lg">({answer.percentage}%)</span>
              </div>
            </div>
            <div 
              className={`absolute bottom-0 left-0 h-2 rounded-b-lg transition-all duration-1000 ${
                index === questionStats.question.correctAnswer ? correct.primary : incorrect.primary
              }`}
              style={{ width: `${answer.percentage}%` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
} 