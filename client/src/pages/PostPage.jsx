import { Button, Spinner } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import CallToAction from '../components/CallToAction';
import CommentSection from '../components/CommentSection';
import PostCard from '../components/PostCard';

function PostPage() {

  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [post, setPost] = useState(null);
  const [recentPost, setrecentPost] = useState(null);

  useEffect(() => {
    console.log(postSlug);
    fetchPost();
  }, [postSlug]);

  const fetchPost = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/post/getposts?slug=${postSlug}`);
      const data = await res.json();

      if (!res.ok) {
        setError(true);
        setLoading(false);
        return
      };

      if (res.ok) {
        setPost(data.posts[0]);
        setLoading(false);
        setError(false);
      }
    } catch (error) {
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchRecentPosts =async () => {
      try {
        const res =await fetch(`${import.meta.env.VITE_API_URL}/api/post/getPosts?limit=3`);
        const data =await res.json();
        if (res.ok) {
          setrecentPost(data.posts);
        }
      } catch (error) {
        console.log(error.message)
      }
    };
    fetchRecentPosts();
  }, [])
  

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Spinner size='xl' />
      </div>
    )
  }

  return (
    <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
      <h1 className='text-3xl mt-10 text-center font-serif max-w-2xl mx-auto'>
        {post && post.title}
      </h1>
      <Link to={`/search?category=${post && post.category}`} className='self-center mt-5'>
        <Button color='gray' pill size='xs'>
          {post && post.category}
        </Button>
      </Link>
      <div className='flex justify-center p-3 mt-10 max-h-[600px] w-full  object-contain'>
        <img src={post && post.image} alt={post && post.image} />
      </div>

      <div className='flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs '>
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span className='italic'>{post && (post.content.length / 1000).toFixed(0)} mins read</span>
      </div>

      <div className='p-3 max-w-2xl mx-auto w-full post-content'
        dangerouslySetInnerHTML={{ __html: post && post.content }} >

      </div>

      <div className='max-w-4xl mx-auto w-full'>
        <CallToAction />
      </div>

      <CommentSection postId={post._id}/>

      <div className='flex flex-col justify-center items-center mb-5'>
        <h1 className='text-xl mt-5'>Recent Articles</h1>

        <div className='flex flex-wrap justify-center gap-5 mt-5 '>
          {
            recentPost && 
              recentPost.map((post) => (
                <PostCard key={post._id} post={post} />
              ))
          }
        </div>
      </div>
    </main>
  )
}

export default PostPage