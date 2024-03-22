require('dotenv').config();
import express, { Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import cors from 'cors';
import mongoose from 'mongoose';
import { verifyJWT } from './middleware';
import { MongoUserDocument, RequestWithUser } from './types';
import { mongoURI, secretKey } from './constants';
import User from './models';

const app = express();
const port = 3001;

mongoose.connect(mongoURI);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

// Authentication route
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user: MongoUserDocument | null = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    jwt.sign({ user }, secretKey, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.setHeader('Set-Cookie', `authToken=${token}; HttpOnly`);
      return res.status(200).json({ message: 'Login success!' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Registration route
app.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = new User({ username, password });

    await newUser.save();

    res.json({ message: 'Signup successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/dashboard', verifyJWT(secretKey), (req: RequestWithUser, res: Response) => {
  res.json({ message: 'Welcome to the dashboard!', user: req.user });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
