import React, { useState, useContext } from 'react';
import './Login.css';
import Logo from '../images/s-logo-1.png';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LoginContext } from '../context/LoginContext';

const Login = () => {
  const { setUserLogin } = useContext(LoginContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      email,
      password,
    };

    try {
      const response = await fetch('https://social-gram2.onrender.com/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();
        const { token, user } = data;

        toast.success('Login successful!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: true,
        });

        localStorage.setItem('jwt', token);
        localStorage.setItem('user', JSON.stringify(user));

        setUserLogin(true);
        navigate('/');
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (error) {
      console.error(error);
      toast.error('Invalid email or password. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: true,
      });
    }
  };

  return (
    <>
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-md-12'>
            <div className='login'>
              <img src={Logo} id='logo' alt='Logo' /><br />
              <form onSubmit={handleSubmit}>
                <input type='text' placeholder='Enter Email Address' value={email} onChange={(e) => setEmail(e.target.value)} /><br />
                <input type='password' placeholder='Enter Password' value={password} onChange={(e) => setPassword(e.target.value)} /><br />
                <input type='submit' id='submit' value='Login' />
              </form>
              <hr />
              <p>If you have no account? <Link to='/register'>Register Here</Link> </p>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Login;
