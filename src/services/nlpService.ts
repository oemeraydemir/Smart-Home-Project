import axios from 'axios';
import Sentiment from 'sentiment';
import { franc } from 'franc-min';

interface LanguageToolError {
  message: string;
  offset: number;
  length: number;
  rule: {
    id: string;
    description: string;
    category: string;
  };
  replacements?: {
    value: string;
  }[];
}

interface AnalysisResult {
  grammarErrors: LanguageToolError[];
  sentiment: {
    score: number;
    comparative: number;
    positive: string[];
    negative: string[];
  };
  language: string;
  semanticAnalysis: {
    wordCount: number;
    sentenceCount: number;
    complexity: 'Simple' | 'Moderate' | 'Complex';
  };
}

const sentiment = new Sentiment();

const detectLanguage = (text: string): string => {
  const lang = franc(text);
  return lang === 'und' ? 'unknown' : lang;
};

const analyzeSemantics = (text: string) => {
  const sentences = text.split(/[.!?]+/).filter(Boolean);
  const words = text.split(/\s+/).filter(Boolean);
  const avgWordsPerSentence = words.length / sentences.length;

  let complexity: 'Simple' | 'Moderate' | 'Complex' = 'Simple';
  if (avgWordsPerSentence > 10) complexity = 'Moderate';
  if (avgWordsPerSentence > 20) complexity = 'Complex';

  return {
    wordCount: words.length,
    sentenceCount: sentences.length,
    complexity,
  };
};

export const analyzeText = async (text: string): Promise<AnalysisResult> => {
  try {
    const [grammarResponse] = await Promise.all([
      axios.post('https://api.languagetool.org/v2/check', {
        text,
        language: 'en-US',
      }),
    ]);

    const sentimentResult = sentiment.analyze(text);
    const languageResult = detectLanguage(text);
    const semanticResult = analyzeSemantics(text);

    return {
      grammarErrors: grammarResponse.data.matches,
      sentiment: {
        score: sentimentResult.score,
        comparative: sentimentResult.comparative,
        positive: sentimentResult.positive,
        negative: sentimentResult.negative,
      },
      language: languageResult,
      semanticAnalysis: semanticResult,
    };
  } catch (error) {
    console.error('Error analyzing text:', error);
    return {
      grammarErrors: [],
      sentiment: {
        score: 0,
        comparative: 0,
        positive: [],
        negative: [],
      },
      language: 'unknown',
      semanticAnalysis: {
        wordCount: 0,
        sentenceCount: 0,
        complexity: 'Simple',
      },
    };
  }
};