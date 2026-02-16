import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from '@/components/templates/layout/AppLayout';
import { ReportPage } from '@/pages/ReportPage';
import '@/themes/tokens.css';

function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<ReportPage />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
