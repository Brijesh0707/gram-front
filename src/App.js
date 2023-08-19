import React, { createContext, useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import Profile from './pages/Profile';
import Createpost from './pages/Createpost';
import { LoginContext } from './context/LoginContext';
import UserProfile from './pages/UserProfile';

const App = () => {
  const [userLogin, setUserLogin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      setUserLogin(true);
    } else {
      setUserLogin(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    setUserLogin(false);
    navigate('/login');
  };

  return (
    <>
      <LoginContext.Provider value={{ setUserLogin }}>
        <Navbar login={userLogin} onLogout={handleLogout} />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/createpost' element={<Createpost />} />
          <Route path='/userprofile/:usersid' element={<UserProfile />} />

        </Routes>
      </LoginContext.Provider>
    </>
  );
};

export default App;
