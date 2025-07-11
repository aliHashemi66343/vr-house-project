import bcrypt from "bcrypt"
import mongoose from "mongoose"
import { database } from "../config/database.js";

try {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
} catch (error) {}
const SALT_ROUNDS = 10;
 const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number,
  username:{
    type:String,
    required:true,
    unique:true
  },
  no_expire:Boolean,
  job:String,
  password:String
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    
    this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.pre("updateOne", async function (next) {
  const update = this.getUpdate();
  if (update.$set) {
    if (update.$set.password) {
      var hashed = await bcrypt.hash(update.$set.password, SALT_ROUNDS);

      update.$set.password = hashed;
      this.setUpdate(update);

    }}
  try {
    if (update?.password) {
      var hashed = await bcrypt.hash(update.password, SALT_ROUNDS);
      update.password=hashed;
      this.setUpdate(update)
    }
    
    next();
  } catch (err) {
    next(err);
  }
});
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};
  

export var User = mongoose.model("User", userSchema);
