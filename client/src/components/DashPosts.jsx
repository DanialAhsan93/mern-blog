import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Modal, Table } from 'flowbite-react';
import { Link } from 'react-router-dom'
import { HiOutlineExclamationCircle } from 'react-icons/hi';
function DashPosts() {
  const [userPosts, setuserPosts] = useState([]);
  const [showMore, setshowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState('');
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUser.isAdmin) {
      const fetchPosts = async () => {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/api/post/getposts?userId=${currentUser._id}`);
          const data = await res.json();
          console.log(data)
          if (res.ok) {
            setuserPosts(data.posts);

            if (data.posts.length < 9) {
              setshowMore(false);
            }
          }

        } catch (error) {
          console.log(error)
        }
      };
      fetchPosts();
    }
  }, [currentUser._id]);




  const handleShowMore = async () => {
    const startIndex = userPosts.length;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`, {
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok) {
        setuserPosts((prev) => [...prev, ...data.posts]);
        console.log(data.posts.length)
        if (data.posts.length < 9) {
          setshowMore(false)
        }
      }
    } catch (error) {
      console.log(error)
    }
  };

  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/post/deletepost/${postIdToDelete}/${currentUser._id}`,
        {
          method: 'DELETE',
          credentials: 'include'
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);

      } else {
        setuserPosts(userPosts.filter((post) => post._id !== postIdToDelete));
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  console.log(userPosts);
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
              {userPosts && userPosts.map((post) => {
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
                        <span onClick={
                          () => {
                            setShowModal(true);
                            setPostIdToDelete(post._id);
                          }
                        }
                          className='font-medium text-red-500 hover:underline cursor-pointer'>
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
            {
              showMore && (
                <button className='text-teal-500 w-full mx-auto' onClick={handleShowMore}>
                  Show More
                </button>
              )
            }
          </>
        )
        :
        (
          <div>
            <p>You have no post yet!</p>
          </div>
        )
      }
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size='md'
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 data:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete your account?</h3>
            <div className='flex justify-center gap-5'>
              <Button color={'failure'} onClick={handleDeletePost}>
                Yes, I'm sure
              </Button>
              <Button color={'gray'} onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>

      </Modal>
    </div>
  )
}

export default DashPosts