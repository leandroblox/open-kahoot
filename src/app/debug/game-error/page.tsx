'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import GameErrorScreen from '@/components/game-screens/GameErrorScreen';

function GameErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error') || 'Jogo não encontrado ou indisponível';

  return (
    <GameErrorScreen error={error} />
  );
}

export default function DebugGameErrorPage() {
  return (
    <Suspense fallback={<GameErrorScreen error="Carregando..." />}>
      <GameErrorContent />
    </Suspense>
  );
} 