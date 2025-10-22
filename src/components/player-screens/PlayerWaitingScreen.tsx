import { Check } from 'lucide-react';
import AnimatedIcon from '@/components/AnimatedIcon';

export default function PlayerWaitingScreen() {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
      <div className="text-center">
        <AnimatedIcon 
          icon={Check} 
          size="md" 
          iconColor="text-white"
        />
        <h2 className="text-3xl text-white mb-4 font-jua">
          Resposta enviada!
        </h2>
        <p className="text-white/70 text-lg">
          Aguardando os outros jogadores responderem...
        </p>
      </div>
    </div>
  );
} 