import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react'
import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { app } from '../Firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import "react-circular-progressbar/dist/styles.css";
import { useNavigate, useParams } from 'react-router-dom';
import {useSelector} from "react-redux";

function Updatepost() {
  const [formData, setformData] = useState({});
  const [file, setfile] = useState(null);
  const [imageUploadProgress, setimageUploadProgress] = useState(null);
  const [imageUploadError, setimageUploadError] = useState(null);
  const [publishError, setpublishError] = useState(null);
  const { postId } = useParams();

  const navigate = useNavigate();
  const {currentUser} = useSelector((state) => state.user)

  useEffect(() => {
    try {
      const fetchPost = async () => {
        const res = await fetch(`/api/post/getposts?postId=${postId}`);
        const data = await res.json();
        if (!res.ok) {
          console.log(data.message);
          setpublishError(data.message);
          return;
        }
        if (res.ok) {
          setpublishError(null);
          setformData(data.posts[0]);
        }
      };

      fetchPost();

    } catch (error) {
      console.log(error.message);
    };

  }, [postId]);

  const handleUploadImage = async () => {
    try {
      if (!file) {
        setimageUploadError('Please select an image')
        return;
      };

      setimageUploadError(null);
      setimageUploadProgress(0);

      const storage = getStorage(app);
      const fileName = new Date().getTime() + '-' + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setimageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setimageUploadError(error, 'Image upload failed');
          setimageUploadProgress(null);

        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setimageUploadProgress(null);
            setimageUploadError(null);
            setformData({ ...formData, image: downloadURL })
          })
        }
      )

    } catch (error) {
      setimageUploadError('Image upload failed');
      setimageUploadProgress(null);
      console.log(error)
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/post/updatepost/${formData._id}/${currentUser._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        setpublishError(data.message);
        return
      };

      if (res.ok) {
        setpublishError(null);
        navigate(`/post/${data.slug}`);
      };

    } catch (error) {
      setpublishError('Something went wrong');
    }
  };


  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-semibold'>Update a Post</h1>

      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
          <TextInput
            type='text'
            placeholder='Title'
            required
            id='title'
            className='flex-1'
            onChange={(e) => setformData({ ...formData, title: e.target.value })}
            value={formData.title}
          />
          <Select onChange={(e) => setformData({ ...formData, category: e.target.value })} value={formData.category}>
            <option value={'uncategorized'} >Select a category</option>
            <option value={'javascript'} >JavaScript</option>
            <option value={'react js'} >React.js</option>
            <option value={'next js'} >Next.js</option>
          </Select>
        </div>

        <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
          <FileInput
            type='file'
            accept='image/*'
            onChange={(e) => setfile(e.target.files[0])}
          />
          <Button type='button' gradientDuoTone={'purpleToBlue'} size={'sm'} outline onClick={handleUploadImage} disabled={imageUploadProgress}>
            {
              imageUploadProgress ?
                (
                  <div className='w-16 h-16'>
                    <CircularProgressbar value={imageUploadProgress || 0} text={`${imageUploadProgress}%`} />
                  </div>
                )
                :
                (
                  'Upload Image'
                )
            }
          </Button>
        </div>
        {imageUploadError && (
          <Alert color={'failure'}>
            {imageUploadError}
          </Alert>
        )}

        {formData.image && (
          <img src={formData.image} className='w-full h-72 object-contain' />
        )}

        <ReactQuill theme='snow' placeholder='Write Something...' className='h-72 mb-12' required
          onChange={(value) => setformData({ ...formData, content: value })}
          value={formData.content}
        />

        {/* <Button type='submit' gradientDuoTone={'purpleToPink'}>
          Publish
        </Button> */}
        <Button type="submit" gradientDuoTone="purpleToPink" disabled={imageUploadProgress !== null}>
          Update post
        </Button>


        {publishError && (
          <Alert color={'failure'}>
            {publishError}
          </Alert>
        )}
      </form>
    </div>
  )
}

export default Updatepost;