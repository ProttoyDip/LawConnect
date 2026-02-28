import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-indigo-600">
              LawConnect
            </Link>
          </div>
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-indigo-600 transition-colors">
              Home
            </Link>
            <Link to="/login" className="text-gray-700 hover:text-indigo-600 transition-colors">
              Login
            </Link>
            <Link to="/register" className="text-gray-700 hover:text-indigo-600 transition-colors">
              Register
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
