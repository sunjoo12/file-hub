import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import theme from './theme';
import HomePage from './pages/HomePage';
import GuestbookPage from './pages/GuestbookPage';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter basename='/file-hub'>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/guestbook' element={<GuestbookPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
