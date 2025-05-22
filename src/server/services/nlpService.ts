import axios from 'axios';
import Sentiment from 'sentiment';
import { franc } from 'franc-min';

const sentiment = new Sentiment();

export const detectLanguage = (text: string): string => {
  const lang = franc(text);
  return lang === 'und' ? 'unknown' : lang;
};

export const analyzeSemantics = (text: string) => {
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

export const analyzeText = async (text: string) => {
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
    throw error;
  }
};