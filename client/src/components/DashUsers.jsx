import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Modal, Table } from 'flowbite-react';
import { Link } from 'react-router-dom'
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { FaCheck } from "react-icons/fa6";
import { IoCloseSharp } from "react-icons/io5";


function DashUsers() {

  const [users, setUsers] = useState([]);
  const [showMore, setshowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState('');

  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUser.isAdmin) {
      fetchUsers();
    }
  }, [currentUser._id]);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`/api/user/getusers`);
      const data = await res.json();

      if (res.ok) {
        setUsers(data.users);
        // console.log(data.posts.length);
        if (data.users.length < 9) {
          setshowMore(false);
        }
      }

    } catch (error) {
      console.log(error)
    }
  };

  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => [...prev, ...data.users]);
        console.log(data.users.length)
        if (data.users.length < 9) {
          setshowMore(false)
        }
      }
    } catch (error) {
      console.log(error)
    }
  };




  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {currentUser.isAdmin && users.length > 0 ?
        (
          <>
            <Table hoverable className='shadow-md text-white'>
              <Table.Head>
                <Table.HeadCell>Date created</Table.HeadCell>
                <Table.HeadCell>User image</Table.HeadCell>
                <Table.HeadCell>Username</Table.HeadCell>
                <Table.HeadCell>Email</Table.HeadCell>
                <Table.HeadCell>Admin</Table.HeadCell>
                <Table.HeadCell>Delete</Table.HeadCell>

              </Table.Head>
              {users.map((user) => {
                return (
                  <Table.Body key={user._id} className='divide-y'>
                    <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                      <Table.Cell className='text-gray-700 dark:text-white'>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </Table.Cell>
                      <Table.Cell>
                        <img src={user.profilePicture} alt={user.username} className='w-10 h-10 object-fill bg-gray-500 rounded-full' />
                      </Table.Cell>
                      <Table.Cell>
                        {user.username}
                      </Table.Cell>
                      <Table.Cell className='text-gray-700 dark:text-white'>{user.email}</Table.Cell>
                      <Table.Cell className='text-gray-700 dark:text-white '>
                        {user.isAdmin === true ?
                          <FaCheck className='text-green-500'/>
                          :
                          <span className='text-red-500'>
                            <IoCloseSharp />
                          </span>
                        }

                      </Table.Cell>
                      <Table.Cell>
                        <span onClick={
                          () => {
                            setShowModal(true);
                            setUserIdToDelete(user._id);
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
            <p>You have no users yet!</p>
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
              <Button color={'failure'} >
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

export default DashUsers;