import {Document, Schema, Types, model} from "mongoose";
import commentSchema, {IComment} from "./comment";

export interface IPost extends Document {
  title: string;
  description: string;
  content: string;
  introtext: string;
  imageURL: string;
  slug: string;
  createdAt: Date;
  tags: string[];
  category: string;
  createdBy: Types.ObjectId;
  comments?: IComment[];
}

const postSchema = new Schema<IPost>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  introtext: {
    type: String,
    required: false,
  },
  imageURL: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: new Date(),
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    required: true,
  },
  createdBy: {
    type: Types.ObjectId,
    ref: "User",
  },
  comments: [commentSchema],
});

const Post = model<IPost>("Post", postSchema);

export default Post;
