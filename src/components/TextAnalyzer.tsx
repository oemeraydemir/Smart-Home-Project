import { useState, useCallback } from 'react';
import { 
  TextField, 
  Paper, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  CircularProgress,
  Chip
} from '@mui/material';
import { analyzeText } from '../services/nlpService';
import debounce from 'lodash/debounce';

function TextAnalyzer() {
  const [text, setText] = useState('');
  const [errors, setErrors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const debouncedAnalyze = useCallback(
    debounce(async (text: string) => {
      if (text.length > 5) {
        setLoading(true);
        const textErrors = await analyzeText(text);
        setErrors(textErrors);
        setLoading(false);
      } else {
        setErrors([]);
      }
    }, 500),
    []
  );

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newText = event.target.value;
    setText(newText);
    debouncedAnalyze(newText);
  };

  return (
    <Paper className="p-4">
      <Typography variant="h6" gutterBottom>
        Text Analysis
      </Typography>
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
      {errors.length > 0 && (
        <List>
          {errors.map((error, index) => (
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
                          {error.replacements.slice(0, 3).map((replacement, idx) => (
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
      )}
    </Paper>
  );
}

export default TextAnalyzer;