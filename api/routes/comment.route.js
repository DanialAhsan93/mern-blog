import express from "express";
import { createComment, deleteComment, editComment, getComments, getPostComment, likeComment } from "../controllers/comment.controller.js";
import {verifyToken} from '../utils/verifyUser.js';
const router = express.Router();

router.post('/create',verifyToken, createComment);
router.get('/getPostComments/:postId', getPostComment);
router.put('/likeComment/:commentId', verifyToken, likeComment);
router.put('/editComment/:commentId', verifyToken, editComment);
router.delete('/deletecomment/:commentId', verifyToken, deleteComment);
router.get('/getcomments', verifyToken, getComments);
export default router;