require('dotenv').config();
import express, { Response } from 'express';
import jwt from 'jsonwebtoken';
import { verifyJWT } from './middleware';
import { RequestWithUser } from './types';

const app = express();
const port = 3001;
const secretKey = process.env.JWT_SECRET || 'defaultSecretKey';

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

// Authentication route
app.post('/login', (req, res) => {
  // TO-DO: validate user credentials from a database
  const user = {
    id: 1,
    username: 'your-username'
  };

  jwt.sign({ user }, secretKey, { expiresIn: '1h' }, (err, token) => {
    if (err) throw err;
    res.json({ token });
  });
});

app.get('/dashboard', verifyJWT(secretKey), (req: RequestWithUser, res: Response) => {
  res.json({ message: 'Welcome to the dashboard!', user: req.user });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
