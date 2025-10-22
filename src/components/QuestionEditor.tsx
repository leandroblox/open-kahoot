'use client';

import { Trash2, ChevronUp, ChevronDown, Shuffle, Upload, MinusCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Question } from '@/types/game';
import Button from '@/components/Button';
import { useCallback, useState } from 'react';
import { compressImage } from '@/lib/compressImage';
import Image from 'next/image';

interface QuestionEditorProps {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  onUpdateQuestion: (index: number, field: keyof Question, value: string | number) => void;
  onUpdateOption: (questionIndex: number, optionIndex: number, value: string) => void;
  onSetOptionCount: (questionIndex: number, count: number) => void;
  onRemoveOption: (questionIndex: number, optionIndex: number) => void;
  onRemoveQuestion: (index: number) => void;
  onMoveQuestion: (index: number, direction: 'up' | 'down') => void;
}

export default function QuestionEditor({
  question,
  questionIndex,
  totalQuestions,
  onUpdateQuestion,
  onUpdateOption,
  onSetOptionCount,
  onRemoveOption,
  onRemoveQuestion,
  onMoveQuestion
}: QuestionEditorProps) {
  const handleShuffleOptions = () => {
    // Create array of options with their indices
    const optionsWithIndices = question.options.map((option, index) => ({
      option,
      originalIndex: index
    }));
    
    // Shuffle the array
    for (let i = optionsWithIndices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [optionsWithIndices[i], optionsWithIndices[j]] = [optionsWithIndices[j], optionsWithIndices[i]];
    }
    
    // Update each option in its new position
    optionsWithIndices.forEach((item, newIndex) => {
      onUpdateOption(questionIndex, newIndex, item.option);
    });
    
    // Find new index of the correct answer
    const newCorrectAnswerIndex = optionsWithIndices.findIndex(
      item => item.originalIndex === question.correctAnswer
    );
    
    // Update the correct answer index
    onUpdateQuestion(questionIndex, 'correctAnswer', newCorrectAnswerIndex);
  };

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Compress / resize the image before storing it
      const compressed = await compressImage(file, {
        maxWidth: 1024,
        maxHeight: 1024,
        quality: 0.8
      });
      onUpdateQuestion(questionIndex, 'image', compressed);
    } catch (err) {
      console.error('Image compression failed', err);
      // Fallback to original image if compression fails
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateQuestion(questionIndex, 'image', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [questionIndex, onUpdateQuestion]);

  // Drag & drop handlers
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;

    try {
      const compressed = await compressImage(file, {
        maxWidth: 1024,
        maxHeight: 1024,
        quality: 0.8,
      });
      onUpdateQuestion(questionIndex, 'image', compressed);
    } catch (err) {
      console.error('Image compression failed', err);
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateQuestion(questionIndex, 'image', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [questionIndex, onUpdateQuestion]);

  return (
    <motion.div
      layout
      layoutId={question.id}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="bg-white/5 rounded-lg p-6 border border-white/20"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white font-jua">Pergunta {questionIndex + 1}</h3>
          <div className="mt-2 flex items-center gap-2 text-sm">
            <span className="text-white/70">Alternativas:</span>
            <select
              value={question.options.length}
              onChange={(event) => onSetOptionCount(questionIndex, Number(event.target.value))}
              className="bg-white/10 border border-white/30 text-white rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              {[2, 3, 4].map(count => (
                <option key={count} value={count} className="text-black">
                  {count}
                </option>
              ))}
            </select>
            {question.options.length === 2 && (
              <span className="text-white/60">Ideal para verdadeiro ou falso</span>
            )}
          </div>
        </div>
        <div className="flex gap-2 self-start">
          <Button
            onClick={handleShuffleOptions}
            disabled={question.options.length < 2}
            variant="ghost"
            size="icon"
            icon={Shuffle}
            className="text-white hover:text-white/70 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Embaralhar alternativas"
          >
          </Button>
          <Button
            onClick={() => onMoveQuestion(questionIndex, 'up')}
            disabled={questionIndex === 0}
            variant="ghost"
            size="icon"
            icon={ChevronUp}
            className="text-white hover:text-white/70 disabled:opacity-30 disabled:cursor-not-allowed"
          >
          </Button>
          <Button
            onClick={() => onMoveQuestion(questionIndex, 'down')}
            disabled={questionIndex === totalQuestions - 1}
            variant="ghost"
            size="icon"
            icon={ChevronDown}
            className="text-white hover:text-white/70 disabled:opacity-30 disabled:cursor-not-allowed"
          >
          </Button>
          <Button
            onClick={() => onRemoveQuestion(questionIndex)}
            variant="ghost"
            size="icon"
            icon={Trash2}
            className="text-white hover:text-white/70"
          >
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={question.question}
          onChange={(e) => onUpdateQuestion(questionIndex, 'question', e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
          placeholder="Digite sua pergunta..."
        />
      </div>
      <div className="flex gap-4 mb-4">
        <div className="grid flex-1 grid-cols-1 md:grid-cols-2 gap-4">
          {question.options.map((option, optionIndex) => {
            const isCorrectAnswer = question.correctAnswer === optionIndex;
            const canRemoveOption = question.options.length > 2;

            return (
              <div
                key={optionIndex}
                className="flex items-center gap-2"
              >
              <input
                type="radio"
                name={`correct-${questionIndex}`}
                checked={isCorrectAnswer}
                onChange={() => onUpdateQuestion(questionIndex, 'correctAnswer', optionIndex)}
                className="text-green-500 focus:ring-green-500"
              />
              <input
                type="text"
                value={option}
                onChange={(e) => onUpdateOption(questionIndex, optionIndex, e.target.value)}
                className={`flex-1 px-3 py-2 rounded-lg border text-white placeholder-white/60 focus:outline-none focus:ring-2 transition-all ${
                  isCorrectAnswer
                    ? 'bg-green-300/20 border-green-400 focus:ring-green-400 focus:border-green-300'
                    : 'bg-white/20 border-white/30 focus:ring-white/50 focus:border-white/50'
                }`}
                placeholder={`Alternativa ${optionIndex + 1}...`}
              />
              {canRemoveOption && (
                <Button
                  onClick={() => onRemoveOption(questionIndex, optionIndex)}
                  variant="ghost"
                  size="icon"
                  icon={MinusCircle}
                  className="text-white hover:text-white/70"
                  title="Remover alternativa"
                />
              )}
            </div>
            );
          })}
        </div>
        <div className="relative w-28 h-28">
          <input
            type="file"
            id={`image-upload-${question.id}`}
            className="hidden"
            accept="image/*"
            onChange={handleImageUpload}
          />
          <label
            htmlFor={`image-upload-${question.id}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`cursor-pointer flex items-center justify-center w-full h-full rounded-lg border-2 border-dashed transition-colors ${
              isDragOver ? 'bg-white/20 border-white' : 'bg-white/10 border-white/30 hover:bg-white/20'
            }`}
          >
            {!question.image && (
              <div className="text-center">
                <Upload className="mx-auto h-8 w-8 text-white/60" />
                <span className="mt-2 text-sm text-white/80">Enviar imagem</span>
              </div>
            )}
            {question.image && (
              <Image src={question.image} alt="Question" fill className="object-cover rounded-lg" />
            )}
          </label>
          {question.image && (
            <Button
              onClick={() => onUpdateQuestion(questionIndex, 'image', '')}
              variant="ghost"
              size="icon"
              icon={Trash2}
              className="absolute top-2 right-2 text-white bg-black/50 hover:bg-black/70 rounded-full"
              title="Remover imagem"
            />
          )}
        </div>
      </div>
      <div className="mb-4">
        <textarea
          value={question.explanation || ''}
          onChange={(e) => onUpdateQuestion(questionIndex, 'explanation', e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
          placeholder="Digite uma explicação opcional para a resposta..."
        />
      </div>
    </motion.div>
  );
} 