import React, { useState, useEffect } from 'react';
import './Profile.css';
import Logo from '../images/s-logo-1.png';

const Profile = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  const fetchPosts = async () => {
    try {
      const response = await fetch('https://social-gram2.onrender.com/myposts', {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt")
        }
      });
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const openModal = (post) => {
    setSelectedPost(post);
  };

  const closeModal = () => {
    setSelectedPost(null);
  };

  const handleDelete = () => {
    if (selectedPost) {
      fetch(`https://social-gram2.onrender.com/deleteposts/${selectedPost._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt")
        }
      })
      .then(response => response.json())
      .then(data => {
        closeModal();
        fetchPosts();
      })
      .catch(error => console.error('Error deleting post:', error));
    }
  };

  return (
    <>
      <div className='main-2'>
        <div className='wrap-2'>
          <div className='profile-logo-1'>
            <img src={Logo} alt='Logo' />
            <h6>{JSON.parse(localStorage.getItem("user")).username}</h6>
          </div>
          <div className='followers'>
            <h6>Post {posts.length}</h6>
            <h6>Followers 2</h6>
            <h6>Following 3</h6>
          </div>
        </div>
        {posts.length > 0 ? (
          <div className='post-menu'>
            {posts.map((post, index) => (
              <div key={index} className="post-container">
                <img
                  src={post.photo}
                  alt={`Post ${index + 1}`}
                  onClick={() => openModal(post)}
                />
              </div>
            ))}
          </div>
        ) : (
          <p>No posts found.</p>
        )}
      </div>

      {selectedPost && (
        <div className="modal">
          <div className="modal-content">
            <img src={selectedPost.photo} alt="Selected Post" />
            <button onClick={handleDelete}>Delete</button>
            <button onClick={closeModal}>Cancel</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
