import { Plus, Upload, Sparkles } from 'lucide-react';
import Button from '@/components/Button';

interface HostEmptyQuestionsStateProps {
  onAddQuestion: (index: number) => void;
  onFileImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onOpenAIModal: () => void;
}

export default function HostEmptyQuestionsState({ 
  onAddQuestion, 
  onFileImport,
  onOpenAIModal 
}: HostEmptyQuestionsStateProps) {
  return (
    <div className="bg-white/5 rounded-lg p-8 border border-white/20 text-center">
      <p className="text-white/80 text-lg mb-4 font-jua">Crie sua primeira pergunta</p>
      <p className="text-white/60 mb-6">Escolha como deseja começar:</p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Button
          onClick={() => onAddQuestion(0)}
          variant="black"
          size="lg"
          icon={Plus}
        >
          Criar Pergunta
        </Button>

        <div className="text-white/40 text-sm">ou</div>
        
        <div className="relative">
          <input
            type="file"
            accept=".tsv,.txt"
            onChange={onFileImport}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <Button variant="black" size="lg" icon={Upload}>
            Importar arquivo TSV
          </Button>
        </div>

        <div className="text-white/40 text-sm">ou</div>

        <Button
          onClick={onOpenAIModal}
          variant="black"
          size="lg"
          icon={Sparkles}
        >
          Pedir para a IA
        </Button>
      </div>

      <p className="text-white/40 text-sm mt-4">
        Os arquivos TSV devem conter as colunas: question, correct, wrong1, wrong2, wrong3 e, opcionalmente, explanation.
      </p>
    </div>
  );
} 