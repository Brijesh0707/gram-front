// Home.js
import React, { useEffect, useState } from 'react';
import Logo from '../images/s-logo-1.png';
import './Home.css';
import { useNavigate, Link } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    fetch('https://social-gram2.onrender.com/allposts', {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('jwt'),
      },
    })
      .then((res) => res.json())
      .then((result) => setData(result.reverse()))
      .catch((err) => console.log(err));
  }, []);

  const handleLike = (postIndex) => {
    const updatedData = [...data];
    const post = updatedData[postIndex];

    if (post.likes.includes(JSON.parse(localStorage.getItem('user'))._id)) {
      fetch('https://social-gram2.onrender.com/unlikes', {
        method: 'put',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('jwt'),
        },
        body: JSON.stringify({
          postid: post._id,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          post.likes = result.likes;
          setData(updatedData);
        });
    } else {
      fetch('https://social-gram2.onrender.com/likes', {
        method: 'put',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('jwt'),
        },
        body: JSON.stringify({
          postid: post._id,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          post.likes = result.likes;
          setData(updatedData);
        });
    }
  };

  return (
    <div className='home-container'>
      <div className='row'>
        {data.map((post, index) => (
          <div key={post._id} className='col-md-12'>
            <div className='cards'>
              <div className='profile-1'>
                <div className='profile-2'>
                  <img src={post.photo} className='logo-profile' alt='Profile' />
                </div>
                <div className='profile-name'>
                  <Link to={`/userprofile/${post.postedby._id}`} className='userprofile'>
                    <h6>{post.postedby.username}</h6>
                  </Link>
                </div>
              </div>
              <div className='post-1'>
                <img src={post.photo} className='post-2' alt='Post' />
              </div>
              <div className='like-comment'>
                <button
                  onClick={() => handleLike(index)}
                  style={{
                    backgroundColor: post.likes.includes(JSON.parse(localStorage.getItem('user'))._id) ? 'red' : 'white',
                    color: post.likes.includes(JSON.parse(localStorage.getItem('user'))._id) ? 'white' : 'black',
                    border: '1px solid black',
                  }}
                >
                  {post.likes.includes(JSON.parse(localStorage.getItem('user'))._id) ? 'Liked' : 'Like'}
                </button>
                <p
                  id='likes'
                  style={{
                    color: post.likes.includes(JSON.parse(localStorage.getItem('user'))._id) ? 'black' : 'gray',
                  }}
                >
                  {post.likes.length} likes
                </p>
                <br />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
