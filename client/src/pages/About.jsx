import React from 'react';
import { useSelector } from 'react-redux'

export default function About() {
  const user1  = useSelector(state => state.user.currentUser);


  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='max-w-2xl mx-auto p-3 text-center'>
        <div >
          <h1 className='text-3xl font-semibold text-center my-7'>
            About Danial's Blog
          </h1>

          <div className='text-md text-gray-500 flex flex-col gap-6'>
            <p>
              Danial's Blog is a blog that I created to share my thoughts and ideas with the world. I am a Software engineer and I love to write about my experiences and things that I have learned.
              I hope you enjoy reading my Blog.
            </p>
            <p>
              On this blog, you will find weekly articles and tutorials such as web development, software engineering and programming languages, Danial is always learning and exploring new technologies, so be sure to check back often for new content.
            </p>
            <p>
              We encourage you to leave comments on our posts and engage with other readers. You can like other people comments and reply to them as well. We can believe community of learners can help each other and improve 
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}
