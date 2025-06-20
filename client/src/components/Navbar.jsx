import { useState, useEffect } from 'react';

const Navbar = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/api/users/profile', {
      method: 'GET',
      credentials: 'include',
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.user) {
          setCurrentUser(data.user);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch user status:', err);
        setCurrentUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/users/logout', {
        method: 'POST',
        credentials: 'include',
      });
      if (res.ok) {
        setCurrentUser(null);
        window.location.href = '/login';
      } else {
        console.error('Logout failed. Status:', res.status);
        alert('Logout failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      alert('An error occurred during logout.');
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 py-3 px-4 sm:px-6 lg:px-8 bg-transparent backdrop-blur-xl text-[color:var(--primary)]">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex-shrink-0">
          <a href="/" className="flex items-center space-x-2">
            <span className="text-2xl">📔</span>
            <span className="font-semibold text-xl text-[color:var(--primary)] hidden sm:inline">
              JournalApp
            </span>
          </a>
        </div>
        <div className="flex items-center space-x-3 sm:space-x-4">
          {loading ? (
            <div className="text-sm text-gray-500">Loading...</div>
          ) : currentUser ? (
            <>
              <span className="text-sm sm:text-md">
                👋 Hi, {currentUser.username || 'User'}!
              </span>
              <button
                onClick={handleLogout}
                className="bg-[color:var(--orange)] hover:bg-[color:var(--peach)] text-white font-semibold py-1.5 px-3 sm:py-2 sm:px-4 rounded-lg text-xs sm:text-sm transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <a
                href="/login"
                className="hover:text-[color:var(--primary)] transition-colors text-sm font-medium"
              >
                Login
              </a>
              <a
                href="/register"
                className="bg-[color:var(--orange)] hover:bg-[color:var(--peach)] text-white font-semibold py-1.5 px-3 sm:py-2 sm:px-4 rounded-lg text-xs sm:text-sm transition"
              >
                Sign Up
              </a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;