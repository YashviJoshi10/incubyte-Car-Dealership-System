import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50 w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2 group shrink-0">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center shadow-sm group-hover:bg-primary-700 transition-colors">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2.55-2.55A1 1 0 016 13h1m6 3h2m0 0h2m-2 0v-5m2 5l2.55-2.55A1 1 0 0120 13h1a1 1 0 011 1v1a1 1 0 01-1 1h-3" />
              </svg>
            </div>
            <span className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
              AutoInventory
            </span>
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-1 shrink-0">
            <Link
              to="/dashboard"
              className="px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
            >
              Dashboard
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className="px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
              >
                Admin Panel
              </Link>
            )}
          </div>

          {/* User menu */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-xs sm:text-sm font-medium text-slate-800">{user?.email}</span>
              <span className={`text-[11px] font-medium ${isAdmin ? 'text-primary-600' : 'text-slate-500'}`}>
                {isAdmin ? '⭐ Admin' : 'User'}
              </span>
            </div>
            <button
              id="logout-btn"
              onClick={handleLogout}
              className="btn-secondary btn-sm px-2.5 py-1.5 text-xs gap-1"
              title="Logout"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
