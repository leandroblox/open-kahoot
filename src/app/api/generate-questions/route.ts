import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { z } from 'zod';

// Define a simple schema that matches the TSV format
const QuizResponseSchema = z.object({
  questions: z.array(
    z.object({
      question: z.string(),
      correct: z.string(),
      wrong1: z.string(),
      wrong2: z.string(),
      wrong3: z.string(),
      explanation: z.string()
    })
  )
});

export async function POST(request: NextRequest) {
  try {
    const { subject, language, accessKey, questionCount = 5 } = await request.json();

    if (!subject || !language) {
      return NextResponse.json(
        { error: 'Assunto e idioma são obrigatórios' },
        { status: 400 }
      );
    }

    // Validate question count
    if (questionCount < 1 || questionCount > 20) {
      return NextResponse.json(
        { error: 'A quantidade de perguntas deve estar entre 1 e 20' },
        { status: 400 }
      );
    }

    // Check if access key is provided
    if (!accessKey) {
      return NextResponse.json(
        { error: 'A chave de acesso é obrigatória' },
        { status: 401 }
      );
    }

    // Validate access key against allowed keys list
    const allowedKeys = process.env.AI_GENERATION_KEYS;
    if (!allowedKeys) {
      return NextResponse.json(
        { error: 'Chaves de geração via IA não configuradas' },
        { status: 500 }
      );
    }

    // Parse the comma-separated list of access keys
    const keyList = allowedKeys.split(',').map(k => k.trim());
    if (!keyList.includes(accessKey)) {
      return NextResponse.json(
        { error: 'Chave de acesso inválida' },
        { status: 403 }
      );
    }

    // Check for API key
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Chave da API da OpenAI não configurada' },
        { status: 500 }
      );
    }

    // Initialize OpenAI client
    const openai = new OpenAI({ apiKey });

    // Generate the prompt based on language
    const prompts = {
      english: `Create ${questionCount} multiple-choice quiz questions about "${subject}".

For each question, provide:
- The question text
- 4 answer options (1 correct, 3 incorrect)
- The correct answer
- An optional explanation

Make the questions engaging, educational, and appropriate for a quiz game.`,
      french: `Créez ${questionCount} questions de quiz à choix multiples sur "${subject}".

Pour chaque question, fournissez :
- Le texte de la question
- 4 options de réponse (1 correcte, 3 incorrectes)
- La réponse correcte
- Une explication optionnelle

Rendez les questions engageantes, éducatives et appropriées pour un jeu de quiz.`
    };

    const prompt = prompts[language as keyof typeof prompts] || prompts.english;

    // Add JSON schema instructions to the prompt
    const jsonInstructions = `

You must respond with a valid JSON object in the following format:
{
  "questions": [
    {
      "question": "question text here",
      "correct": "correct answer",
      "wrong1": "first wrong answer",
      "wrong2": "second wrong answer",
      "wrong3": "third wrong answer",
      "explanation": "explanation of the answer"
    }
  ]
}`;

    // Call OpenAI API with JSON mode
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: language === 'french' 
            ? 'Vous êtes un expert en création de quiz éducatifs. Créez des questions claires, précises et engageantes en français. Répondez toujours avec un JSON valide.'
            : 'You are an expert at creating educational quizzes. Create clear, accurate, and engaging questions. Always respond with valid JSON.'
        },
        {
          role: 'user',
          content: prompt + jsonInstructions
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.8,
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('Nenhuma resposta recebida da OpenAI');
    }

    // Parse and validate the response with Zod
    const jsonResponse = JSON.parse(content);
    const parsed = QuizResponseSchema.parse(jsonResponse);

    return NextResponse.json({
      success: true,
      questions: parsed.questions
    });

  } catch (error) {
    console.error('Erro ao gerar perguntas:', error);
    return NextResponse.json(
      {
        error: 'Não foi possível gerar perguntas',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}

