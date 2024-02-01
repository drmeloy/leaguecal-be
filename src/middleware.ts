import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, RequestWithUser } from './types';

export const verifyJWT = (secretKey: string) => (req: RequestWithUser, res: Response, next: NextFunction) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded as User;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};