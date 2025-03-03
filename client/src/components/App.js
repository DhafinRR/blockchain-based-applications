import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import FarmerRegistry from '../components/FarmerRegistry';
import PucukTehRegistry from '../components/PucukTehRegistry';
import SetorTeh from '../components/SetorTeh';
import ScanQris from '../components/ScanQris';
import HomePage from '../components/HomePage';
import Chop from '../components/ChopRegistry';

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 ml-64"> {/* Added margin-left to account for fixed sidebar */}
          <main className="p-6">
            <Routes>
              <Route path="/home-page" element={<HomePage />} />
              <Route path="/farmer-registry" element={<FarmerRegistry />} />
              <Route path="/pucuk-teh" element={<PucukTehRegistry />} />
              <Route path="/setor-teh" element={<SetorTeh />} />
              <Route path="/chop" element={<Chop />} />
              <Route path="/scan-qris" element={<ScanQris />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;