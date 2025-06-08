import { Link, useLocation } from 'react-router-dom';

function Navigation() {
  const location = useLocation();

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 max-w-md">
        <div className="flex justify-between items-center h-16">
          <h1 className="text-xl font-bold text-gray-800">Wordfake</h1>
          <div className="flex space-x-4">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === '/'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Game
            </Link>
            <Link
              to="/stats"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === '/stats'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Stats
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
