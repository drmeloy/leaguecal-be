import mongoose, { Schema } from "mongoose";
import { MongoUserDocument, MongoUserModel } from "./types"

const userSchema = new Schema<MongoUserDocument, MongoUserModel>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
})

const User = mongoose.model<MongoUserDocument, MongoUserModel>('User', userSchema);

export default User;