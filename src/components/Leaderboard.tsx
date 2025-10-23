import { Trophy, LucideIcon } from 'lucide-react';
import type { Player } from '@/types/game';
import Button from './Button';
import AnimatedIcon from './AnimatedIcon';

interface LeaderboardProps {
  players: Player[];
  title?: string;
  subtitle?: string;
  showPodium?: boolean;
  className?: string;
  buttons?: {
    text: string;
    onClick: () => void;
    icon?: LucideIcon;
    iconPosition?: 'left' | 'right';
    variant?: 'link' | 'primary' | 'secondary' | 'success' | 'danger' | 'ghost' | 'outline' | 'pill' | 'black';
  }[];
}

export default function Leaderboard({
  players,
  title = "Ranking",
  subtitle,
  showPodium = true,
  className = "",
  buttons
}: LeaderboardProps) {
  const getPodiumStyle = (index: number) => {
    if (!showPodium) return 'bg-white/10 border-white/20';
    
    switch (index) {
      case 0:
        return 'bg-yellow-500/30 border-yellow-400 ring-2 ring-yellow-300 scale-105';
      case 1:
        return 'bg-gray-300/30 border-gray-400';
      case 2:
        return 'bg-orange-600/30 border-orange-500';
      default:
        return 'bg-white/10 border-white/20';
    }
  };

  const getPositionBadgeStyle = (index: number) => {
    if (!showPodium) return 'bg-slate-600';
    
    switch (index) {
      case 0:
        return 'bg-yellow-500';
      case 1:
        return 'bg-gray-500';
      case 2:
        return 'bg-orange-600';
      default:
        return 'bg-slate-600';
    }
  };

  return (
    <div className={className}>
      {(title || subtitle) && (
        <div className="text-center mb-8">
          <AnimatedIcon icon={Trophy} size="xl" iconColor="text-yellow-300" />
          <h1 className="text-4xl text-white mb-4 font-jua">{title}</h1>
          {subtitle && (
            <p className="text-white/80 text-xl">{subtitle}</p>
          )}
        </div>
      )}

      {buttons && buttons.length > 0 && (
        <div className="text-center mb-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {buttons.map((button, index) => (
              <Button
                key={index}
                onClick={button.onClick}
                variant={button.variant || "black"}
                size="xl"
                icon={button.icon}
                iconPosition={button.iconPosition}
                className="mx-auto sm:mx-0"
              >
                {button.text}
              </Button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {players.map((player, index) => (
          <div
            key={player.id}
            className={`flex items-center justify-between p-6 rounded-lg border-2 transition-all ${getPodiumStyle(index)}`}
          >
            <div className="flex items-center gap-6">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl ${getPositionBadgeStyle(index)}`}>
                {index + 1}
              </div>
              <div>
                <div className="text-white font-bold text-xl">{player.name}</div>
                {index === 0 && showPodium && (
                  <div className="text-yellow-300 font-semibold">👑 Líder</div>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-white font-bold text-2xl">{player.score}</div>
              <div className="text-white/70 text-sm">pontos</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 