'use client';

import Link from 'next/link';
import { Eye, Users, Play, Clock, Trophy, Settings, LogIn } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import Card from '@/components/Card';

export default function DebugIndexPage() {
  const debugScreens = [
    {
      title: 'Configuração do anfitrião',
      screens: [
        { name: 'Criação do quiz', path: '/debug/host-quiz-creation', icon: Settings },
        { name: 'Sala de espera', path: '/debug/host-lobby', icon: Users },
      ]
    },
    {
      title: 'Fluxo de entrada',
      screens: [
        { name: 'Formulário de entrada', path: '/debug/join-form', icon: LogIn },
      ]
    },
    {
      title: 'Fases do jogo (visão do anfitrião)',
      screens: [
        { name: 'Tela de espera', path: '/debug/game-waiting', icon: Clock },
        { name: 'Fase de leitura', path: '/debug/game-thinking?view=host', icon: Eye },
        { name: 'Fase de resposta', path: '/debug/game-answering?view=host', icon: Play },
        { name: 'Fase de resultados', path: '/debug/game-results?view=host', icon: Trophy },
        { name: 'Ranking', path: '/debug/game-leaderboard', icon: Trophy },
        { name: 'Resultados finais', path: '/debug/game-final-results?view=host', icon: Trophy },
      ]
    },
    {
      title: 'Fases do jogo (visão do jogador)',
      screens: [
        { name: 'Fase de leitura', path: '/debug/game-thinking?view=player', icon: Eye },
        { name: 'Fase de resposta', path: '/debug/game-answering?view=player', icon: Play },
        { name: 'Fase de resposta (respondido)', path: '/debug/game-answering-answered', icon: Play },
        { name: 'Fase de resultados (acerto)', path: '/debug/game-results?view=player&result=correct', icon: Trophy },
        { name: 'Fase de resultados (erro)', path: '/debug/game-results?view=player&result=incorrect', icon: Trophy },
        { name: 'Jogador aguardando', path: '/debug/game-player-waiting', icon: Clock },
        { name: 'Resultados finais', path: '/debug/game-final-results?view=player', icon: Trophy },
      ]
    },
    {
      title: 'Telas do sistema',
      screens: [
        { name: 'Tela de validação', path: '/debug/game-validation', icon: Clock },
        { name: 'Aguardando resultados (anfitrião)', path: '/debug/game-waiting-for-results?view=host', icon: Clock },
        { name: 'Aguardando resultados (jogador)', path: '/debug/game-waiting-for-results?view=player', icon: Clock },
        { name: 'Tela de erro', path: '/debug/game-error', icon: Eye },
        { name: 'Tela alternativa', path: '/debug/game-fallback', icon: Eye },
      ]
    },
  ];

  return (
    <PageLayout gradient="host" maxWidth="4xl">
      <Card>
        <div className="text-center mb-8">
          <h1 className="text-3xl text-white mb-2 font-jua">Telas de depuração</h1>
          <p className="text-white/80">Visualize todos os layouts e fases do jogo</p>
        </div>

        <div className="space-y-8">
          {debugScreens.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <h2 className="text-xl text-white mb-4 font-jua">{section.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {section.screens.map((screen, screenIndex) => (
                  <Link
                    key={screenIndex}
                    href={screen.path}
                    className="block p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <screen.icon className="w-5 h-5 text-white" />
                      <span className="text-white text-sm font-medium">{screen.name}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </PageLayout>
  );
} 