import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import OAuth from '../components/OAuth';

function Signup() {

  const [form, formData] = useState({});
  const [errorMessage, seterrorMessage] = useState(null);
  const [loading, setloading] = useState(false);
  const navigate = useNavigate()

  const handleInput = (e) => {
    formData({ ...form, [e.target.id]: e.target.value.trim() });
  }
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.password) {
      return seterrorMessage('Please fill out all the fields.')
    }

    try {
      setloading(true);
      seterrorMessage(null);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      const data = await response.json();
      if (data.success === false) {
        // setloading(false)
        return seterrorMessage(data.message)
      }
      setloading(false)
      if (response.ok) {
        navigate('/signin')
      }
      console.log(data)
      // if (data === "signup successful" ) {
      //   alert(data)
      // }else{
      //   alert(data.message)
      // }
    } catch (error) {
      seterrorMessage(error.message)
      setloading(false)
    }
  }
  return (
    <div className='min-h-screen mt-20'>
      <div className='flex p-3 max-w-3xl flex-col md:flex-row md:items-center mx-auto gap-5'>
        {/* left */}
        <div className=' flex-1'>
          <Link to={'/'} className='text-4xl font-bold 
             dark:text-white'>
            <span className='px-2 bg-gradient-to-r from-indigo-500
             first-letter: via-purple-500 to-pink-500 rounded-lg text-white'>
              Danial's
            </span>
            Blog
          </Link>

          <p className='text-sm mt-5'>
            This is a demo project. You can signup with your email and password or with google.
          </p>
        </div>
        {/* right */}
        <div className='flex-1'>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div className=''>
              <Label value="Your username" />

              <TextInput
                type='text'
                placeholder='Username'
                id='username'
                onChange={handleInput}

              />
            </div>
            <div className=''>
              <Label value="Your email" />

              <TextInput
                type='email'
                placeholder='name@company.com'
                id='email'
                onChange={handleInput}
              />
            </div>
            <div className=''>
              <Label value="Your password" />

              <TextInput
                type='password'
                placeholder='Password'
                id='password'
                onChange={handleInput}
              />
            </div>

            <Button gradientDuoTone={'purpleToPink'} type='submit' disabled={loading}>
              {
                loading ? (
                  <>
                   <Spinner size={'sm'}/>
                   <span className='pl-3'>loading...</span>
                  </>
                ) : 'Sign Up'
              }
              
            </Button>
            <OAuth />
          </form>

          <div className='flex gap-2 text-sm mt-5'>
            <span>Have an account?</span>
            <Link to={'/signin'} className='text-blue-500'>
              Sign In
            </Link>
          </div>

          {
            errorMessage && (
              <Alert className='mt-5' color={'failure'}>
                {errorMessage}
              </Alert>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default Signup