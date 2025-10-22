import jwt from 'jsonwebtoken';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log(`[AUTH] JWT verification failed: ${err.message}`);
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    console.log(`[AUTH] JWT verified for user: ${user.email}`);
    req.user = user;
    next();
  });
};

export { authenticateToken };