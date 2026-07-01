import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { HashRouter, Routes, Route } from 'react-router-dom';
import theme from './theme';
import HomePage from './pages/HomePage';
import GuestbookPage from './pages/GuestbookPage';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <HashRouter>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/guestbook' element={<GuestbookPage />} />
        </Routes>
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;
