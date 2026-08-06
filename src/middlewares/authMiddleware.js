import jwt from 'jsonwebtoken';

export const requireAuth = (req, res, next) => {
  // 1. Check if the user sent a VIP wristband (Token) in the headers
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  // 2. Extract the actual token (It looks like "Bearer eyJhbGciOi...")
  const token = authHeader.split(' ')[1];

  try {
    // 3. Verify the token using our secret key (the same one used in generateToken)


    // 4. Attach the user's ID to the request so the controller can use it!
    req.user = jwt.verify(
      token,
      process.env.JWT_SECRET || 'supersecretvfxkey',
    );

    // 5. Let the user pass through the door to the next function
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Forbidden: Invalid token' });
  }
};
