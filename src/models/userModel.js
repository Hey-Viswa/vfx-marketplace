import prisma from '../config/db.js';

class UserModel {
  static async findUserByEmail(email) {
    return await prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  static async createUser(email, passwordHash) {
    return await prisma.user.create({
      data: {
        email: email,
        passwordHash: passwordHash,
      },
    });
  }
}

export default UserModel;
