const { verifyToken } = require("../utils/jwtUtils");
const { HttpException } = require("../errors/HttpException");
const { users } = require("../model");

class UserService {
  async edit(req) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = verifyToken(token);

      if (decodedToken) {
        const { name, address } = req.body;
        const updatedUser = await users.update(
          { name, address },
          {
            where: {
              id: decodedToken.user.id,
            },
            returning: true,
          }
        );

        if (updatedUser) {
          return updatedUser;
        } else {
          throw new HttpException(404, "User not found");
        }
      } else {
        throw new HttpException(401, "Invalid token");
      }
    } catch (error) {
      console.log(error);
      throw new HttpException(error.status || 500, error.message);
    }
  }
  async getall() {
    try {
      const allUsers = await users.findAll({
        attributes: ["randomNumber"],
        order: [["randomNumber", "ASC"]],
      });

      return allUsers.map((user) => user.randomNumber);
    } catch (error) {
      console.error(error);
      throw new HttpException(401, "Error in getall");
    }
  }
}

module.exports = UserService;
