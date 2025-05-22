import axios from 'axios';

const API_URL = 'http://localhost:3000/api/nlp';

export const analyzeText = async (text: string) => {
  try {
    const response = await axios.post(`${API_URL}/analyze/text`, { text });
    return response.data;
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