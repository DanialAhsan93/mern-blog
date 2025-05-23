import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import postRoutes from './routes/Post.route.js';
import commentRoutes from './routes/comment.route.js';
import cors from 'cors';

dotenv.config();

mongoose.connect(process.env.MONGO).then (
  () => {
    console.log('MongoDb is connected')
  }
 ).catch ((err) => {
  console.log(err)
 })
  

const app = express();
app.use(cors({
  origin: ['http://localhost:5173', , 'https://danialahsan93.github.io'],
  credentials: true, // only if you're using cookies or sessions
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/post',postRoutes);
app.use('/api/comment',commentRoutes);

app.get("/", (req, res) => {
  res.send("This is new!");
});


// app.listen(3000,() => {
//   console.log('server is running on port 3000!');
// });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}!`);
});


app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'internal sever error';
  res.status(statusCode).json({
    success : false,
    statusCode,
    message,
  })
});

export default app;
