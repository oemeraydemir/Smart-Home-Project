import { useState, useCallback, useEffect } from 'react';
import { 
  TextField, 
  Paper, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  CircularProgress,
  Chip,
  FormGroup,
  FormControlLabel,
  Switch,
  Divider,
  Box,
} from '@mui/material';
import { analyzeText } from '../services/nlpService';
import debounce from 'lodash/debounce';

interface AnalyzerSettings {
  grammar: boolean;
  sentiment: boolean;
  semantic: boolean;
}

function TextAnalyzer() {
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<AnalyzerSettings>(() => {
    const saved = localStorage.getItem('analyzerSettings');
    return saved ? JSON.parse(saved) : {
      grammar: true,
      sentiment: true,
      semantic: true,
    };
  });

  useEffect(() => {
    localStorage.setItem('analyzerSettings', JSON.stringify(settings));
  }, [settings]);

  const debouncedAnalyze = useCallback(
    debounce(async (text: string) => {
      if (text.length > 5) {
        setLoading(true);
        const result = await analyzeText(text);
        setAnalysis(result);
        setLoading(false);
      } else {
        setAnalysis(null);
      }
    }, 500),
    []
  );

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newText = event.target.value;
    setText(newText);
    debouncedAnalyze(newText);
  };

  const handleSettingChange = (setting: keyof AnalyzerSettings) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const getSentimentColor = (score: number) => {
    if (score > 0) return 'success';
    if (score < 0) return 'error';
    return 'default';
  };

  return (
    <Paper className="p-4">
      <Typography variant="h6" gutterBottom>
        Advanced Text Analysis
      </Typography>
      
      <FormGroup row className="mb-4">
        <FormControlLabel
          control={
            <Switch
              checked={settings.grammar}
              onChange={() => handleSettingChange('grammar')}
            />
          }
          label="Grammar Check"
        />
        <FormControlLabel
          control={
            <Switch
              checked={settings.sentiment}
              onChange={() => handleSettingChange('sentiment')}
            />
          }
          label="Sentiment Analysis"
        />
        <FormControlLabel
          control={
            <Switch
              checked={settings.semantic}
              onChange={() => handleSettingChange('semantic')}
            />
          }
          label="Semantic Analysis"
        />
      </FormGroup>

      <TextField
        fullWidth
        multiline
        rows={4}
        value={text}
        onChange={handleTextChange}
        placeholder="Enter text to analyze (minimum 6 characters)..."
        variant="outlined"
        className="mb-4"
      />

      {loading && <CircularProgress size={24} className="mb-4" />}

      {analysis && (
        <Box>
          {settings.semantic && (
            <>
              <Typography variant="subtitle1" gutterBottom>
                Semantic Analysis
              </Typography>
              <Box className="flex gap-2 mb-4">
                <Chip label={`Words: ${analysis.semanticAnalysis.wordCount}`} />
                <Chip label={`Sentences: ${analysis.semanticAnalysis.sentenceCount}`} />
                <Chip label={`Complexity: ${analysis.semanticAnalysis.complexity}`} />
                <Chip label={`Language: ${analysis.language}`} />
              </Box>
              <Divider className="my-4" />
            </>
          )}

          {settings.sentiment && (
            <>
              <Typography variant="subtitle1" gutterBottom>
                Sentiment Analysis
              </Typography>
              <Box className="mb-4">
                <Chip 
                  label={`Sentiment Score: ${analysis.sentiment.score}`}
                  color={getSentimentColor(analysis.sentiment.score)}
                  className="mr-2"
                />
                {analysis.sentiment.positive.length > 0 && (
                  <Box className="mt-2">
                    <Typography variant="body2" component="span" className="mr-2">
                      Positive words:
                    </Typography>
                    {analysis.sentiment.positive.map((word: string, idx: number) => (
                      <Chip
                        key={idx}
                        label={word}
                        size="small"
                        color="success"
                        variant="outlined"
                        className="mr-1"
                      />
                    ))}
                  </Box>
                )}
                {analysis.sentiment.negative.length > 0 && (
                  <Box className="mt-2">
                    <Typography variant="body2" component="span" className="mr-2">
                      Negative words:
                    </Typography>
                    {analysis.sentiment.negative.map((word: string, idx: number) => (
                      <Chip
                        key={idx}
                        label={word}
                        size="small"
                        color="error"
                        variant="outlined"
                        className="mr-1"
                      />
                    ))}
                  </Box>
                )}
              </Box>
              <Divider className="my-4" />
            </>
          )}

          {settings.grammar && analysis.grammarErrors.length > 0 && (
            <>
              <Typography variant="subtitle1" gutterBottom>
                Grammar & Spelling
              </Typography>
              <List>
                {analysis.grammarErrors.map((error: any, index: number) => (
                  <ListItem key={index} className="flex flex-col items-start">
                    <ListItemText
                      primary={error.message}
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="textSecondary">
                            Category: {error.rule.category}
                          </Typography>
                          {error.replacements && error.replacements.length > 0 && (
                            <div className="mt-2">
                              <Typography component="span" variant="body2" color="textSecondary">
                                Suggestions:
                              </Typography>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {error.replacements.slice(0, 3).map((replacement: any, idx: number) => (
                                  <Chip
                                    key={idx}
                                    label={replacement.value}
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                    className="mr-1"
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </>
          )}
        </Box>
      )}
    </Paper>
  );
}

export default TextAnalyzer;