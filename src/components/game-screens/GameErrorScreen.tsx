import { useRouter } from 'next/navigation';
import PageLayout from '@/components/PageLayout';
import ErrorScreen from '@/components/ErrorScreen';

interface GameErrorScreenProps {
  error: string;
}

export default function GameErrorScreen({ error }: GameErrorScreenProps) {
  const router = useRouter();

  return (
    <PageLayout gradient="error" showLogo={false}>
      <div className="flex items-center justify-center min-h-[60vh]">
        <ErrorScreen
          title="Jogo não encontrado"
          message={error}
          actionText="Ir para a página inicial"
          onAction={() => router.push('/')}
          autoRedirect={{
            url: '/',
            delay: 3000,
            message: 'Redirecionando para a página inicial...'
          }}
        />
      </div>
    </PageLayout>
  );
} 