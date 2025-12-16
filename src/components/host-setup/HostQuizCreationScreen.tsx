'use client';

import { useState } from 'react';
import { Download, MonitorPlay } from 'lucide-react';
import type { Question, GameSettings, QuestionType } from '@/types/game';
import PageLayout from '@/components/PageLayout';
import Card from '@/components/Card';
import Button from '@/components/Button';
import HostGameSettingsSection from './HostGameSettingsSection';
import HostQuestionsSection from './HostQuestionsSection';
import HostAIGenerationModal from './HostAIGenerationModal';

interface HostQuizCreationScreenProps {
  questions: Question[];
  gameSettings: GameSettings;
  onUpdateSettings: (settings: GameSettings) => void;
  onAddQuestion: (index?: number) => void;
  onAppendTSV: (index: number, event: React.ChangeEvent<HTMLInputElement>) => void;
  onFileImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onUpdateQuestion: (index: number, field: keyof Question, value: string | number | number[]) => void;
  onUpdateOption: (questionIndex: number, optionIndex: number, value: string) => void;
  onSetOptionCount: (questionIndex: number, count: number) => void;
  onRemoveOption: (questionIndex: number, optionIndex: number) => void;
  onRemoveQuestion: (index: number) => void;
  onMoveQuestion: (index: number, direction: 'up' | 'down') => void;
  onChangeQuestionType: (index: number, type: QuestionType) => void;
  onDownloadTSV: () => void;
  onCreateGame: () => void;
  onGenerateAIQuestions: (subject: string, language: 'english' | 'french', accessKey: string, questionCount: number) => Promise<void>;
}

export default function HostQuizCreationScreen({
  questions,
  gameSettings,
  onUpdateSettings,
  onAddQuestion,
  onAppendTSV,
  onFileImport,
  onUpdateQuestion,
  onUpdateOption,
  onSetOptionCount,
  onRemoveOption,
  onRemoveQuestion,
  onMoveQuestion,
  onChangeQuestionType,
  onDownloadTSV,
  onCreateGame,
  onGenerateAIQuestions
}: HostQuizCreationScreenProps) {
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const isFormValid = questions.length > 0 && !questions.some(q => {
    const hasQuestion = !!q.question?.trim();
    const validOptions = q.options.filter(o => !!o?.trim());
    const hasEnoughOptions = validOptions.length >= 2;
    const hasCorrectAnswer = q.correctAnswers && q.correctAnswers.length > 0;
    
    return !hasQuestion || !hasEnoughOptions || !hasCorrectAnswer;
  });

  return (
    <PageLayout gradient="host" maxWidth="4xl">
      <Card>
        <h2 className="text-3xl text-white mb-8 text-center font-jua">Crie Seu Quiz</h2>

        <HostGameSettingsSection 
          gameSettings={gameSettings}
          onUpdateSettings={onUpdateSettings}
        />

        <HostQuestionsSection
          questions={questions}
          onAddQuestion={onAddQuestion}
          onAppendTSV={onAppendTSV}
          onFileImport={onFileImport}
          onUpdateQuestion={onUpdateQuestion}
          onUpdateOption={onUpdateOption}
          onSetOptionCount={onSetOptionCount}
          onRemoveOption={onRemoveOption}
          onRemoveQuestion={onRemoveQuestion}
          onMoveQuestion={onMoveQuestion}
          onChangeQuestionType={onChangeQuestionType}
          onOpenAIModal={() => setIsAIModalOpen(true)}
        />

        {questions.length > 0 && (
          <div className="text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={onDownloadTSV}
                variant="black"
                size="lg"
                icon={Download}
              >
                Baixar TSV
              </Button>
              <Button
                onClick={onCreateGame}
                disabled={!isFormValid}
                variant="black"
                size="lg"
                icon={MonitorPlay}
              >
                Criar Jogo
              </Button>
            </div>
            {!isFormValid && (
              <p className="text-red-400 text-sm mt-2 bg-black/20 inline-block px-3 py-1 rounded">
                Preencha todas as perguntas com texto, pelo menos 2 opções e uma resposta correta.
              </p>
            )}
          </div>
        )}
      </Card>

      <HostAIGenerationModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        onGenerateQuestions={onGenerateAIQuestions}
      />
    </PageLayout>
  );
} 