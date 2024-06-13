// import mongoose, { Schema } from 'mongoose';
import express from 'express';
import { Request, Response } from 'express';
import { protect } from '../middleware/auth';
import Post from '../models/Post';
import Joi from 'joi';
import { IUser } from '../models/User';

const router = express.Router();

export interface CustomRequest extends Request {
  user?: IUser;
  // {
  // IUser: mongoose.Document;
  // _id?: string;
  // };
}

// Validation schemas
const postSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required()
});

// Create a new post
router.post('/', protect, async (req: CustomRequest, res: Response) => {
  try {
    const { error } = postSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { title, content } = req.body;
    const newPost = new Post({
      title,
      content,
      user: req.user?._id
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all posts
router.get('/', async (req: Request, res: Response) => {
  try {
    const posts = await Post.find().populate('user', 'email');
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a post
router.put('/:id', protect, async (req: CustomRequest, res: Response) => {
  try {
    const { error } = postSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { title, content } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (!req.user || req.user._id?.toString() !== req.params.id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    post.title = title;
    post.content = content;
    await post.save();

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a post
router.delete('/:id', protect, async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (!req.user || req.user._id?.toString() !== req.params.id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await post.deleteOne();
    res.status(200).json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
