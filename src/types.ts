import { Request } from "express";

export type User = {
  id: number;
  username: string;
}

export interface RequestWithUser extends Request {
  user?: User;
}