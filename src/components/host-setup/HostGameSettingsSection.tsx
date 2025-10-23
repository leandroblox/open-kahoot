import { Settings } from 'lucide-react';
import type { GameSettings } from '@/types/game';

interface HostGameSettingsSectionProps {
  gameSettings: GameSettings;
  onUpdateSettings: (settings: GameSettings) => void;
}

export default function HostGameSettingsSection({ 
  gameSettings, 
  onUpdateSettings 
}: HostGameSettingsSectionProps) {
  return (
    <div className="mb-8 bg-white/5 rounded-lg p-6 border border-white/20">
      <h2 className="text-2xl text-white mb-4 flex items-center gap-2 font-jua">
        <Settings className="w-6 h-6" />
        Configurações do Jogo
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-white font-medium mb-2">
            Tempo de Leitura (segundos)
          </label>
          <p className="text-white/70 text-sm mb-2">
            Tempo para mostrar a pergunta antes de liberar as respostas
          </p>
          <select
            value={gameSettings.thinkTime}
            onChange={(e) => onUpdateSettings({ ...gameSettings, thinkTime: parseInt(e.target.value) })}
            className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-white/50 [&>option]:text-black [&>option]:bg-white"
          >
            <option value={5}>5 segundos</option>
            <option value={10}>10 segundos</option>
            <option value={20}>20 segundos</option>
          </select>
        </div>
        <div>
          <label className="block text-white font-medium mb-2">
            Tempo para Responder (segundos)
          </label>
          <p className="text-white/70 text-sm mb-2">
            Tempo disponível para enviar as respostas
          </p>
          <select
            value={gameSettings.answerTime}
            onChange={(e) => onUpdateSettings({ ...gameSettings, answerTime: parseInt(e.target.value) })}
            className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-white/50 [&>option]:text-black [&>option]:bg-white"
          >
            <option value={20}>20 segundos</option>
            <option value={30}>30 segundos</option>
            <option value={60}>60 segundos</option>
          </select>
        </div>
      </div>
    </div>
  );
} 