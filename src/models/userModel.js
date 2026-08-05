import prisma from '../config/db.js';

class UserModel {
  static async findUserByEmail(email) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    return user;
  }

  static async createUser(email, passwordHash) {
    const newUser = await prisma.user.createUser({
      data: {
        email: email,
        passwordHash: passwordHash,
      },
    });
    return newUser;
  }
}

export default UserModel;
