import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { FaRegEye } from "react-icons/fa";
import { GoEyeClosed } from "react-icons/go";
import { useDispatch, useSelector} from "react-redux"
import { signInStart, signInSuccess, signInFaliure } from '../redux/user/userSlice';

export default function Signin() {

  const [formData, setformData] = useState({})
  const { loading, error}= useSelector(state => state.user);
  const [visible, setvisible] = useState(false)
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setformData({ ...formData, [e.target.id]: e.target.value.trim() })
  }
  const handleVisible = () => {
    setvisible(!visible)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFaliure('Please fill all the fields'));
    }
    try {
      dispatch(signInStart())
      const res = await fetch('api/auth/Signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json()
      if (data.success === false) {
        dispatch(signInFaliure(data.message))
      }
      // setLoading(false);
      if (res.ok) {
        dispatch(signInSuccess(data))
        navigate('/')
      }

    } catch (error) {
      dispatch(signInFaliure(error.message))
    }
  }
  return (
    <div className='min-h-screen mt-20'>
      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>
        {/* div for left side */}
        <div className='flex-1'>
          <Link to="/" className='font-bold dark:text-white text-4xl'>
            <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
           text-white rounded-lg'>
              Danial's
            </span>
            Blog
          </Link>
          <p className='text-sm mt-5'>
            This is a demo project. You can signin with your email and password or with Google.
          </p>
        </div>

        {/* div for the right side */}

        <div className='flex-1'>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div>
              <Label value='Your email' />
              <TextInput type='email' placeholder='name@company.com' id='email' onChange={handleChange} />
            </div>
            <div>
              <Label value='Your password' />
              <div className='relative'>
                <TextInput
                  type={visible ? "text" : "password"}
                  placeholder='*******'
                  id='password'
                  onChange={handleChange}
                />
                <span className='absolute top-[14px] right-2 ' onClick={handleVisible}>{visible ? <GoEyeClosed /> : <FaRegEye />}</span>
              </div>
            </div>
            <Button gradientDuoTone={"purpleToPink"} type='submit' disabled={loading}>
              {
                loading ?
                  (
                    <>
                      <Spinner size={"sm"} />
                      <span className='pl-3'>Loading...</span>
                    </>
                  ) :
                  'Sign In'
              }
            </Button>
          </form>
          <div className='flex gap-2 mt-5'>
            <span>Don't have an account?</span>
            <Link to={"/Sign-up"} className='text-blue-500'>
              Sign Up
            </Link>
          </div>
          {
            error && (
              <Alert className='mt-5' color={"failure"}>
                {error}
              </Alert>
            )
          }
        </div>

      </div>
    </div>
  )
}
