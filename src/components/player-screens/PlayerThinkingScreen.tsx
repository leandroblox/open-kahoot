import { Users } from 'lucide-react';
import Card from '@/components/Card';
import AnimatedIcon from '@/components/AnimatedIcon';

export default function PlayerThinkingScreen() {
  return (
    <Card className="text-center">
      <AnimatedIcon icon={Users} size="md" className="mb-4" iconColor="text-white/60" />
      <h2 className="text-2xl font-bold text-white mb-4">Prepare-se!</h2>
      <p className="text-white/80 text-lg">Olhe para a tela principal e leia a pergunta</p>
    </Card>
  );
} 