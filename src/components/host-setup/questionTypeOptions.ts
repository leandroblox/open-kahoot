import type { QuestionType } from '@/types/game';
import { CheckCircle2, ListChecks, ToggleLeft, type LucideIcon } from 'lucide-react';

export interface QuestionTypeOption {
  type: QuestionType;
  title: string;
  description: string;
  icon: LucideIcon;
}

export const questionTypeOptions: QuestionTypeOption[] = [
  {
    type: 'single',
    title: 'Escolha Única',
    description: 'Uma resposta correta com até três alternativas.',
    icon: CheckCircle2,
  },
  {
    type: 'multiple',
    title: 'Múltipla Escolha',
    description: 'Quatro alternativas para respostas mais elaboradas.',
    icon: ListChecks,
  },
  {
    type: 'boolean',
    title: 'Verdadeiro ou Falso',
    description: 'Duas opções pré-configuradas para respostas rápidas.',
    icon: ToggleLeft,
  },
];
