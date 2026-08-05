import UserModel from '../models/userModel.js';
import bcrypt from 'bcrypt';

class AuthController {
  static async register(req, res) {
    try {
      const { email, password } = req.body;
      const existingUser = await UserModel.findUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          error: 'Email already in use',
        });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await UserModel.createUser(email, hashedPassword);
      return res.status(201).json({
        message: 'User Created',
        userId: newUser.id,
      });
    } catch (error) {
      return res.status(500).json({
        error: 'Server error',
      });
    }
  }
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const getUser = await UserModel.findUserByEmail(email);
      if (!getUser) {
        return res.status(400).json({
          error: 'User not found',
        });
      }
      const isPasswordValid = await bcrypt.compare(
        password,
        getUser.passwordHash,
      );
      if (!isPasswordValid) {
        return res.status(401).json({
          message: 'Invalid Credentials',
        });
      }
      return res.status(200).json({
        message: 'Login successful',
        userId: getUser.id,
      });
    } catch (e) {
      return res.status(500).json({
        error: 'Server error',
      });
    }
  }
}

export default AuthController;
