import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Button,
  Box,
} from '@mui/material';
import SearchPage from './pages/SearchPage';
import SavedCompaniesPage from './pages/SavedCompaniesPage';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Company Prospector
              </Typography>
              <Button color="inherit" component={Link} to="/">
                Search
              </Button>
              <Button color="inherit" component={Link} to="/saved">
                Saved Companies
              </Button>
            </Toolbar>
          </AppBar>

          <Container>
            <Routes>
              <Route path="/" element={<SearchPage />} />
              <Route path="/saved" element={<SavedCompaniesPage />} />
            </Routes>
          </Container>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
