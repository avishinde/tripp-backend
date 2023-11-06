const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const token = req.headers['authorization'];
   // console.log('token',token)
  if (!token) {
   console.log('token not found')
    return res.status(401).json({ error: 'Unauthorized' });
    
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error('JWT Error:', err);
      return res.status(401).json({ error: 'Unauthorized' });
    }

    req.userId = decoded.userId;
    next();
  });
}

module.exports = verifyToken;
