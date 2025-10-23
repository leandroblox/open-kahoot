'use client';

import Button from '@/components/Button';
import type { QuestionType } from '@/types/game';
import { questionTypeOptions } from './questionTypeOptions';

interface QuestionTypeSelectorProps {
  value: QuestionType;
  onChange: (type: QuestionType) => void;
}

export default function QuestionTypeSelector({ value, onChange }: QuestionTypeSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-white/70 text-sm font-medium" htmlFor="question-type-select">
          Tipo de Pergunta:
        </label>
        <select
          id="question-type-select"
          value={value}
          onChange={(event) => onChange(event.target.value as QuestionType)}
          className="bg-white/10 border border-white/30 text-white rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-white/50"
        >
          {questionTypeOptions.map(option => (
            <option key={option.type} value={option.type} className="text-black">
              {option.title}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {questionTypeOptions.map(option => {
          const Icon = option.icon;
          const isActive = value === option.type;
          return (
            <Button
              key={option.type}
              onClick={() => onChange(option.type)}
              variant={isActive ? 'black' : 'pill'}
              size="md"
              className={`text-left h-full w-full ${isActive ? 'border border-white/40 bg-white/20 text-white shadow-lg' : ''}`}
            >
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-white/10 p-2 text-white/80">
                  <Icon className="h-6 w-6" />
                </span>
                <div>
                  <p className="font-semibold font-jua text-base text-white">{option.title}</p>
                  <p className="text-xs text-white/70 leading-relaxed">{option.description}</p>
                </div>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
