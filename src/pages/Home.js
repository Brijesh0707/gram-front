import React, { useEffect, useState } from 'react';
import Logo from '../images/s-logo-1.png';
import Loading from '../images/loading.gif';
import './Home.css';
import { useNavigate, Link } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); // New state for disabling the button

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
      .then((result) => {
        setData(result.reverse());
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }, []);

  const handleLike = async (postIndex) => {
    if (isButtonDisabled) {
      return; // Do nothing if the button is disabled
    }

    setIsButtonDisabled(true); // Disable the button during the fetch

    const updatedData = [...data];
    const post = updatedData[postIndex];

    try {
      const response = await fetch(
        `https://social-gram2.onrender.com/${post.likes.includes(
          JSON.parse(localStorage.getItem('user'))._id
        ) ? 'unlikes' : 'likes'}`,
        {
          method: 'put',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('jwt'),
          },
          body: JSON.stringify({
            postid: post._id,
          }),
        }
      );

      const result = await response.json();
      post.likes = result.likes;
      setData(updatedData);
    } catch (error) {
      console.error(error);
    }

    setIsButtonDisabled(false); // Enable the button after the fetch
  };

  return (
    <div className='home-container'>
      {isLoading ? (
        <div className='loading-container'>
          <img src={Loading} alt='Loading' className='loading-indicator' />
        </div>
      ) : (
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
                    disabled={isButtonDisabled} // Disable the button if it's already clicked
                    style={{
                      backgroundColor: post.likes.includes(
                        JSON.parse(localStorage.getItem('user'))._id
                      )
                        ? 'red'
                        : 'white',
                      color: post.likes.includes(
                        JSON.parse(localStorage.getItem('user'))._id
                      )
                        ? 'white'
                        : 'black',
                      border: '1px solid black',
                    }}
                  >
                    {post.likes.includes(
                      JSON.parse(localStorage.getItem('user'))._id
                    )
                      ? 'Liked'
                      : 'Like'}
                  </button>
                  <p
                    id='likes'
                    style={{
                      color: post.likes.includes(
                        JSON.parse(localStorage.getItem('user'))._id
                      )
                        ? 'black'
                        : 'gray',
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
      )}
    </div>
  );
};

export default Home;
