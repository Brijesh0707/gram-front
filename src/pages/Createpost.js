import React, { useState } from 'react';
import './Createpost.css';
import Logo from '../images/s-logo-1.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const Createpost = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [body, setBody] = useState('');
  const [image, setImage] = useState(null);
  const [isShareButtonDisabled, setIsShareButtonDisabled] = useState(false);

  const navigate = useNavigate();

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);

    const previewImage = document.getElementById('preview');
    if (previewImage && file) {
      previewImage.src = URL.createObjectURL(file);
    }

    setImage(file);
  };

  const postData = async () => {
    if (!body || !image) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsShareButtonDisabled(true); // Disable the "Share" button during the post data submission

    try {
      const data = new FormData();
      data.append('file', image);
      data.append('upload_preset', 'kklpbnzc');
      data.append('cloud_name', 'brijesh070707');

      const imageUploadResponse = await fetch('https://api.cloudinary.com/v1_1/brijesh070707/image/upload', {
        method: 'post',
        body: data,
      });

      const imageUploadData = await imageUploadResponse.json();
      const imageUrl = imageUploadData.url;

      const createPostResponse = await fetch('https://social-gram2.onrender.com/createpost', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('jwt'),
        },
        body: JSON.stringify({
          body,
          photo1: imageUrl,
        }),
      });

      const createPostData = await createPostResponse.json();

      if (createPostResponse.ok) {
        toast.success('Post saved successfully! Redirecting...');
        setTimeout(() => {
          navigate('/');
        }, 5000);
      } else {
        console.error('Error creating post:', createPostData.error);
        toast.error('Error creating post');
      }
    } catch (error) {
      console.error('An error occurred:', error);
      toast.error('An error occurred while creating the post');
    }

    setIsShareButtonDisabled(false); // Enable the "Share" button after the post data submission
  };

  const handleShareClick = () => {
    postData();
  };

  return (
    <div className='main-3'>
      <div className='createpost'>
        <h5>Create New Post</h5>
        <button onClick={handleShareClick} disabled={isShareButtonDisabled}>
          Share
        </button>
      </div>
      <div className='images-1'>
        {selectedImage ? (
          <img src={URL.createObjectURL(selectedImage)} id='preview' alt='Preview' />
        ) : (
          <h1>No Image Selected</h1>
        )}
        <div className='choose'>
          <input type='file' onChange={handleImageChange} />
        </div>
      </div>
      <div className='caption'>
        <div className='caption-2'>
          <img src={Logo} id='profile-2' alt='Profile' />
          <h6>SocialGram</h6>
        </div>
      </div>
      <div className='caption-3'>
        <input
          type='text'
          value={body}
          onChange={(e) => {
            setBody(e.target.value);
          }}
          placeholder='Write Caption Here......'
        />
      </div>
      <ToastContainer />
    </div>
  );
};

export default Createpost;
