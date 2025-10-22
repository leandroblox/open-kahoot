'use client';

import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import Card from '@/components/Card';
import Button from '@/components/Button';
import HostAIGenerationModal from '@/components/host-setup/HostAIGenerationModal';

export default function AIGenerationDebugPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleGenerateQuestions = async (subject: string, language: 'english' | 'french', accessKey: string, questionCount: number) => {
    try {
      console.log('Geração por IA solicitada:', { subject, language, accessKey, questionCount });
      
      // Call the API endpoint
      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subject, language, accessKey, questionCount }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Não foi possível gerar perguntas');
      }

      if (!data.success || !data.questions) {
        throw new Error('Resposta inválida da API');
      }

      // Display the generated questions
      console.log('Perguntas geradas:', data.questions);
      
      const questionsText = data.questions.map((q: {
        question: string;
        correct: string;
        wrong1: string;
        wrong2: string;
        wrong3: string;
        explanation?: string;
      }, i: number) => 
        `\n${i + 1}. ${q.question}\n   ✓ ${q.correct}\n   ✗ ${q.wrong1}\n   ✗ ${q.wrong2}\n   ✗ ${q.wrong3}${q.explanation ? `\n   💡 ${q.explanation}` : ''}`
      ).join('\n');

      alert(`${data.questions.length} perguntas geradas com sucesso!${questionsText}`);

    } catch (error) {
      console.error('Erro ao gerar perguntas:', error);
      alert(`Erro: ${error instanceof Error ? error.message : 'Não foi possível gerar perguntas'}`);
    }
  };

  return (
    <PageLayout gradient="host" maxWidth="4xl">
      <Card>
        <h2 className="text-3xl text-white mb-8 text-center font-jua">Modal de geração por IA - depuração</h2>

        <div>
          <div className="text-center mb-6">
            <p className="text-white/80 mb-4">
              Esta página demonstra a funcionalidade do modal de geração por IA.
            </p>
            <Button
              onClick={() => setIsModalOpen(true)}
              variant="black"
              size="lg"
              icon={Sparkles}
            >
              Abrir modal de geração por IA
            </Button>
          </div>

          <p className="text-white/60 text-center mt-4">
            Clique no botão para abrir o modal e testar a geração de perguntas com IA.
          </p>
        </div>
      </Card>

      <HostAIGenerationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onGenerateQuestions={handleGenerateQuestions}
      />
    </PageLayout>
  );
}

