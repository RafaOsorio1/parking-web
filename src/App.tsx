import { Route, HashRouter as Router, Routes } from 'react-router-dom';

import { MainLayout } from './layouts/MainLayout';
import { CashManagement } from './pages/CashManagement';
import { Dashboard } from './pages/Dashboard';
import { Settings } from './pages/Settings';
import { CheckIn } from './pages/checkIn';
import { CheckOut } from './pages/checkOut';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path='/' element={<Dashboard />} />
          <Route path='/settings' element={<Settings />} />
          <Route path='/entrada' element={<CheckIn />} />
          <Route path='/salida' element={<CheckOut />} />
          <Route path='/arqueo' element={<CashManagement />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
