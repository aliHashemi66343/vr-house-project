import mongoose from "mongoose"
const postSchema = new mongoose.Schema({
  content: String,
  tags: String,
  view_number: Number,
  author_id:String,
  title: {
    type: String,
    required: true,
    unique: true,
  },
});



  

export var Post = mongoose.model("Post", postSchema);
