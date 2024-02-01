import { Request } from "express";
import { Document, Model } from "mongoose";

export type User = {
  username: string;
  password: string;
}

export type RequestWithUser = Request & {
  user?: User;
}

export type MongoUserDocument = User & Document;
export type MongoUserModel = Model<MongoUserDocument>;