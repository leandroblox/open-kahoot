import { Clock } from 'lucide-react';
import { getGradient } from '@/lib/palette';
import AnimatedIcon from '@/components/AnimatedIcon';

interface GameWaitingForResultsScreenProps {
  isHost: boolean;
}

export default function GameWaitingForResultsScreen({ isHost }: GameWaitingForResultsScreenProps) {
  return (
    <div className={`min-h-screen ${getGradient('waiting')} flex items-center justify-center p-8`}>
      <div className="text-center">
        <AnimatedIcon icon={Clock} size="md" iconColor="text-white/60" className="mb-4" />
        <h1 className="text-3xl font-bold text-white mb-4">
          {isHost ? 'Calculando os resultados...' : 'Preparando os seus resultados...'}
        </h1>
        <p className="text-white/80 text-lg">
          {isHost ? 'Preparando os resultados de todos os jogadores' : 'Segure firme, estamos calculando sua pontuação!'}
        </p>
        <div className="flex justify-center mt-6">
          <div className="animate-pulse flex space-x-1">
            <div className="w-2 h-2 bg-white/60 rounded-full"></div>
            <div className="w-2 h-2 bg-white/60 rounded-full"></div>
            <div className="w-2 h-2 bg-white/60 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
} 