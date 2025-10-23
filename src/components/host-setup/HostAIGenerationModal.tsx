'use client';

import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Modal from '@/components/Modal';

interface HostAIGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerateQuestions: (subject: string, language: 'english' | 'french', accessKey: string, questionCount: number) => Promise<void>;
}

const subjectPlaceholders = {
  english: 'ex.: Segunda Guerra Mundial, Fotossíntese, Noções básicas de JavaScript...',
  french: 'ex.: Seconde Guerre mondiale, Photosynthèse, Bases de JavaScript...'
};

export default function HostAIGenerationModal({ 
  isOpen,
  onClose,
  onGenerateQuestions 
}: HostAIGenerationModalProps) {
  const [subject, setSubject] = useState('');
  const [language, setLanguage] = useState<'english' | 'french'>('english');
  const [accessKey, setAccessKey] = useState('');
  const [questionCount, setQuestionCount] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!subject.trim()) {
      alert('Informe um assunto para o quiz.');
      return;
    }

    if (!accessKey.trim()) {
      alert('Informe a chave de acesso para geração via IA.');
      return;
    }

    setIsGenerating(true);
    try {
      await onGenerateQuestions(subject, language, accessKey, questionCount);
      // Reset form and close modal on success
      setSubject('');
      setAccessKey('');
      setQuestionCount(5);
      onClose();
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClose = () => {
    if (!isGenerating) {
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Geração de quiz com IA">
      <p className="text-white/80 text-sm mb-6">
        Deixe a IA criar perguntas para você! Selecione um idioma e informe um assunto.
      </p>

      <div className="space-y-4">

        <Input
          label="Chave de acesso"
          type="password"
          placeholder="Digite a chave de acesso da geração via IA"
          value={accessKey}
          onChange={(e) => setAccessKey(e.target.value)}
          disabled={isGenerating}
        />

        <div className="space-y-2">
          <label className="block text-white text-sm font-medium">
            Idioma
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as 'english' | 'french')}
            disabled={isGenerating}
            className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-white/50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="english" className="bg-slate-800">Inglês</option>
            <option value="french" className="bg-slate-800">Francês</option>
          </select>
        </div>

        <Input
          label="Assunto"
          placeholder={subjectPlaceholders[language]}
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          disabled={isGenerating}
        />

        <div className="space-y-2">
          <label className="block text-white text-sm font-medium">
            Quantidade de perguntas
          </label>
          <input
            type="number"
            min="1"
            max="20"
            value={questionCount}
            onChange={(e) => setQuestionCount(Math.min(20, Math.max(1, parseInt(e.target.value) || 1)))}
            disabled={isGenerating}
            className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <div className="flex justify-center pt-2">
          <Button
            onClick={handleGenerate}
            disabled={!subject.trim() || !accessKey.trim() || isGenerating}
            loading={isGenerating}
            variant="black"
            size="md"
            icon={Sparkles}
          >
            {isGenerating ? 'Gerando...' : 'Gerar perguntas'}
          </Button>
        </div>
      </div>

      <p className="text-white/40 text-sm mt-4 text-center">
        ⚠️ O conteúdo gerado por IA pode conter imprecisões. Revise e confirme todas as perguntas antes de usar.
      </p>
    </Modal>
  );
}

