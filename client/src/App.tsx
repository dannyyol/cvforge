import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage';
import EditorPage from './pages/EditorPage';
import { ThemeProvider } from './theme/ThemeProvider';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/editor" element={<EditorPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
