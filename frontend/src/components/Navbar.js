import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <Link className="navbar-brand" to="/">My Full Stack Project</Link>
      <div className="collapse navbar-collapse justify-content-between">
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link className="nav-link" to="/">Home</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/students">Students</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/add-student">Add Student</Link>
          </li>
        </ul>
        <button onClick={handleLogout} className="btn btn-outline-light">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
