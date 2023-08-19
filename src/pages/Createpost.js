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

  const postData = () => {
  
    if (!body || !image) {
      toast.error('Please fill in all fields');
      return;
    }


    const data = new FormData();
    data.append('file', image);
    data.append('upload_preset', 'kklpbnzc');
    data.append('cloud_name', 'brijesh070707');

    fetch('https://api.cloudinary.com/v1_1/brijesh070707/image/upload', {
      method: 'post',
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        const imageUrl = data.url;

       
        fetch('https://social-gram2.onrender.com/createpost', {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('jwt'),
          },
          body: JSON.stringify({
            body,
            photo1: imageUrl,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.error) {
              toast.error('Error creating post');
            } else {
              toast.success('Post saved successfully! Redirecting...');
              setTimeout(() => {
                navigate('/');
              }, 5000); 
            }
          })
          .catch((err) => {
            console.error(err);
            toast.error('An error occurred while creating the post');
          });
      })
      .catch((err) => {
        console.error(err);
        toast.error('An error occurred while uploading the image');
      });
  };

  const handleShareClick = () => {

    postData();
  };

  return (
    <div className='main-3'>
      <div className='createpost'>
        <h5>Create New Post</h5>
        <button onClick={handleShareClick}>Share</button>
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
