import mongoose, { Document, Schema } from 'mongoose';

// test
export interface IPost extends Document {
  title: string;
  content: string;
  user: mongoose.Schema.Types.ObjectId;
}

const postSchema: Schema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const Post = mongoose.model<IPost>('Post', postSchema);

export default Post;
