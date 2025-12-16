'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';

import type { QuestionType } from '@/types/game';
import { questionTypeOptions } from './questionTypeOptions';

interface QuestionTypePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (type: QuestionType) => void;
}

export default function QuestionTypePicker({ isOpen, onClose, onSelect }: QuestionTypePickerProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-3xl rounded-2xl bg-[#1d1b2f] p-8 shadow-2xl border border-white/10">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-white/60 hover:text-white"
          aria-label="Fechar seleção de tipo"
        >
          <X className="h-6 w-6" />
        </button>

        <h3 className="text-2xl font-jua text-white text-center mb-2">Escolha o tipo de pergunta</h3>
        <p className="text-white/70 text-center mb-6">
          Defina o formato da pergunta antes de começar a editar as alternativas.
        </p>

        <div className="grid gap-4 md:grid-cols-3">
          {questionTypeOptions.map(option => {
            const Icon = option.icon;
            return (
              <button
                key={option.type}
                type="button"
                onClick={() => onSelect(option.type)}
                className="group h-full rounded-xl border border-white/15 bg-white/5 p-5 text-left transition hover:border-white/40 hover:bg-white/10"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="rounded-full bg-white/10 p-2 text-white/80">
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="text-lg font-semibold text-white font-jua">{option.title}</span>
                </div>
                <p className="text-sm text-white/70 leading-relaxed">{option.description}</p>
                <div className="mt-4">
                  <div
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-white/10 px-4 py-2 font-semibold text-white transition-colors group-hover:bg-white/20"
                  >
                    Selecionar
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
