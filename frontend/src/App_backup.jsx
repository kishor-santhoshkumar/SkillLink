/**
 * Main App Component
 * Root component with routing and layout
 */
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import HomePage from './pages/HomePage';
import ParagraphPage from './pages/ParagraphPage';
import FormPage from './pages/FormPage';
import EasyForm from './pages/EasyForm';
import Profile from './pages/Profile';
import Jobs from './pages/Jobs';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="paragraph" element={<ParagraphPage />} />
          <Route path="form" element={<EasyForm />} />
          <Route path="profile" element={<Profile />} />
          <Route path="jobs" element={<Jobs />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
