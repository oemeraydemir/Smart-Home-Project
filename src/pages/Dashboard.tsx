import { Typography, Grid, Paper } from '@mui/material';
import TextAnalyzer from '../components/TextAnalyzer';

function Dashboard() {
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper className="p-4">
            <Typography variant="h6">Temperature</Typography>
            <Typography variant="h3">22°C</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper className="p-4">
            <Typography variant="h6">Humidity</Typography>
            <Typography variant="h3">45%</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper className="p-4">
            <Typography variant="h6">Energy Usage</Typography>
            <Typography variant="h3">3.2kW</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <TextAnalyzer />
        </Grid>
      </Grid>
    </div>
  );
}

export default Dashboard