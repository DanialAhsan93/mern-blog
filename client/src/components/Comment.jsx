import React, { useEffect, useState } from 'react'
import moment from 'moment';
import { FaThumbsUp } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Button, Textarea } from 'flowbite-react';

function Comment({ comment, onLike, onEdit }) {
  const [user, setUser] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);

  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/user/${comment.userId}`);
        const data = await res.json();

        if (res.ok) {
          setUser(data)
        }
      } catch (error) {
        console.log(error)
      }
    };
    getUser();
  }, [comment]);

  const handleEdit = () => {
    setIsEdit(true);
    setEditedContent(comment.content)
  };

  const handleSave = async () => {
    try {
      const res =await fetch(`/api/comment/editComment/${comment._id}`,{
        method : 'PUT',
        headers : {
          'Content-Type' : 'application/json'
        },
        body:JSON.stringify({
          content : editedContent
        })
      });
      if (res.ok) {
        setIsEdit(false);
        onEdit(comment, editedContent);
      }
    } catch (error) {
      console.log(error.message);
    }
  }
  return (
    <div className='flex p-4 border-b dark:border-gray-600 text-sm'>
      <div className='flex-shrink-0 mr-3'>
        <img src={user.profilePicture} alt={user.username} className='w-10 h-10 rounded-full bg-gray-200' />
      </div>

      <div className='flex-1'>
        <div className='flex items-center mb-1'>
          <span className='font-bold mr-1 text-sm truncate'>
            {user ? `@${user.username}` : "anonymous user"}
          </span>

          <span className='text-gray-500 text-xs'>
            {moment(comment.createdAt).fromNow()}
          </span>

        </div>
        {
          isEdit ?
            (
              <>
                <Textarea
                  className='mb-2'
                  onChange={(e) => setEditedContent(e.target.value)}
                  value={editedContent}
                />
                <div className='flex justify-end pt-2 text-xs'>
                  <Button
                    type='button'
                    size='sm' 
                    gradientDuoTone='purpleToBlue'
                    className='mr-2'
                    onClick={handleSave}
                    >
                    Save
                  </Button>

                  <Button
                    type='button'
                    size='sm'
                    gradientDuoTone='purpleToBlue'
                    onClick={() => setIsEdit(false)}
                    outline
                  >
                    Cancel
                  </Button>
                </div>

              </>
            )
            :
            (
              <>
                <p className='text-gray-500 pb-2'>{comment.content}</p>
                <div className='flex items-center pt-2 text-xs border-t dark:border-gray-700 gap-2'>
                  <button className={`text-gray-400 hover:text-blue-500
           ${currentUser && comment.likes.includes(currentUser._id) && '!text-blue-500'}
           `}
                    type='button'
                    onClick={() => onLike(comment._id)}
                  >
                    <FaThumbsUp className='text-sm' />
                  </button>
                  <p className='text-gray-400'>
                    {
                      comment.numberOfLikes > 0 && comment.numberOfLikes + " " + (comment.numberOfLikes === 1 ? 'like' : 'likes')
                    }
                  </p>
                  {
                    currentUser && (currentUser._id === comment.userId || currentUser.isAdmin) && (
                      <button
                        className='text-gray-400 hover:text-blue-500'
                        onClick={handleEdit}
                      >
                        Edit
                      </button>
                    )
                  }

                </div>
              </>

            )
        }



      </div >
    </div >
  )
}

export default Comment