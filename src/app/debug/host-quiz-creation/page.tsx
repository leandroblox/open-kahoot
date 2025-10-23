'use client';

import HostQuizCreationScreen from '@/components/host-setup/HostQuizCreationScreen';
import { mockQuestions, mockGameSettings } from '@/lib/debug-data';

export default function DebugHostQuizCreationPage() {

  return (
    <HostQuizCreationScreen
      questions={mockQuestions}
      gameSettings={mockGameSettings}
      onUpdateSettings={() => {}}
      onAddQuestion={() => {}}
      onAppendTSV={() => {}}
      onFileImport={() => {}}
      onUpdateQuestion={() => {}}
      onUpdateOption={() => {}}
      onSetOptionCount={() => {}}
      onRemoveOption={() => {}}
      onRemoveQuestion={() => {}}
      onMoveQuestion={() => {}}
      onChangeQuestionType={() => {}}
      onDownloadTSV={() => {}}
      onCreateGame={() => {}}
      onGenerateAIQuestions={async (subject: string, language: 'english' | 'french', accessKey: string, questionCount: number) => {
        console.log('Geração por IA no modo de depuração', { subject, language, accessKey, questionCount });
        return Promise.resolve();
      }}
    />
  );
} 