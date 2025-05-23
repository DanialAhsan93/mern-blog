import Post from "../models/post.model.js";
import { errorHandler } from "../utils/error.js"

export const create = async (req, res, next) => {

  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to create the post'))
  };

  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, 'Please provide all the fields'))
  };

  const slug = req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '');

  const newPost = new Post(
    {
      ...req.body,
      slug,
      userId: req.user.id
    }
  );

  try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);

  } catch (error) {
    next(error)
  }
};

export const getposts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;

    const sortDirection = req.query.order === 'asc' ? 1 : -1;
    const posts = await Post.find(
      {
        ...(req.query.userId && { userId: req.query.userId }),
        ...(req.query.category && { category: req.query.category }),
        ...(req.query.slug && { slug: req.query.slug }),
        ...(req.query.postId && { _id: req.query.postId }),
        ...(req.query.searchTerm && {
          $or: [
            { title: { $regex: req.query.searchTerm, $options: 'i' } },
            { content: { $regex: req.query.searchTerm, $options: 'i' } }
          ]
        })
      })
      .sort({ updatedAt: sortDirection }).skip(startIndex).limit(limit);

    // total number of posts in mongo db

    const totalPosts = await Post.countDocuments(); // countDocuments is a method used to count total no of posts in mongo db;

    //How to calculate total number of posts in mongo db last month

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo }
    });
    const isProduction = process.env.NODE_ENV === 'production';


    res.status(200).json({
      posts,
      totalPosts,
      lastMonthPosts,
      secure: isProduction, // only true in production (https)
      sameSite: isProduction ? 'None' : 'Lax',
    })


  } catch (error) {
    next(error)
  }
};

export const deletePost = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to delete the post'));
  };
  try {
    await Post.findByIdAndDelete(req.params.postId);
    res.status(200).json('The post has been deleted');
  } catch (error) {
    next(error)
  }
};

export const updatePost = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to update the post'));
  };

  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          category: req.body.category,
          image: req.body.image
        }
      }, { new: true }
    );
    const isProduction = process.env.NODE_ENV === 'production';

    res.status(200).json({
      updatedPost,
      secure: isProduction, // only true in production (https)
      sameSite: isProduction ? 'None' : 'Lax',

    })

  } catch (error) {
    next(error)
  }
};

