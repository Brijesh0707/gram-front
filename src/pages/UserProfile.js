import React, { useState, useEffect } from 'react';
import './Profile.css';
import Logo from '../images/s-logo-1.png';
import { useParams } from 'react-router-dom';

const UserProfile = () => {
  const { usersid } = useParams();
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowButtonDisabled, setIsFollowButtonDisabled] = useState(false);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`https://social-gram2.onrender.com/user/${usersid}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      });
      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        setPosts(data.posts);
        setFollowersCount(data.user.followers.length);
        setFollowingCount(data.user.followings.length);
      } else {
        console.error('Error fetching user data:', data.error);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleFollow = async () => {
    if (isFollowButtonDisabled) {
      return; // Do nothing if the button is disabled
    }

    setIsFollowButtonDisabled(true); // Disable the button during the fetch

    try {
      const response = await fetch("https://social-gram2.onrender.com/follows", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          followid: usersid,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        fetchUserData();
      } else {
        console.error('Error following user:', data.error);
      }
    } catch (error) {
      console.error('Error following user:', error);
    }

    setIsFollowButtonDisabled(false); // Enable the button after the fetch
  };

  const handleUnfollow = async () => {
    if (isFollowButtonDisabled) {
      return; // Do nothing if the button is disabled
    }

    setIsFollowButtonDisabled(true); // Disable the button during the fetch

    try {
      const response = await fetch("https://social-gram2.onrender.com/unfollows", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          followid: usersid,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        fetchUserData();
      } else {
        console.error('Error unfollowing user:', data.error);
      }
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }

    setIsFollowButtonDisabled(false); // Enable the button after the fetch
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const loggedInUserId = JSON.parse(localStorage.getItem("user"))._id;
  const isUserFollowing = user && user.followers.includes(loggedInUserId);

  return (
    <div className='main-2'>
      <div className='wrap-2'>
        <div className='profile-logo-1'>
          <img src={Logo} alt='Logo' />
          <h6>{user && user.username}</h6>
        </div>
        <div className='followers'>
          <h6>Posts {posts.length}</h6>
          <h6>Followers {followersCount}</h6>
          <h6>Following {followingCount}</h6><br />
        </div>
        <br />
      </div><br />
      <div className='follows'>
        {isUserFollowing ? (
          <button
            id='unfollow-1'
            onClick={handleUnfollow}
            disabled={isFollowButtonDisabled}
          >
            Unfollow
          </button>
        ) : (
          <button
            id='follow-1'
            onClick={handleFollow}
            disabled={isFollowButtonDisabled}
          >
            Follow
          </button>
        )}
      </div>
      <div className='post-menu'>
        {posts.map((post, index) => (
          <div key={index} className="post-container">
            <img src={post.photo} alt={`Post ${index + 1}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserProfile;
