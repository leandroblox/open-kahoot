import type { Question, QuestionType } from '@/types/game';
import AddQuestionButton from '@/components/AddQuestionButton';
import QuestionEditor from '@/components/QuestionEditor';
import HostEmptyQuestionsState from './HostEmptyQuestionsState';

interface HostQuestionsSectionProps {
  questions: Question[];
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
  onOpenAIModal: () => void;
}

export default function HostQuestionsSection({
  questions,
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
  onOpenAIModal
}: HostQuestionsSectionProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl text-white font-jua">Perguntas</h2>
      </div>

      {questions.length === 0 ? (
        <HostEmptyQuestionsState 
          onAddQuestion={onAddQuestion}
          onFileImport={onFileImport}
          onOpenAIModal={onOpenAIModal}
        />
      ) : (
        <div>
          <AddQuestionButton onAddQuestion={onAddQuestion} onAppendTSV={onAppendTSV} onOpenAIModal={onOpenAIModal} index={0} />
          
          {questions.map((question, questionIndex) => (
            <div key={question.id}>
              <QuestionEditor
                question={question}
                questionIndex={questionIndex}
                totalQuestions={questions.length}
                onUpdateQuestion={onUpdateQuestion}
                onUpdateOption={onUpdateOption}
                onSetOptionCount={onSetOptionCount}
                onRemoveOption={onRemoveOption}
                onRemoveQuestion={onRemoveQuestion}
                onMoveQuestion={onMoveQuestion}
                onChangeQuestionType={onChangeQuestionType}
              />
              <AddQuestionButton onAddQuestion={onAddQuestion} onAppendTSV={onAppendTSV} onOpenAIModal={onOpenAIModal} index={questionIndex + 1} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 