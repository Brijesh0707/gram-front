import React, { useEffect } from 'react';
import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../images/s-logo-1.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';

const Navbar = ({ login }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    navigate('/login');
    window.location.reload(); 
  };

  useEffect(() => {
    if (!login && !loginstatus()) {
      navigate('/login', { replace: true });
    }
  }, [login]);

  const loginstatus = () => {
    const token = localStorage.getItem('jwt');
    return token;
  };

  const renderLinks = () => {
    if (login || loginstatus()) {
      return (
        <>
          <li className='nav-item'>
            <Link to='/' className='nav-link'>
              Home
            </Link>
          </li>
          <li className='nav-item'>
            <Link to='/createpost' className='nav-link'>
              Create Post
            </Link>
          </li>
          <li className='nav-item'>
            <Link to='/profile' className='nav-link'>
              Profile
            </Link>
          </li>
          <li className='nav-item'>
            <a className='nav-link' href='#' onClick={handleLogout}>
              Logout
            </a>
          </li>
        </>
      );
    } else {
      return (
        <li className='nav-item'>
          <Link to='/login' className='nav-link'>
            Login
          </Link>
        </li>
      );
    }
  };

  return (
    <nav className='navbar navbar-expand-lg navbar-light bg-light'>
      <Link to='/' className='navbar-brand'>
        <img src={Logo} alt='Logo' className='logo' />
      </Link>
      <button
        className='navbar-toggler'
        type='button'
        data-bs-toggle='collapse'
        data-bs-target='#navbarSupportedContent'
        aria-controls='navbarSupportedContent'
        aria-expanded='false'
        aria-label='Toggle navigation'
      >
        <span className='navbar-toggler-icon'></span>
      </button>
      <div className='collapse navbar-collapse' id='navbarSupportedContent'>
        <ul className='navbar-nav ms-auto'>{renderLinks()}</ul>
      </div>
    </nav>
  );
};

export default Navbar;
