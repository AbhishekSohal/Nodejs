const bcrypt = require('bcrypt');
const { prisma } = require('../lib/db');
const JWT = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

interface CreateUserPayload {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
}
interface GetUserTokenPayload {
  email: string;
  password: string;
}

class UserService {
  
  public static async createUser(payload: CreateUserPayload) {
    const { firstName, lastName, email, password } = payload;
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(password, saltRounds);

    return prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        salt: hashedPassword,
        password: hashedPassword,
      },
    });
  }
  private static getUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }
  public static async getUserToken(payload: GetUserTokenPayload) {
    const { email, password } = payload;
    const user = await this.getUserByEmail(email);
    if (!user) {
      throw new Error('User not found');
    };
    const userSalt = user.salt;
    const hashedPassword = bcrypt.hashSync(password, userSalt);
    if (hashedPassword !== user.password) {
      throw new Error('Invalid password');
    }
    const token = JWT.sign({ userId: user.id }, process.env.JWT_SECRET || 'default_secret');
    return token;
  }
    public static decodeJWT(token: string) {
    try {
      const decoded = JWT.verify(token, JWT_SECRET);
      return decoded;
    } catch (error) {
      throw new Error('Invalid token');
    }
}}
  


module.exports = { UserService}; 