import React, { useEffect, useState } from 'react';
import { Button } from 'flowbite-react';
import { Link } from 'react-router-dom';
import CallToAction from '../components/CallToAction'
import PostCard from '../components/PostCard';

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/post/getposts`);
        const data = await res.json();
        console.log(data);
        if (res.ok) {
          setPosts(data.posts);
        }
      } catch (error) {
        console.log(error);
      }


    };
    ;
    fetchPosts();


  }, [])

  return (
    <div className=''>

      <div className='flex flex-col gap-6 lg:p-28 p-3 max-w-6xl mx-auto'>
        <h1 className='text-3xl font-bold lg:text-6xl'>Welcome to my blog</h1>
        <p className='text-gray-500 text-xs sm:text-sm'>
          Here you will find a variety of articles and tutorial on topics such as web development,
          software engineering, and programming languages.
        </p>
        <Link to='/search' className='text-xs sm:text-sm text-teal-500 font-bold hover:underline'>
          View all Posts
        </Link>
      </div>

      <div className='p-3 bg-amber-100 dark:bg-slate-700'>
        <CallToAction />
      </div>
      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7'>
        {
          posts && posts.length && (
            <div className='flex flex-col gap-6'>
              <h2 className='text-2xl font-semibold text-center'>Recent Posts</h2>
              <div className='flex flex-wrap gap-4'>
                {posts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
              <Link to={'/search'} className='text-lg text-teal-500 hover:underline text-center'>
                  View all Posts
                
                </Link>
            </div>
          )
        }
      </div>


    </div>

  )
}
