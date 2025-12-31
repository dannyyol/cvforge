import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DashboardLayout } from './components/Layout/DashboardLayout';
import { EditorPage } from './pages/EditorPage';
import { TemplatesPage } from './pages/TemplatesPage';
import Homepage from './pages/Homepage';
import PreviewPage from './pages/PreviewPage';

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/preview" element={<PreviewPage />} />
          <Route element={<DashboardLayout />}>
            <Route path="/editor" element={<EditorPage />} />
            <Route path="/templates" element={<TemplatesPage />} />
          </Route>
        </Routes>
    </Router>
  );
}

export default App;
