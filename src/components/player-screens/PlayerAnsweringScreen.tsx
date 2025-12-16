import { useState } from 'react';
import { getChoiceColor } from '@/lib/palette';
import { Check } from 'lucide-react';
import type { QuestionType } from '@/types/game';

interface PlayerAnsweringScreenProps {
  options: string[];
  onSubmitAnswer: (answerIndices: number[]) => void;
  questionType?: QuestionType;
}

export default function PlayerAnsweringScreen({
  options,
  onSubmitAnswer,
  questionType = 'single'
}: PlayerAnsweringScreenProps) {
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const letters = ['A', 'B', 'C', 'D'];
  const gridColumns = options.length <= 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-2';
  const isMultiple = questionType === 'multiple';

  const handleOptionClick = (index: number) => {
    if (isMultiple) {
      // Toggle selection for multiple choice
      setSelectedIndices(prev => 
        prev.includes(index) 
          ? prev.filter(i => i !== index)
          : [...prev, index]
      );
    } else {
      // Submit immediately for single choice
      onSubmitAnswer([index]);
    }
  };

  const handleSubmit = () => {
    if (selectedIndices.length > 0) {
      onSubmitAnswer(selectedIndices);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
      <h2 className="text-3xl text-white text-center mb-8 font-jua">
        {isMultiple ? 'Escolha as respostas corretas:' : 'Escolha a sua resposta:'}
      </h2>
      <div className={`grid ${gridColumns} gap-6 ${isMultiple ? 'mb-8' : ''}`}>
        {options.map((option, index) => {
          const isSelected = selectedIndices.includes(index);
          const baseColor = getChoiceColor(index);
          
          return (
            <button
              key={index}
              onClick={() => handleOptionClick(index)}
              className={`
                relative h-24 rounded-xl font-bold text-3xl text-white transition-all transform 
                ${isMultiple 
                  ? (isSelected 
                      ? `${baseColor} scale-105 ring-4 ring-white shadow-lg` 
                      : 'bg-white/10 hover:bg-white/20 border-4 border-transparent')
                  : `${baseColor} hover:scale-105 border-4 border-transparent`
                }
              `}
            >
              <div className="flex items-center justify-center gap-3">
                <span>{letters[index] ?? String.fromCharCode(65 + index)}</span>
                {isMultiple && isSelected && <Check className="w-8 h-8" />}
              </div>
            </button>
          );
        })}
      </div>

      {isMultiple && (
        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={selectedIndices.length === 0}
            className="px-12 py-4 bg-white text-blue-600 font-bold text-xl rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform shadow-lg"
          >
            Confirmar Resposta
          </button>
        </div>
      )}
    </div>
  );
}