import { getChoiceColor } from '@/lib/palette';

interface PlayerAnsweringScreenProps {
  options: string[];
  onSubmitAnswer: (answerIndex: number) => void;
}

export default function PlayerAnsweringScreen({
  options,
  onSubmitAnswer
}: PlayerAnsweringScreenProps) {
  const letters = ['A', 'B', 'C', 'D'];
  const gridColumns = options.length <= 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-2';

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
      <h2 className="text-3xl text-white text-center mb-8 font-jua">
        Escolha a sua resposta:
      </h2>
      <div className={`grid ${gridColumns} gap-6`}>
        {options.map((_, index) => (
          <button
            key={index}
            onClick={() => onSubmitAnswer(index)}
            className={`h-24 rounded-xl font-bold text-3xl text-white transition-all transform hover:scale-105 border-4 ${getChoiceColor(index)} hover:scale-110`}
          >
            {letters[index] ?? String.fromCharCode(65 + index)}
          </button>
        ))}
      </div>
    </div>
  );
}