import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Modal, Table } from 'flowbite-react';
import { Link } from 'react-router-dom'
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { FaCheck } from "react-icons/fa6";
import { IoCloseSharp } from "react-icons/io5";


function DashComments() {

  const [comments, setComments] = useState([]);
  const [showMore, setshowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState('');
  console.log(comments);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUser.isAdmin) {
      fetchComments();
    }

  }, [currentUser._id]);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comment/getcomments`);
      const data = await res.json();

      if (res.ok) {
        setComments(data.comments);
        if (data.comments.length < 9) {
          setshowMore(false);
        }
      }

    } catch (error) {
      console.log(error)
    }
  };

  const handleShowMore = async () => {
    const startIndex = comments.length;
    try {
      const res = await fetch(`/api/comment/getcomments?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setComments((prev) => [...prev, ...data.comments]);

        if (data.comments.length < 9) {
          setshowMore(false)
        }
      }
    } catch (error) {
      console.log(error)
    }
  };

  const handleDeleteComment = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/comment/deletecomment/${commentIdToDelete}`, {
        method: 'DELETE'
      })
      const data = await res.json();

      if (res.ok) {
        setComments((prev) => prev.filter((comment) => comment._id !== commentIdToDelete));
      } else {
        console.log(data.message);
      };
    } catch (error) {
      console.log(error.message);
    }
  }


  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {currentUser.isAdmin && comments.length > 0 ?
        (
          <>
            <Table hoverable className='shadow-md text-white'>
              <Table.Head>
                <Table.HeadCell>Date updatedAt</Table.HeadCell>
                <Table.HeadCell>Comment Content</Table.HeadCell>
                <Table.HeadCell>No Of Likes</Table.HeadCell>
                <Table.HeadCell>PostId</Table.HeadCell>
                <Table.HeadCell>UserId</Table.HeadCell>
                <Table.HeadCell>Delete</Table.HeadCell>

              </Table.Head>
              {comments.map((comment) => {
                return (
                  <Table.Body key={comment._id} className='divide-y'>
                    <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                      <Table.Cell className='text-gray-700 dark:text-white'>
                        {new Date(comment.updatedAt).toLocaleDateString()}
                      </Table.Cell>
                      <Table.Cell className='text-gray-700 dark:text-white'>
                        {comment.content}
                      </Table.Cell>
                      <Table.Cell className='text-gray-700 dark:text-white'>
                        {comment.numberOfLikes}
                      </Table.Cell>
                      <Table.Cell className='text-gray-700 dark:text-white'>{comment.postId}</Table.Cell>
                      <Table.Cell className='text-gray-700 dark:text-white '>
                        {comment.userId}

                      </Table.Cell>
                      <Table.Cell>
                        <span onClick={
                          () => {
                            setShowModal(true);
                            setCommentIdToDelete(comment._id);
                          }
                        }
                          className='font-medium text-red-500 hover:underline cursor-pointer'>
                          Delete
                        </span>
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
            <p>You have no comments yet!</p>
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
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete this comment?</h3>
            <div className='flex justify-center gap-5'>
              <Button color={'failure'} onClick={handleDeleteComment}>
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

export default DashComments;