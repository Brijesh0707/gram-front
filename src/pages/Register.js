import React, { useState } from 'react';
import Logo from '../images/s-logo-1.png';
import { Link } from 'react-router-dom';
import './Register.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!emailRegex.test(email)) {
      toast.error('Invalid email address!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: true,
      });
      return;
    }

    if (!passwordRegex.test(password)) {
      toast.error('Password must be at least 6 characters long and contain letters and numbers!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: true,
      });
      return;
    }

    const userData = {
      name,
      username,
      email,
      password,
    };

    fetch('https://social-gram2.onrender.com/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
      .then((response) => {
        if (response.ok) {
          toast.success('Data submitted successfully!', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: true,
          });

      
          navigate('/login');
        } else {
          throw new Error('Error submitting data.');
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error('Error submitting data. Please try again later.', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: true,
        });
      });
  };

  return (
    <>
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-md-12'>
            <div className='register'>
              <img src={Logo} id='logo' alt='Logo' /><br />
              <form onSubmit={handleSubmit}>
                <input type='text' placeholder='Enter Name' value={name} onChange={(e) => setName(e.target.value)} /><br />
                <input type='text' placeholder='Enter Username' value={username} onChange={(e) => setUsername(e.target.value)} /><br />
                <input type='text' placeholder='Enter Email Address' value={email} onChange={(e) => setEmail(e.target.value)} /><br />
                <input type='password' placeholder='Enter Password' value={password} onChange={(e) => setPassword(e.target.value)} /><br />

                <input type='submit' id='submit' value='Register' />
              </form>
              <hr />
              <p>If you have an account? <Link to='/login'>Login Here</Link></p>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Register;
