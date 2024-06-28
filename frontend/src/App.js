import React, { useState, useMemo } from 'react';
import axios from 'axios';
import { 
  Container, 
  Typography, 
  Button, 
  TextField, 
  Paper, 
  Box,
  CircularProgress,
  Snackbar,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  CssBaseline
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CloudUpload, ContentPaste, Brightness4, Brightness7 } from '@mui/icons-material';
import { useSpring, animated } from 'react-spring';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

function App() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
          primary: {
            main: darkMode ? '#90caf9' : '#1976d2',
          },
          secondary: {
            main: darkMode ? '#f48fb1' : '#dc004e',
          },
        },
      }),
    [darkMode]
  );

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    } else if (text) {
      formData.append('text', text);
    } else {
      setError('Please upload a file or paste text to analyze.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResults(response.data);
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred while analyzing the Terms of Service. Please try again.');
    }

    setLoading(false);
  };

  const fadeIn = useSpring({
    opacity: results ? 1 : 0,
    transform: results ? 'translateY(0)' : 'translateY(50px)',
  });

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md">
        <Box my={4} textAlign="center">
          <Typography variant="h3" component="h1" gutterBottom>
            Terms of Service Analyzer
          </Typography>
          <IconButton onClick={toggleDarkMode} color="inherit" sx={{ position: 'absolute', top: 16, right: 16 }}>
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
          <Paper elevation={3}>
            <Box p={3}>
              <form onSubmit={handleSubmit}>
                <Box mb={2}>
                  <input
                    accept=".pdf,.txt"
                    style={{ display: 'none' }}
                    id="raised-button-file"
                    type="file"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="raised-button-file">
                    <Button
                      variant="contained"
                      component="span"
                      startIcon={<CloudUpload />}
                      fullWidth
                    >
                      Upload PDF or TXT
                    </Button>
                  </label>
                  {file && <Typography variant="body2">{file.name}</Typography>}
                </Box>
                <Box mb={2}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    placeholder="Or paste ToS text here"
                    value={text}
                    onChange={handleTextChange}
                  />
                </Box>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <ContentPaste />}
                  fullWidth
                >
                  {loading ? 'Analyzing...' : 'Analyze'}
                </Button>
              </form>
            </Box>
          </Paper>
        </Box>
        
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError('')}
          message={error}
        />

        {loading && (
          <Box my={4}>
            <Skeleton count={5} height={40} />
          </Box>
        )}

        {results && (
          <animated.div style={fadeIn}>
            <Paper elevation={3}>
              <Box p={3} my={4}>
                <Typography variant="h5" gutterBottom>Analysis Results</Typography>
                <Box mb={2}>
                  <Typography variant="body1">Total Clauses: {results.summary.total_clauses}</Typography>
                  <Typography variant="body1">Unfair Clauses: {results.summary.unfair_count} ({results.summary.unfair_percentage.toFixed(2)}%)</Typography>
                  <Typography variant="body1">Potentially Unfair Clauses: {results.summary.potentially_unfair_count} ({results.summary.potentially_unfair_percentage.toFixed(2)}%)</Typography>
                </Box>
                <Typography variant="body1" fontWeight="bold">
                  Recommendation: 
                  {results.summary.unfair_percentage > 10 ? 
                    " Do not proceed with these Terms of Service." :
                    results.summary.potentially_unfair_percentage > 20 ?
                    " Proceed with caution and seek legal advice." :
                    " These Terms of Service appear to be generally fair."}
                </Typography>
              </Box>
            </Paper>
            <List>
              {results.results.map((result, index) => (
                <React.Fragment key={index}>
                  <ListItem 
                    sx={{
                      backgroundColor: 
                        result.label === 'clearly_unfair' ? (darkMode ? '#5f2120' : '#ffcdd2') :
                        result.label === 'potentially_unfair' ? (darkMode ? '#5c4f10' : '#fff9c4') :
                        (darkMode ? '#1b4332' : '#c8e6c9'),
                      borderRadius: '4px',
                      my: 1,
                    }}
                  >
                    <ListItemText
                      primary={result.clause}
                      secondary={`Classification: ${result.label}`}
                    />
                  </ListItem>
                  {index < results.results.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </animated.div>
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;