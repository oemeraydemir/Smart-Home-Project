import axios from 'axios';

interface LanguageToolError {
  message: string;
  offset: number;
  length: number;
  rule: {
    id: string;
    description: string;
    category: string;
  };
}

export const analyzeText = async (text: string): Promise<LanguageToolError[]> => {
  try {
    const response = await axios.post('https://api.languagetool.org/v2/check', {
      text,
      language: 'en-US',
    });

    return response.data.matches;
  } catch (error) {
    console.error('Error analyzing text:', error);
    return [];
  }
};