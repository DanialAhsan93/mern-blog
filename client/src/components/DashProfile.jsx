import { Alert, Button, TextInput } from 'flowbite-react';
import React, { useEffect, useRef, useState } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../Firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { updateStart, updateSuccess, updateFailure } from '../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';


function DashProfile() {
  const { currentUser } = useSelector(state => state.user);
  const [imgFile, setImgFile] = useState(null);
  const [imgFileUrl, setImgFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageSuccessLoading, setimageSuccessLoading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [formData, setFormData] = useState({});
  const filePickerRef = useRef();
  const dispatch = useDispatch();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImgFile(file)
      setImgFileUrl(URL.createObjectURL(file));
    }
  }

  useEffect(() => {
    if (imgFile) {
      uploadImage()
    }
  }, [imgFile]);

  const uploadImage = async () => {
    // service firebase.storage {
    //   match /b/{bucket}/o {
    //     match /{allPaths=**} {
    //       allow read;
    //       allow write: if
    //       request.resource.size < 2 * 1024 * 1024 &&
    //       request.resource.contentType.matches('image/.*')
    //     }
    //   }
    // }
    setimageSuccessLoading(true)
    setImageFileUploadError(null)
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imgFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imgFile);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError('could not upload image (File must be less than 2MB)');
        setImageFileUploadProgress(null);
        setImgFile(null);
        setImgFileUrl(null);
        setimageSuccessLoading(false)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImgFileUrl(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
          setimageSuccessLoading(false);
        })
      }

    )
  };

  const handleFormData = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() })
  };

  console.log(formData);
  console.log(imageFileUploadProgress);

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (Object.keys(formData).length === 0) {
      return;
    };
    if (imageSuccessLoading) {
      return;
    }

    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      console.log(data);

      if (!res.ok) {
        return dispatch(updateFailure(data.message));
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("User's file is successfully uploaded");
      };

    } catch (error) {
      dispatch(updateFailure(error.message));
    }
  }

  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmitForm}>
        <input
          type="file"
          accept='image/*'
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />
        <div className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full'
          onClick={() => filePickerRef.current.click()}
        >
          {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgb(62, 152, 199, ${imageFileUploadProgress / 100})`
                }
              }}
            />
          )}
          <img
            src={imgFileUrl || currentUser.profilePicture}
            alt={currentUser.username}
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] 
              ${imageFileUploadProgress && imageFileUploadProgress < 100 && 'opacity-60'}`}
          />
        </div>

        {imageFileUploadError && (
          <Alert color={'failure'}>
            {imageFileUploadError}
          </Alert>
        )}

        <TextInput
          type='text'
          id='username'
          placeholder='username'
          defaultValue={currentUser.username}
          onChange={handleFormData}
        />
        <TextInput
          type='email'
          id='email'
          placeholder='email'
          defaultValue={currentUser.email}
          onChange={handleFormData}
        />
        <TextInput
          type='password'
          id='password'
          placeholder='password'
          onChange={handleFormData}
        />

        <Button type='submit' gradientDuoTone={'purpleToBlue'} outline>
          Update
        </Button>
      </form>

      <div className='text-red-500 flex justify-between mt-5'>
        <span className='cursor-pointer'>Delete Account</span>
        <span className='cursor-pointer'>Sign Out</span>
      </div>

      {updateUserSuccess && (
        <Alert color={'success'} className='mt-5'>
          {updateUserSuccess} 
        </Alert>
      )}
    </div>
  )
}

export default DashProfile;