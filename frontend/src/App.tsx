import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import GamePage from './pages/GamePage';
import StatsPage from './pages/StatsPage';

function App() {
  return (
    <Router>
      <div className="h-full bg-gray-50 flex flex-col">
        <Navigation />
        <main className="container mx-auto px-4 py-8 max-w-md flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<GamePage />} />
            <Route path="/stats" element={<StatsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
