import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-primary-700">
          Audiometry
        </Link>

        <nav className="flex gap-4 items-center">
          <Link to="/" className="text-sm text-muted hover:text-primary-700">
            Home
          </Link>
          <Link
            to="/health"
            className="text-sm text-muted hover:text-primary-700"
          >
            Hearing Health
          </Link>
          <Link
            to="/results"
            className="text-sm text-muted hover:text-primary-700"
          >
            Results
          </Link>
          <Link
            to="/test"
            className="text-md font-medium text-green-600 border-1 border-green-600 px-4 py-2 rounded hover:bg-green-600 hover:text-gray-100"
          >
            Start Test
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
