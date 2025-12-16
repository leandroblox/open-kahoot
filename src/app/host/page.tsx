'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import Papa from 'papaparse';
import jschardet from 'jschardet';
import * as iconv from 'iconv-lite';
import { getSocket } from '@/lib/socket-client';
import { appConfig } from '@/lib/config';
import { useBeforeUnload } from '@/lib/hooks/useBeforeUnload';
import type { Question, Game, Player, GameSettings, QuestionType } from '@/types/game';

// Host Setup Components
import HostGameLobbyScreen from '@/components/host-setup/HostGameLobbyScreen';
import HostQuizCreationScreen from '@/components/host-setup/HostQuizCreationScreen';
import QuestionTypePicker from '@/components/host-setup/QuestionTypePicker';

export default function HostPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isTypePickerOpen, setIsTypePickerOpen] = useState(false);
  const [pendingQuestionIndex, setPendingQuestionIndex] = useState<number | null>(null);
  const [gameSettings, setGameSettings] = useState<GameSettings>({
    thinkTime: 5,
    answerTime: 20
  });
  const [game, setGame] = useState<Game | null>(null);

  const router = useRouter();
  
  // Enable beforeunload when there are questions to prevent accidental data loss
  const { clearNavigationFlag } = useBeforeUnload({
    enabled: questions.length > 0,
    message: 'Você tem perguntas não salvas no seu quiz. Tem certeza de que deseja sair?'
  });

  useEffect(() => {
    const socket = getSocket();
    
    socket.on('playerJoined', (player: Player) => {
      setGame(prev => prev ? {
        ...prev,
        players: [...prev.players.filter(p => p.id !== player.id), player]
      } : null);
    });

    socket.on('playerLeft', (playerId: string) => {
      setGame(prev => prev ? {
        ...prev,
        players: prev.players.filter(p => p.id !== playerId)
      } : null);
    });

    socket.on('gameUpdated', (updatedGame: Game) => {
      setGame(updatedGame);
    });

    return () => {
      socket.off('playerJoined');
      socket.off('playerLeft');
      socket.off('gameUpdated');
    };
  }, []);

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const parseTsvFile = async (file: File): Promise<Question[]> => {
    // Read file as ArrayBuffer to handle encoding properly
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Detect encoding
    const detected = jschardet.detect(buffer);
    const encoding = detected.encoding || 'utf-8';
    
    // Removed console.log
    
    // Convert to UTF-8 text
    const text = iconv.decode(buffer, encoding);
    
    return new Promise((resolve, reject) => {
      Papa.parse(text, {
        header: true,
        delimiter: '\t',
        skipEmptyLines: true,
        transformHeader: (header: string) => header.trim().toLowerCase(),
        complete: (results) => {
          try {
            const data = results.data as Record<string, string>[];
            
            if (data.length === 0) {
              throw new Error('O arquivo deve conter ao menos uma linha de dados');
            }

            const requiredColumns = ['question', 'correct', 'wrong1', 'wrong2', 'wrong3'];
            const headers = Object.keys(data[0] || {});
            
            // Check if all required columns exist
            const missingColumns = requiredColumns.filter(col => !headers.includes(col));
            if (missingColumns.length > 0) {
              throw new Error(`Colunas obrigatórias ausentes: ${missingColumns.join(', ')}`);
            }

            const parsedQuestions: Question[] = [];

            for (const row of data) {
              const questionText = row.question?.trim();
              const correctAnswer = row.correct?.trim();
              const wrong1 = row.wrong1?.trim();
              const wrong2 = row.wrong2?.trim();
              const wrong3 = row.wrong3?.trim();
              const explanation = row.explanation?.trim();
              const image = row.image?.trim();

              if (!questionText || !correctAnswer || !wrong1 || !wrong2 || !wrong3) {
                continue; // Skip rows with empty required fields
              }

              // Create answer array and shuffle
              const answers = [correctAnswer, wrong1, wrong2, wrong3];
              const shuffledAnswers = shuffleArray(answers);
              const correctIndex = shuffledAnswers.indexOf(correctAnswer);

              parsedQuestions.push({
                id: uuidv4(),
                question: questionText,
                options: shuffledAnswers,
                correctAnswers: [correctIndex],
                timeLimit: 30, // Default time limit
                type: 'multiple',
                explanation: explanation || undefined,
                image: image || undefined
              });
            }

            resolve(parsedQuestions);
          } catch (error) {
            reject(error);
          }
        },
        error: (error: unknown) => {
          const errorMessage = error && typeof error === 'object' && 'message' in error 
            ? String(error.message) 
            : 'Erro de análise desconhecido';
          reject(new Error(`Falha ao processar o arquivo TSV: ${errorMessage}`));
        }
      });
    });
  };

  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const importedQuestions = await parseTsvFile(file);
      setQuestions(importedQuestions);
      
      // Reset file input
      event.target.value = '';
      
      // Show success message (you could add a toast notification here)
      // Removed console.log
    } catch (error) {
      console.error('Erro na importação:', error);
      alert(`Erro ao importar o arquivo: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      event.target.value = '';
    }
  };

  const handleAppendTSV = async (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const importedQuestions = await parseTsvFile(file);
      
      // Insert the imported questions at the specified index
      const newQuestions = [...questions];
      newQuestions.splice(index, 0, ...importedQuestions);
      setQuestions(newQuestions);
      
      // Reset file input
      event.target.value = '';
      
      // Show success message
      // Removed console.log
    } catch (error) {
      console.error('Erro ao anexar arquivo:', error);
      alert(`Erro ao anexar o arquivo: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      event.target.value = '';
    }
  };

  const buildQuestionTemplate = (type: QuestionType): Question => {
    if (type === 'boolean') {
      return {
        id: uuidv4(),
        question: '',
        options: ['Verdadeiro', 'Falso'],
        correctAnswers: [0],
        timeLimit: 30,
        type
      };
    }

    const optionCount = type === 'single' ? 3 : 4;
    return {
      id: uuidv4(),
      question: '',
      options: Array(optionCount).fill(''),
      correctAnswers: [0],
      timeLimit: 30,
      type
    };
  };

  const insertQuestionAtIndex = (type: QuestionType, index: number) => {
    const template = buildQuestionTemplate(type);
    setQuestions(prevQuestions => {
      const newQuestions = [...prevQuestions];
      const safeIndex = Math.min(Math.max(index, 0), newQuestions.length);
      newQuestions.splice(safeIndex, 0, template);
      return newQuestions;
    });
  };

  const addQuestion = (index?: number) => {
    setPendingQuestionIndex(index ?? questions.length);
    setIsTypePickerOpen(true);
  };

  const handleSelectQuestionType = (type: QuestionType) => {
    if (pendingQuestionIndex === null) return;
    insertQuestionAtIndex(type, pendingQuestionIndex);
    setPendingQuestionIndex(null);
    setIsTypePickerOpen(false);
  };

  const handleCloseTypePicker = () => {
    setIsTypePickerOpen(false);
    setPendingQuestionIndex(null);
  };

  const changeQuestionType = (questionIndex: number, type: QuestionType) => {
    setQuestions(prevQuestions =>
      prevQuestions.map((question, index) => {
        if (index !== questionIndex) return question;

        const currentType = question.type || 'multiple';
        if (currentType === type) {
          return { ...question, type };
        }

        if (type === 'boolean') {
          const trueOption = question.options[0] || 'Verdadeiro';
          const falseOption = question.options[1] || 'Falso';

          return {
            ...question,
            type,
            options: [trueOption, falseOption],
            correctAnswers: [Math.min(question.correctAnswers[0] || 0, 1)]
          };
        }

        let newOptions = [...question.options];

        if (currentType === 'boolean') {
          newOptions = [
            question.options[0] && question.options[0] !== 'Verdadeiro' ? question.options[0] : '',
            question.options[1] && question.options[1] !== 'Falso' ? question.options[1] : '',
            '',
            ''
          ];
        }

        while (newOptions.length < 3) {
          newOptions.push('');
        }

        if (type === 'multiple') {
          while (newOptions.length < 4) {
            newOptions.push('');
          }
          newOptions = newOptions.slice(0, 4);
        } else {
          newOptions = newOptions.slice(0, Math.max(3, newOptions.length));
        }

        const firstCorrect = question.correctAnswers[0] || 0;
        const correctedAnswerIndex = Math.min(firstCorrect, newOptions.length - 1);

        return {
          ...question,
          type,
          options: newOptions,
          correctAnswers: [correctedAnswerIndex]
        };
      })
    );
  };

  const updateQuestion = (index: number, field: keyof Question, value: string | number | number[]) => {
    if (field === 'type') {
      changeQuestionType(index, value as QuestionType);
      return;
    }
    const updated = [...questions];

    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updated = [...questions];
    updated[questionIndex].options[optionIndex] = value;
    setQuestions(updated);
  };

  const setOptionCount = (questionIndex: number, count: number) => {
    setQuestions(prevQuestions =>
      prevQuestions.map((question, index) => {
        if (index !== questionIndex) return question;

        const questionType = question.type || 'multiple';
        if (questionType === 'boolean') {
          return { ...question, type: questionType };
        }

        if (count === question.options.length) {
          return question;
        }

        let newOptions: string[];
        if (count > question.options.length) {
          newOptions = [
            ...question.options,
            ...Array(count - question.options.length).fill('')
          ];
        } else {
          newOptions = question.options.slice(0, count);
        }

        const correctedAnswers = question.correctAnswers
          .map(idx => (idx >= newOptions.length ? -1 : idx))
          .filter(idx => idx !== -1);
          
        // Ensure at least one correct answer if empty (default to 0 if exists)
        if (correctedAnswers.length === 0 && newOptions.length > 0) {
          correctedAnswers.push(0);
        }

        return {
          ...question,
          type: questionType,
          options: newOptions,
          correctAnswers: correctedAnswers
        };
      })
    );
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    setQuestions(prevQuestions =>
      prevQuestions.map((question, index) => {
        if (index !== questionIndex) return question;

        const questionType = question.type || 'multiple';
        if (questionType === 'boolean') {
          return { ...question, type: questionType };
        }

        if (question.options.length <= 2) {
          return { ...question, type: questionType };
        }

        const newOptions = question.options.filter((_, i) => i !== optionIndex);
        
        // Update correct answers indices
        let newCorrectAnswers = question.correctAnswers
          .filter(idx => idx !== optionIndex) // Remove if it was the removed option
          .map(idx => (idx > optionIndex ? idx - 1 : idx)); // Shift down if after

        if (newCorrectAnswers.length === 0 && newOptions.length > 0) {
          newCorrectAnswers = [0];
        }

        return {
          ...question,
          type: questionType,
          options: newOptions,
          correctAnswers: newCorrectAnswers
        };
      })
    );
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const moveQuestion = (index: number, direction: 'up' | 'down') => {
    const newQuestions = [...questions];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newQuestions.length) return;
    
    // Swap the questions
    [newQuestions[index], newQuestions[targetIndex]] = [newQuestions[targetIndex], newQuestions[index]];
    setQuestions(newQuestions);
  };

  const createGame = () => {
    if (questions.length === 0) return;
    
    const socket = getSocket();
    const title = 'Jogo de Quiz'; // Título padrão

    // Sanitize questions: remove empty options and update correct answer indices
    const sanitizedQuestions = questions.map(q => {
      const validOptionsWithIndices = q.options
        .map((opt, idx) => ({ text: opt, oldIndex: idx }))
        .filter(item => item.text.trim() !== '');
      
      const newOptions = validOptionsWithIndices.map(item => item.text);
      
      // Remap correct answers
      const newCorrectAnswers = q.correctAnswers
        .map(oldIdx => validOptionsWithIndices.findIndex(item => item.oldIndex === oldIdx))
        .filter(newIdx => newIdx !== -1);

      return {
        ...q,
        options: newOptions,
        correctAnswers: newCorrectAnswers
      };
    });

    socket.emit('createGame', title, sanitizedQuestions, gameSettings, (createdGame: Game) => {
      setGame(createdGame);
      clearNavigationFlag(); // Clear flag since game is created and questions are saved
    });
  };

  const startGame = () => {
    if (!game) return;
    
    const socket = getSocket();
    socket.emit('startGame', game.id);
    clearNavigationFlag(); // Clear flag since this is intentional navigation
    router.push(`/game/${game.id}?host=true`);
  };

  const toggleDyslexiaSupport = (playerId: string) => {
    if (!game) return;
    
    const socket = getSocket();
    socket.emit('toggleDyslexiaSupport', game.id, playerId);
  };

  const getJoinUrl = () => {
    if (!game) return '';

    const baseUrl = appConfig.url || (typeof window !== 'undefined' ? window.location.origin : '');
    if (!baseUrl) {
      return `/join?pin=${game.pin}`;
    }

    const normalizedBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    return `${normalizedBase}/join?pin=${game.pin}`;
  };

  const downloadTSV = () => {
    if (questions.length === 0) {
      alert('Não há perguntas para exportar.');
      return;
    }

    // Create TSV content
    const tsvContent = Papa.unparse({
      fields: ['question', 'correct', 'wrong1', 'wrong2', 'wrong3', 'explanation', 'image'],
      data: questions.map(q => {
        // For TSV export, we take the FIRST correct answer as 'correct'
        // and put others in wrongs? Or strictly follow standard?
        // Standard Kahoot TSV expects 1 correct.
        // We'll use the first correct answer.
        const firstCorrectIndex = q.correctAnswers[0] || 0;
        const wrongOptions = q.options.filter((_, i) => i !== firstCorrectIndex);
        
        return {
          question: q.question,
          correct: q.options[firstCorrectIndex] || '',
          wrong1: wrongOptions[0] || '',
          wrong2: wrongOptions[1] || '',
          wrong3: wrongOptions[2] || '',
          explanation: q.explanation || '',
          image: q.image || ''
        };
      })
    }, {
      delimiter: '\t'
    });

    // Create a blob and download link
    const blob = new Blob([`\ufeff${tsvContent}`], { type: 'text/tab-separated-values;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    const now = new Date();
    const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
    link.download = `quiz-${timestamp}.tsv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleGenerateAIQuestions = async (subject: string, language: 'english' | 'french', accessKey: string, questionCount: number = 5) => {
    try {
      // Call the API endpoint
      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subject, language, accessKey, questionCount }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Não foi possível gerar perguntas');
      }

      if (!data.success || !data.questions) {
        throw new Error('Resposta inválida da API');
      }

      // Convert AI response to Question objects
      const newQuestions: Question[] = data.questions.map((q: {
        question: string;
        correct: string;
        wrong1: string;
        wrong2: string;
        wrong3: string;
        explanation?: string;
      }) => {
        // Create answer array and shuffle
        const answers = [q.correct, q.wrong1, q.wrong2, q.wrong3];
        const shuffledAnswers = shuffleArray(answers);
        const correctIndex = shuffledAnswers.indexOf(q.correct);

        return {
          id: uuidv4(),
          question: q.question,
          options: shuffledAnswers,
          correctAnswers: [correctIndex],
          timeLimit: 30,
          type: 'multiple',
          explanation: q.explanation || undefined
        };
      });

      // Append the new questions to existing ones
      setQuestions([...questions, ...newQuestions]);

      // Show success message
      alert(`${newQuestions.length} perguntas geradas com sucesso!`);

    } catch (error) {
      console.error('Erro ao gerar perguntas:', error);
      alert(`Erro: ${error instanceof Error ? error.message : 'Não foi possível gerar perguntas'}`);
    }
  };

  if (game) {
    return (
      <HostGameLobbyScreen 
        game={game}
        joinUrl={getJoinUrl()}
        onStartGame={startGame}
        onToggleDyslexiaSupport={toggleDyslexiaSupport}
      />
    );
  }

  return (
    <>
      <HostQuizCreationScreen
        questions={questions}
        gameSettings={gameSettings}
        onUpdateSettings={setGameSettings}
        onAddQuestion={addQuestion}
        onAppendTSV={handleAppendTSV}
        onFileImport={handleFileImport}
        onUpdateQuestion={updateQuestion}
        onUpdateOption={updateOption}
        onSetOptionCount={setOptionCount}
        onRemoveOption={removeOption}
        onRemoveQuestion={removeQuestion}
        onMoveQuestion={moveQuestion}
        onChangeQuestionType={changeQuestionType}
        onDownloadTSV={downloadTSV}
        onCreateGame={createGame}
        onGenerateAIQuestions={handleGenerateAIQuestions}
      />

      <QuestionTypePicker
        isOpen={isTypePickerOpen}
        onClose={handleCloseTypePicker}
        onSelect={handleSelectQuestionType}
      />
    </>
  );
}
