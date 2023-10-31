const bcrypt = require("bcrypt");
const { users, phone_tables, email_tables } = require("../model");
const { isEmpty } = require("../utils/empty");
const { HttpException } = require("../errors/HttpException");

class AuthService {
  async signup(userData) {
    if (isEmpty(userData)) {
      throw new HttpException(400, "Request body is empty");
    }
    let createdUser;
    if (userData.name) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      createdUser = await users.create({
        name: userData.name,
        password: hashedPassword,
      });
      if (userData.email) {
        await email_tables.create({
          email: userData.email,
          userId: createdUser.id,
        });
      }
      if (userData.phone) {
        await phone_tables.create({
          phone: userData.phone,
          userId: createdUser.id,
        });
      }
    } else {
      throw new HttpException(400, "User name is required");
    }
  }
}

module.exports = AuthService;
