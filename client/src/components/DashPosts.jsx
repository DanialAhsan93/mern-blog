import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Table } from 'flowbite-react';
import { Link } from 'react-router-dom'
function DashPosts() {
  const [userPosts, setuserPosts] = useState([])
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUser.isAdmin) {
      fetchPosts();
    }
  }, [currentUser._id]);

  const fetchPosts = async () => {
    try {
      const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`);
      const data = await res.json();
      if (res.ok) {
        setuserPosts(data.posts);
      }
    } catch (error) {
      console.log(error)
    }
  };

  console.log(userPosts)

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {currentUser.isAdmin && userPosts.length > 0 ?
        (
          <>
            <Table hoverable className='shadow-md text-white'>
              <Table.Head>
                <Table.HeadCell>Date Updated</Table.HeadCell>
                <Table.HeadCell>Post image</Table.HeadCell>
                <Table.HeadCell>Post title</Table.HeadCell>
                <Table.HeadCell>Category</Table.HeadCell>
                <Table.HeadCell>Delete</Table.HeadCell>
                <Table.HeadCell>Edit</Table.HeadCell>

              </Table.Head>
              {userPosts.map((post) => {
                return (
                  <Table.Body key={post._id} className='divide-y'>
                    <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                      <Table.Cell className='text-gray-700 dark:text-white'>
                        {new Date(post.updatedAt).toLocaleDateString()}
                      </Table.Cell>
                      <Table.Cell>
                        <Link to={`/post/${post.slug}`}>
                          <img src={post.image} alt={post.title} className='w-20 h-10 object-fill bg-gray-500' />
                        </Link>
                      </Table.Cell>
                      <Table.Cell>
                        <Link to={`/post/${post.slug}`} className='font-medium text-gray-900 dark:text-white'>
                          {post.title}
                        </Link>
                      </Table.Cell>
                      <Table.Cell className='text-gray-700 dark:text-white'>{post.category}</Table.Cell>
                      <Table.Cell>
                        <span className='font-medium text-red-500 hover:underline cursor-pointer'>
                          Delete
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        <Link to={`/update-post/${post._id}`}>
                          <span className='text-teal-500 hover:underline'>
                            Edit
                          </span>
                        </Link>
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                )
              })}
            </Table>
          </>
        )
        :
        (
          <div>
            <p>You have no post yet!</p>
          </div>
        )
      }
    </div>
  )
}

export default DashPosts