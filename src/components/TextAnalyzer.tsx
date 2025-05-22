import { useState } from 'react';
import { TextField, Paper, Typography, List, ListItem, ListItemText, CircularProgress } from '@mui/material';
import { analyzeText } from '../services/nlpService';

function TextAnalyzer() {
  const [text, setText] = useState('');
  const [errors, setErrors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleTextChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newText = event.target.value;
    setText(newText);

    if (newText.length > 5) {
      setLoading(true);
      const textErrors = await analyzeText(newText);
      setErrors(textErrors);
      setLoading(false);
    } else {
      setErrors([]);
    }
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
        placeholder="Enter text to analyze..."
        variant="outlined"
        className="mb-4"
      />
      {loading && <CircularProgress size={24} className="mb-4" />}
      {errors.length > 0 && (
        <List>
          {errors.map((error, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={error.message}
                secondary={`Category: ${error.rule.category}`}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
}

export default TextAnalyzer;