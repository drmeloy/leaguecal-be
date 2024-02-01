require('dotenv').config();
import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const app = express();
const port = 3001;
const secretKey = process.env.JWT_SECRET || 'defaultSecretKey';
console.log('secret key: ' + secretKey)

const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    // Attach the decoded user information to the request object
    (req as any).user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

app.use(express.json());

// Public route
app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

// Authentication route
app.post('/login', (req, res) => {
  // In a real application, validate user credentials from a database
  const user = {
    id: 1,
    username: 'your-username'
  };

  // Create a JWT token and send it to the client
  jwt.sign({ user }, secretKey, { expiresIn: '1h' }, (err, token) => {
    if (err) throw err;
    res.json({ token });
  });
});

// Protected route - requires authentication
app.get('/dashboard', verifyJWT, (req, res) => {
  res.json({ message: 'Welcome to the dashboard!', user: (req as any).user });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
