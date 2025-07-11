import mongoose from "mongoose"
const tokenblocklistSchema = new mongoose.Schema({
  
  token: {
    type: String,
    required: true,
    unique: true,
  },
});



  

export var TokenBlockList = mongoose.model("TokenBlockList", tokenblocklistSchema);
