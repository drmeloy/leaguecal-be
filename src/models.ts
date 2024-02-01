import mongoose, { CallbackError, Schema } from "mongoose";
import bcrypt from 'bcrypt';
import { MongoUserDocument, MongoUserModel, User } from "./types"

const userSchema = new Schema<MongoUserDocument, MongoUserModel>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
})

userSchema.pre<User>('save', async function (next) {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(this.password, saltRounds);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error as CallbackError | undefined);
  }
});

const User = mongoose.model<MongoUserDocument, MongoUserModel>('User', userSchema);

export default User;