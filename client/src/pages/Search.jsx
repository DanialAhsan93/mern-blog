import { Button, Select, TextInput } from 'flowbite-react'
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PostCard from '../components/PostCard';

function Search() {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: '',
    sort: 'desc',
    category: 'uncategorized',
  });
  const navigate = useNavigate();
  const location = useLocation();
  const [posts, setposts] = useState([]);
  const [loading, setloading] = useState(false);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermfromUrl = urlParams.get('searchTerm');
    const sortFromUrl = urlParams.get('sort');
    const categoryFromUrl = urlParams.get('category');

    if (searchTermfromUrl || sortFromUrl || categoryFromUrl) {
      setSidebarData({
        ...sidebarData,
        searchTerm: searchTermfromUrl,
        sort: sortFromUrl,
        category: categoryFromUrl,
      })
    };
    const fetchPosts = async () => {
      setloading(true);
      const searchQuery = urlParams.toString();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/post/getposts?${searchQuery}`,{
        credentials : 'include'
      });

      if (!res.ok) {
        setloading(false);
        return;
      };

      if (res.ok) {
        const data = await res.json();
        setposts(data.posts);
        setloading(false);
        if (data.posts.length === 9) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
      }
    }
    fetchPosts();

  }, [location.search]);

  const handleChange = (e) => {
    if (e.target.id === 'searchTerm') {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value });
    }
    if (e.target.id === 'sort') {
      const order = e.target.value || 'desc'
      setSidebarData({ ...sidebarData, sort: order })
    };
    if (e.target.id === 'category') {
      const category = e.target.value || 'unCategorized'
      setSidebarData({ ...sidebarData, category: category })
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', sidebarData.searchTerm);
    urlParams.set('sort', sidebarData.sort);
    urlParams.set('category', sidebarData.category);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const handleShowMore =async () => {
    const numberOfPosts = posts.length;
    const startIndex = numberOfPosts;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();
    const res =await fetch(`${import.meta.env.VITE_API_URL}/api/post/getPosts?${searchQuery}`,{
      credentials : 'include'
    });

    if (!res.ok) {
      return;
    };
    if (res.ok) {
      const data =await res.json();
      setposts([...posts, ...data.posts]);
      if (data.posts.length === 9) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
    }
  }


  return (
    <div className='flex flex-col md:flex-row'>
      <div className='p-7 border-b  md:border-r md:min-h-screen border-gray-500'>
        <form onSubmit={handleSubmit} >
          <div className='flex flex-col gap-8'>
            <label className='whitespace-nowrap'>Search Term</label>
            <TextInput
              placeholder='search...'
              id='searchTerm'
              type='text'
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>

          <div className='flex flex-col gap-8 pt-4'>
            <label className='font-semibold'>Sort</label>
            <Select onChange={handleChange} value={sidebarData.sort} id='sort'>
              <option value='desc' >Latest</option>
              <option value='asc' >Oldest</option>
            </Select>
          </div>

          <div className='flex flex-col gap-8 pt-4'>
            <label className='font-semibold'>Category</label>
            <Select onChange={handleChange} value={sidebarData.category} id='category'>
              <option value='unCategorized' >UnCategorized</option>
              <option value='react js' >React.js</option>
              <option value='next js' >Next.js</option>
              <option value='javascript' >Javascript</option>
            </Select>
          </div>
          <Button type='submit' gradientDuoTone={'purpleToPink'} className='mt-8 w-full'>
            Apply filters
          </Button>

        </form>
      </div>

      <div className='w-full'>
        <h1 className='text-3xl font-semibold sm:border-b border-gray-500p-3 mt-5'>
          Post results:
        </h1>

        <div className='flex flex-wrap gap-4'>
          {
            !loading && posts.length === 0 && <p className='text-xl text-gray-500'>No posts found</p> 
          }
          {
            loading && <p className='text-xl text-gray-500'>loading...</p> 
          }
          {
            !loading && posts && posts.length > 0  && posts.map((post) => (
              <PostCard key={post._id} post={post} />
            )) 
          }
          {
            showMore && <button onClick={handleShowMore} className='text-teal-500 text-lg p-7 hover:underline  w-full'>
              Show More
            </button>
          }
        </div>
      </div>
    </div>
  )
}

export default Search