// import express from 'express';
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import cookieParser from 'cookie-parser';
// import path from 'path';


// import userRoutes from './routes/user.route.js';
// import authRoutes from './routes/auth.route.js';
// import postRoutes from './routes/Post.route.js';
// import commentRoutes from './routes/comment.route.js';


// dotenv.config();

// mongoose.connect(process.env.MONGO).then (
//   () => {
//     console.log('MongoDb is connected')
//   }
//  ).catch ((err) => {
//   console.log(err)
//  })
  

// const app = express();

// app.use(express.json());
// app.use(cookieParser());

// app.use('/api/user', userRoutes);
// app.use('/api/auth', authRoutes);
// app.use('/api/post',postRoutes);
// app.use('/api/comment',commentRoutes);



// app.listen(3000,() => {
//   console.log('server is running on port 3000!');
// });


// app.use((err, req, res, next) => {
//   const statusCode = err.statusCode || 500;
//   const message = err.message || 'internal sever error';
//   res.status(statusCode).json({
//     success : false,
//     statusCode,
//     message,
//   })
// });

// export default app;

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import postRoutes from './routes/Post.route.js';
import commentRoutes from './routes/comment.route.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comment', commentRoutes);

// Vercel serverless function handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// Vercel will handle serverless deployment, so you don't need app.listen
export default app;