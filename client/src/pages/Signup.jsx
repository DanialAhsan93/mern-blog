import { Button, Label, TextInput } from 'flowbite-react'
import React from 'react'
import { Link } from 'react-router-dom'

function Signup() {
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
          <form className='flex flex-col gap-4'>
            <div className=''>
              <Label value="Your username" />

              <TextInput
                type='text'
                placeholder='Username'
                id='username'
              />
            </div>
            <div className=''>
              <Label value="Your email" />

              <TextInput
                type='text'
                placeholder='name@company.com'
                id='email'
              />
            </div>
            <div className=''>
              <Label value="Your password" />

              <TextInput
                type='text'
                placeholder='Password'
                id='password'
              />
            </div>

            <Button gradientDuoTone={'purpleToPink'} type='submit'> 
              Sign Up
            </Button>
          </form>

          <div className='flex gap-2 text-sm mt-5'>
            <span>Have an account?</span>
            <Link to={'/signin'} className='text-blue-500'>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup