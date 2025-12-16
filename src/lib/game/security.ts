import { Game, Question, SanitizedGame } from '@/types/game';

/**
 * Removes sensitive data (correct answers) from a question object
 * to prevent cheating via network inspection.
 */
export function sanitizeQuestion(question: Question): Omit<Question, 'correctAnswers'> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { correctAnswers, ...sanitized } = question;
  return sanitized;
}

/**
 * Removes sensitive data from a game object.
 * Strips correct answers from all questions.
 */
export function sanitizeGame(game: Game): SanitizedGame {
  return {
    ...game,
    questions: game.questions.map(q => sanitizeQuestion(q))
  };
}
