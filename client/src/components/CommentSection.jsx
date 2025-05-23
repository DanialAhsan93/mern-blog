import { Alert, Button, Textarea } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import Comment from '../components/Comment';
import { useNavigate } from 'react-router-dom';

function CommentSection({ postId }) {
  const [comment, setComment] = useState('');
  const [commentError, setCommentError] = useState(null)
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.length > 200) {
      return
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/comment/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials : 'include',
        body: JSON.stringify({ content: comment, postId, userId: currentUser._id })
      });

      const data = await res.json();

      if (res.ok) {
        setComment('');
        setCommentError(null);
        setComments([data, ...comments])
      };
    } catch (error) {
      setCommentError(error.message)
    }

  };

  useEffect(() => {
    getComments();
  }, [postId]);

  const getComments = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/comment/getPostComments/${postId}`,{
        method : 'GET',
        credentials : 'include'
      });

      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLikeComment = async (commentId) => {
    try {
      if (!currentUser) {
        navigate('/signin');
        return;
      };

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/comment/likeComment/${commentId}`, {
        method: 'PUT',
        credentials : 'include'
      });
      if (res.ok) {
        const data = await res.json();
        console.log(data)
        setComments(comments.map((comment) =>
          comment._id === commentId ?
            {
              ...comment,
              likes: data.likes,
              numberOfLikes: data.likes.length,

            } : comment
        )
        )
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleEdit = async (comment, editedContent) => {
    setComments(comments.map((c) => (
      c._id === comment._id ? { ...c, content: editedContent } : c
    )))
  };

  const handleDelete = async (comment) => {
    if (!currentUser) {
      navigate('/signin');
      return;
    };
    comments.map((com) => {
      if (com._id === comment._id) {
        setComments(comments.filter((c) => c._id !== comment._id))
      }
    }
    )
}

return (
  <div className='max-w-2xl mx-auto w-full p-3'>
    {
      currentUser ?
        (
          <div className='flex items-center gap-1 text-gray-500 text-sm'>
            <p>Signed in as : </p>
            <img src={currentUser.profilePicture} alt={currentUser.profilePicture} className='h-5 w-5 object-cover rounded-full' />
            <Link to={'/dashboard?tab=profile'} className='text-xs text-cyan-500'>
              @{currentUser.username}
            </Link>
          </div>
        )
        :
        (
          <div className='text-sm text-teal-500 my-5 flex gap-1'>
            You must be signed in to comment
            <Link to={'/signin'} className='text-blue-500 hover:underline'>
              Sign In
            </Link>
          </div>
        )
    }

    {
      currentUser && (
        <form onSubmit={handleSubmit} className='border border-teal-500 rounded-md p-3'>
          <Textarea
            placeholder='Add a comment'
            rows={'3'}
            maxLength={'200'}
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
          <div className='flex justify-between items-center mt-5'>
            <p className='text-xs text-gray-500'>
              {200 - comment.length} characters remaining
            </p>
            <Button type='submit' outline gradientDuoTone={'purpleToBlue'} >
              Submit
            </Button>
          </div>
          {commentError && (
            <Alert color='failure' className='mt-5'>{commentError}</Alert>
          )}
        </form>
      )
    }

    {comments.length === 0 ?
      (
        <p className='text-sm my-5'>
          No Comments Yet!
        </p>
      ) :
      (
        <>
          <div className='text-sm my-5 flex items-center gap-1'>
            <p>Comments</p>
            <div className='border border-gray-400 py-1 px-2 rounded-sm'>
              <p>{comments.length}</p>
            </div>
          </div>

          {comments.map((commentItem) => (
            <Comment key={commentItem._id} comment={commentItem} onLike={handleLikeComment} onEdit={handleEdit} onDelete={handleDelete} />
          ))}
        </>

      )
    }
  </div>
)
}

export default CommentSection